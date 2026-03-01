import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ✅ ALL IMPORTS WITH .jsx EXTENSION
import Navbar from "./components/Navbar.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Articles from "./pages/Articles.jsx";           // ✅ .jsx added
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Home from "./pages/Home.jsx";                   // ✅ .jsx added
import { AuthContext } from "./context/AuthContext.jsx";
import { AdminPanel } from "./admin/AdminPanel.jsx";
import StockDashboard from "./pages/StockDashboard.jsx"; // ✅ .jsx added
import StockSearch from "./pages/StockSearch.jsx";       // ✅ .jsx added
import HealthList from "./pages/HealthList.jsx";
import HomePageNew from "./pages/HomePageNew.jsx";
import FinanceList from "./pages/FinanceList.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx"; // ✅ .jsx added
import PdfListPage from "./pages/PdfListPage.jsx";
import ViewerPage from "./pages/ViewerPage.jsx";
import { SubscriptionProvider } from './context/SubscriptionContext';
export default function App() {
  const { token } = useContext(AuthContext);
  const isLoggedIn = !!token;

  return (
     <SubscriptionProvider>
    <LanguageProvider> 
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
          <Route path="/pdflist" element={<ProtectedRoute><PdfListPage /></ProtectedRoute>} />
          <Route path="/view/:id" element={<ProtectedRoute><ViewerPage /></ProtectedRoute>} />
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

          {/* 🔐 ADMIN ONLY ROUTE */}
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
    </LanguageProvider>
    </SubscriptionProvider>
  );
}