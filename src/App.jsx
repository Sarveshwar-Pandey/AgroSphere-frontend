import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import Landing from './pages/Landing';
import { Protected } from './components/Protected';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import Verification from './pages/Verification';
import AdminConsole from './pages/AdminConsole';

// Feature pages (inside app)
import Forum from './pages/Forum';
import CropRecommendation from './pages/ml/CropRecommendation';
import DiseaseDetection from './pages/ml/DiseaseDetection';
import FertilizerRecommendation from './pages/ml/FertilizerRecommendation';

function Forbidden() {
  return (
    <div className="min-h-[100svh] bg-cream flex items-center justify-center px-5">
      <div className="w-full max-w-[640px] rounded-2xl bg-beige/40 border border-neutral-900/10 p-10 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
        <div className="font-serif text-greenDeep text-[40px] leading-[1.05] tracking-wide">Access restricted</div>
        <div className="mt-4 text-neutral-900/65 tracking-wide">This area is not available for your account.</div>
      </div>
    </div>
  );
}

function AppHome() {
  return (
    <div className="max-w-[70ch]">
      <div className="font-serif text-greenDeep text-[52px] leading-[1.06] tracking-wide">Your workspace</div>
      <div className="mt-4 text-neutral-900/65 tracking-wide leading-[1.75]">
        Enter any feature from the headbar. Everything is authenticated, and your requests flow securely through the backend.
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forbidden" element={<Forbidden />} />

      <Route
        path="/app"
        element={
          <Protected>
            <AppShell />
          </Protected>
        }
      >
        <Route index element={<AppHome />} />
        <Route path="account" element={<Account />} />
        <Route path="verification" element={<Verification />} />
        <Route
          path="admin"
          element={
            <Protected roles={['admin']}>
              <AdminConsole />
            </Protected>
          }
        />
        <Route path="crop-recommendation" element={<CropRecommendation />} />
        <Route path="disease-detection" element={<DiseaseDetection />} />
        <Route path="fertilizer-recommendation" element={<FertilizerRecommendation />} />
        <Route path="forum" element={<Forum />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
