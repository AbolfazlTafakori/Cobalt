import { Navigate, Route, Routes } from 'react-router-dom';
import { isAuthed } from './api';
import { ToastProvider } from './components/Toast';
import { ConfirmProvider } from './components/useConfirm';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Identity from './pages/Identity';
import NavbarEditor from './pages/NavbarEditor';
import Theme from './pages/Theme';
import HomeStats from './pages/HomeStats';
import AboutEditor from './pages/AboutEditor';
import SkillsEditor from './pages/SkillsEditor';
import ProjectsEditor from './pages/ProjectsEditor';
import ContactEditor from './pages/ContactEditor';
import SocialsEditor from './pages/SocialsEditor';
import Password from './pages/Password';

function RequireAuth({ children }) {
  return isAuthed() ? children : <Navigate to="/admin/login" replace />;
}

export default function AdminApp() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="identity" replace />} />
            <Route path="identity" element={<Identity />} />
            <Route path="navbar" element={<NavbarEditor />} />
            <Route path="theme" element={<Theme />} />
            <Route path="home" element={<HomeStats />} />
            <Route path="about" element={<AboutEditor />} />
            <Route path="skills" element={<SkillsEditor />} />
            <Route path="projects" element={<ProjectsEditor />} />
            <Route path="contact" element={<ContactEditor />} />
            <Route path="socials" element={<SocialsEditor />} />
            <Route path="password" element={<Password />} />
          </Route>
          <Route path="*" element={<Navigate to="identity" replace />} />
        </Routes>
      </ConfirmProvider>
    </ToastProvider>
  );
}
