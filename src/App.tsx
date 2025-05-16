
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth/auth-context";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Analytics from "./pages/Analytics";
import ContentCalendar from "./pages/ContentCalendar";
import ContentSuggestions from "./pages/ContentSuggestions";
import SocialProfiles from "./pages/SocialProfiles";
import Engagement from "./pages/Engagement";
import Audience from "./pages/Audience";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LoadingPage from "./pages/LoadingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Initial Loading Route */}
            <Route path="/loading" element={<LoadingPage />} />
            
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Redirect root to loading page */}
            <Route path="/" element={<Navigate to="/loading" replace />} />
            
            {/* Protected Routes with shared Layout */}
            <Route path="/dashboard" element={<Layout />}>
              {/* Basic User Access */}
              <Route index element={<ProtectedRoute requiredRoles={['user', 'admin']}><Dashboard /></ProtectedRoute>} />
              <Route path="analytics" element={<ProtectedRoute requiredRoles={['user', 'admin']}><Analytics /></ProtectedRoute>} />
              <Route path="calendar" element={<ProtectedRoute requiredRoles={['user', 'admin']}><ContentCalendar /></ProtectedRoute>} />
              <Route path="content-suggestions" element={<ProtectedRoute requiredRoles={['user', 'admin']}><ContentSuggestions /></ProtectedRoute>} />
              <Route path="profiles" element={<ProtectedRoute requiredRoles={['user', 'admin']}><SocialProfiles /></ProtectedRoute>} />
              <Route path="engagement" element={<ProtectedRoute requiredRoles={['user', 'admin']}><Engagement /></ProtectedRoute>} />
              <Route path="audience" element={<ProtectedRoute requiredRoles={['user', 'admin']}><Audience /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute requiredRoles={['user', 'admin']}><Profile /></ProtectedRoute>} />
              
              {/* Admin Only */}
              <Route path="settings" element={<ProtectedRoute requiredRoles={['admin']}><Settings /></ProtectedRoute>} />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
