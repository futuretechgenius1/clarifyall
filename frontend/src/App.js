import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ToolDetailPage from './components/ToolDetailPage';
import CategoriesPage from './components/CategoriesPage';
import AboutPage from './components/AboutPage';
import SubmitToolPage from './components/SubmitToolPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
import VerifyEmailPage from './components/auth/VerifyEmailPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserProfile from './components/UserProfile';
import SavedToolsPage from './components/SavedToolsPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import CookiePolicy from './components/CookiePolicy';
import Disclaimer from './components/Disclaimer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Admin routes without Navbar */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Auth routes without Navbar */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            
            {/* Public routes with Navbar and Footer */}
            <Route path="/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tool/:id" element={<ToolDetailPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route 
                    path="/submit" 
                    element={
                      <ProtectedRoute requireVerified={true}>
                        <SubmitToolPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile/:userId" 
                    element={<UserProfile />} 
                  />
                  <Route 
                    path="/saved-tools" 
                    element={
                      <ProtectedRoute>
                        <SavedToolsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/my-submissions" 
                    element={
                      <ProtectedRoute>
                        <UserProfile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/cookies" element={<CookiePolicy />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                </Routes>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
