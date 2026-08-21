import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import AboutPage from './pages/AboutPage';
import './index.css';
import './App.css';

import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

function AppLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
}
