import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Context Providers
import { AuthContext } from "./context/AuthContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { SubscriptionProvider } from './context/SubscriptionContext.jsx';

// Components
import Navbar from "./components/Navbar.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Articles from "./pages/Articles.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Home from "./pages/Home.jsx";
import { AdminPanel } from "./admin/AdminPanel.jsx";
import StockDashboard from "./pages/StockDashboard.jsx";
import StockSearch from "./pages/StockSearch.jsx";
import HealthList from "./pages/HealthList.jsx";
import HomePageNew from "./pages/HomePageNew.jsx";
import FinanceList from "./pages/FinanceList.jsx";
import PdfListPage from "./pages/PdfListPage.jsx";
import ViewerPage from "./pages/ViewerPage.jsx";

export default function App() {
  const { token } = useContext(AuthContext);
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token }}>
      <LanguageProvider>
        <SubscriptionProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route
                path="/signup"
                element={isLoggedIn ? <Navigate to="/" /> : <SignUp />}
              />
              <Route
                path="/signin"
                element={isLoggedIn ? <Navigate to="/" /> : <SignIn />}
              />
              
              <Route path="/" element={<HomePageNew />} />
              
              <Route
                path="/article"
                element={
                  <ProtectedRoute>
                    <Articles />
                  </ProtectedRoute>
                }
              />
              
              <Route 
                path="/pdflist" 
                element={
                  <ProtectedRoute>
                    <PdfListPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/view/:id" 
                element={
                  <ProtectedRoute>
                    <ViewerPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route
                path="/finance"
                element={
                  <ProtectedRoute>
                    <FinanceList />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/health"
                element={
                  <ProtectedRoute>
                    <HealthList />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <About />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/contact"
                element={
                  <ProtectedRoute>
                    <Contact />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </SubscriptionProvider>
      </LanguageProvider>
    </AuthContext.Provider>
  );
}