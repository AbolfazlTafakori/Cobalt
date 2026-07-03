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
        _dataDir = Path.Combine(env.ContentRootPath, "Data");
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
    public JsonNode GetContent()
    {
        lock (_gate)
        {
            var text = File.ReadAllText(_contentFile);
            return JsonNode.Parse(text) ?? new JsonObject();
        }
    }

    public void SaveContent(JsonNode content)
    {
        lock (_gate)
        {
            File.WriteAllText(_contentFile, content.ToJsonString(JsonOpts));
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
            File.WriteAllText(_contentFile, root.ToJsonString(JsonOpts));
            return section;
        }
    }

    public void ReplaceSection(string key, JsonObject value)
    {
        lock (_gate)
        {
            var root = ReadContentObject();
            root[key] = value.DeepClone();
            File.WriteAllText(_contentFile, root.ToJsonString(JsonOpts));
        }
    }

    private JsonObject ReadContentObject()
    {
        var text = File.ReadAllText(_contentFile);
        return JsonNode.Parse(text) as JsonObject ?? new JsonObject();
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
            // Validate it parses before committing.
            JsonNode.Parse(json);
            File.WriteAllText(_contentFile, json);
        }
    }
}
