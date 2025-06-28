import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoginPage from './components/Auth/LoginPage';
import OnboardingPage from './components/Auth/OnboardingPage';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import SystemDashboard from './components/Dashboard/SystemDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import DeviationFormWithAudit from './components/Investigation/DeviationFormWithAudit';
import AuditTrailViewer from './components/AuditTrail/AuditTrailViewer';
import ReportGeneratorEnhanced from './components/Reports/ReportGeneratorEnhanced';
import AdvancedAnalytics from './components/Analytics/AdvancedAnalytics';
import Settings from './components/Settings/Settings';
import EventDiscovery from './components/Process/EventDiscovery';
import Triage from './components/Process/Triage';
import { DeviationProvider } from './context/DeviationContext';

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function App() {
  // Mock user role - in real app this would come from authentication
  const [userRole] = useState('System Admin'); // Can be 'System Admin', 'QA Investigator', 'Production Supervisor', 'QA Manager'
  const isSystemAdmin = userRole === 'System Admin';

  return (
    <AuthProvider>
      <DeviationProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          } />
          
          {/* Main Application Routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={
                    isSystemAdmin ? (
                      <SystemDashboard />
                    ) : (
                      <UserDashboard userRole={userRole} />
                    )
                  } />
                  <Route path="/investigation" element={<DeviationFormWithAudit />} />
                  <Route path="/investigation/:deviationId" element={<DeviationFormWithAudit />} />
                  <Route path="/audit-trail" element={<AuditTrailViewer />} />
                  <Route path="/audit-trail/:deviationId" element={<AuditTrailViewer />} />
                  <Route path="/reports" element={<ReportGeneratorEnhanced />} />
                  <Route path="/analytics" element={<AdvancedAnalytics />} />
                  <Route path="/settings" element={<Settings />} />
                  
                  {/* Investigation Process Step Routes */}
                  <Route path="/investigation/event-discovery" element={<EventDiscovery />} />
                  <Route path="/investigation/triage" element={<Triage />} />
                  <Route path="/investigation/notification" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Step 3: Notification & Documentation</h1>
                      <p>Coming soon...</p>
                    </div>
                  } />
                  <Route path="/investigation/preliminary-review" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Step 4: Preliminary Review</h1>
                      <p>Coming soon...</p>
                    </div>
                  } />
                  <Route path="/investigation/investigation-initiation" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Step 5: Investigation Initiation</h1>
                      <p>Coming soon...</p>
                    </div>
                  } />
                  <Route path="/investigation/data-collection" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Step 6: Data Collection</h1>
                      <p>Coming soon...</p>
                    </div>
                  } />
                  <Route path="/investigation/root-cause-analysis" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Step 7: Root Cause Analysis</h1>
                      <p>Coming soon...</p>
                    </div>
                  } />
                  <Route path="/investigation/capa-determination" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Step 8: CAPA Determination</h1>
                      <p>Coming soon...</p>
                    </div>
                  } />
                  <Route path="/investigation/quality-review" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Step 9: Quality Review & Approval</h1>
                      <p>Coming soon...</p>
                    </div>
                  } />
                  <Route path="/investigation/capa-execution" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Step 10: CAPA Execution</h1>
                      <p>Coming soon...</p>
                    </div>
                  } />
                  <Route path="/investigation/closure" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Step 11: Closure</h1>
                      <p>Coming soon...</p>
                    </div>
                  } />
                  <Route path="/investigation/trending" element={
                    <div className="p-6">
                      <h1 className="text-2xl font-bold">Step 12: Trending & Improvement</h1>
                      <p>Coming soon...</p>
                    </div>
                  } />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </DeviationProvider>
    </AuthProvider>
  );
}

export default App;