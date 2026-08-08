using System.Text.Json;
using System.Text.Json.Nodes;

namespace ResumeAPI;

// Thread-safe JSON file store. Holds the single site-content document, the admin
// account, and the legacy collections — each backed by a file under Data/.
public class DataStore
{
    private readonly string _dataDir;
    private readonly string _uploadsDir;
    private readonly string _contentFile;
    private readonly string _authFile;
    private readonly string _collectionsFile;
    private readonly object _gate = new();

    private static readonly JsonSerializerOptions JsonOpts = new() { WriteIndented = true };

    public string UploadsDir => _uploadsDir;
    public string DataDir => _dataDir;
    public string ContentFile => _contentFile;

    public DataStore(IWebHostEnvironment env, IConfiguration config)
    {
        // Data directory can be overridden (e.g. a persistent path on a server)
        // via the "Data:Dir" config key or the Data__Dir environment variable.
        var configuredDir = config["Data:Dir"];
        _dataDir = string.IsNullOrWhiteSpace(configuredDir)
            ? Path.Combine(env.ContentRootPath, "Data")
            : configuredDir;
        _uploadsDir = Path.Combine(_dataDir, "uploads");
        _contentFile = Path.Combine(_dataDir, "content.json");
        _authFile = Path.Combine(_dataDir, "auth.json");
        _collectionsFile = Path.Combine(_dataDir, "collections.json");

        Directory.CreateDirectory(_dataDir);
        Directory.CreateDirectory(_uploadsDir);

        // Seed the admin account on first run.
        if (!File.Exists(_authFile))
        {
            var defaultUser = config["Admin:Username"] ?? "admin";
            var defaultPass = config["Admin:Password"] ?? "admin123";
            var account = new AdminAccount
            {
                Username = defaultUser,
                PasswordHash = PasswordHasher.Hash(defaultPass),
            };
            File.WriteAllText(_authFile, JsonSerializer.Serialize(account, JsonOpts));
        }

        // The site content starts empty; the React app deep-merges it over its
        // own built-in defaults, so an empty document renders the default site.
        if (!File.Exists(_contentFile))
            File.WriteAllText(_contentFile, "{}");

        if (!File.Exists(_collectionsFile))
            File.WriteAllText(_collectionsFile, "{}");
    }

    // ---- Site content document ----

    // Revision counter stored alongside the content. Every admin page holds the
    // whole document in memory and saves all of it, so without this a tab that
    // was loaded before someone else's save would silently overwrite their work.
    public const string RevKey = "_rev";

    public JsonNode GetContent()
    {
        lock (_gate)
        {
            var text = File.ReadAllText(_contentFile);
            return JsonNode.Parse(text) ?? new JsonObject();
        }
    }

    public record SaveResult(bool Ok, long Rev, JsonNode? Doc);

    // Writes the document only if the caller's revision still matches the stored
    // one. A body with no revision is accepted as-is, so older clients and the
    // restore path keep working.
    public SaveResult SaveContent(JsonNode content)
    {
        lock (_gate)
        {
            var storedRev = CurrentRev();
            var incoming = content as JsonObject ?? new JsonObject();

            if (incoming[RevKey] is JsonNode sent && TryReadRev(sent, out var clientRev)
                && clientRev != storedRev)
            {
                return new SaveResult(false, storedRev, null);
            }

            var nextRev = storedRev + 1;
            incoming[RevKey] = nextRev;
            File.WriteAllText(_contentFile, incoming.ToJsonString(JsonOpts));
            return new SaveResult(true, nextRev, incoming);
        }
    }

    // Caller must hold _gate.
    private long CurrentRev()
    {
        var root = ReadContentObject();
        return root[RevKey] is JsonNode n && TryReadRev(n, out var rev) ? rev : 0;
    }

    private static bool TryReadRev(JsonNode node, out long rev)
    {
        try
        {
            rev = node.GetValue<long>();
            return true;
        }
        catch
        {
            rev = 0;
            return false;
        }
    }

    // ---- Sub-object helpers (profile, sitetexts) live inside the content doc ----
    public JsonObject GetSection(string key)
    {
        lock (_gate)
        {
            var root = ReadContentObject();
            return root[key] as JsonObject ?? new JsonObject();
        }
    }

    // Shallow-merge the patch over the existing section, then persist.
    public JsonObject MergeSection(string key, JsonObject patch)
    {
        lock (_gate)
        {
            var root = ReadContentObject();
            var section = root[key] as JsonObject ?? new JsonObject();
            foreach (var kv in patch)
                section[kv.Key] = kv.Value?.DeepClone();
            root[key] = section;
            WriteContentObject(root);
            return section;
        }
    }

    public void ReplaceSection(string key, JsonObject value)
    {
        lock (_gate)
        {
            var root = ReadContentObject();
            root[key] = value.DeepClone();
            WriteContentObject(root);
        }
    }

    private JsonObject ReadContentObject()
    {
        var text = File.ReadAllText(_contentFile);
        return JsonNode.Parse(text) as JsonObject ?? new JsonObject();
    }

    // Every write to content.json goes through here so the revision always
    // moves forward — otherwise a tab loaded before a section-level write could
    // still save over it.
    private void WriteContentObject(JsonObject root)
    {
        var rev = root[RevKey] is JsonNode n && TryReadRev(n, out var r) ? r : 0;
        root[RevKey] = rev + 1;
        File.WriteAllText(_contentFile, root.ToJsonString(JsonOpts));
    }

    // ---- Auth account ----
    public AdminAccount GetAccount()
    {
        lock (_gate)
        {
            var text = File.ReadAllText(_authFile);
            return JsonSerializer.Deserialize<AdminAccount>(text) ?? new AdminAccount();
        }
    }

    public void SaveAccount(AdminAccount account)
    {
        lock (_gate)
        {
            File.WriteAllText(_authFile, JsonSerializer.Serialize(account, JsonOpts));
        }
    }

    // ---- Legacy collections (skills/projects/education/experience/socials) ----
    public JsonArray GetCollection(string name)
    {
        lock (_gate)
        {
            var all = ReadCollections();
            return all[name] as JsonArray ?? new JsonArray();
        }
    }

    public JsonObject AddToCollection(string name, JsonObject item)
    {
        lock (_gate)
        {
            var all = ReadCollections();
            var arr = all[name] as JsonArray ?? new JsonArray();

            var nextId = 1;
            foreach (var node in arr)
                if (node?["id"]?.GetValue<int>() is int id && id >= nextId)
                    nextId = id + 1;

            var clone = item.DeepClone().AsObject();
            clone["id"] = nextId;
            arr.Add(clone);
            all[name] = arr;
            WriteCollections(all);
            return clone;
        }
    }

    public JsonObject? UpdateInCollection(string name, int id, JsonObject item)
    {
        lock (_gate)
        {
            var all = ReadCollections();
            var arr = all[name] as JsonArray;
            if (arr is null) return null;

            for (var i = 0; i < arr.Count; i++)
            {
                if (arr[i]?["id"]?.GetValue<int>() == id)
                {
                    var clone = item.DeepClone().AsObject();
                    clone["id"] = id;
                    arr[i] = clone;
                    WriteCollections(all);
                    return clone;
                }
            }
            return null;
        }
    }

    public bool RemoveFromCollection(string name, int id)
    {
        lock (_gate)
        {
            var all = ReadCollections();
            var arr = all[name] as JsonArray;
            if (arr is null) return false;

            for (var i = 0; i < arr.Count; i++)
            {
                if (arr[i]?["id"]?.GetValue<int>() == id)
                {
                    arr.RemoveAt(i);
                    WriteCollections(all);
                    return true;
                }
            }
            return false;
        }
    }

    private JsonObject ReadCollections()
    {
        var text = File.ReadAllText(_collectionsFile);
        return JsonNode.Parse(text) as JsonObject ?? new JsonObject();
    }

    private void WriteCollections(JsonObject all)
    {
        File.WriteAllText(_collectionsFile, all.ToJsonString(JsonOpts));
    }

    // Overwrite content.json wholesale — used by restore.
    public void RestoreContentRaw(string json)
    {
        lock (_gate)
        {
            // Validate it parses before committing, then bump the revision so
            // any admin tab open across the restore is forced to reload.
            var restored = JsonNode.Parse(json) as JsonObject ?? new JsonObject();
            var currentRev = CurrentRev();
            restored[RevKey] = currentRev + 1;
            File.WriteAllText(_contentFile, restored.ToJsonString(JsonOpts));
        }
    }
}
