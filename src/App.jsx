import React, { useContext } from "react";
import {BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Articles from "./pages/Articles";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import { AuthContext } from "./context/AuthContext";
import { AdminPanel } from "./admin/AdminPanel";
import StockDashboard from "./pages/StockDashboard";
import StockSearch from "./pages/StockSearch";
import HealthList from "./pages/HealthList";
import HomePageNew from "./pages/HomePageNew";
import FinanceList from "./pages/FinanceList";
import TravelPage from "./pages/TravelPage";
// dummy admin page for now
import { LanguageProvider } from "./context/LanguageContext";

export default function App() {
 const { token } = useContext(AuthContext);
  const isLoggedIn = !!token;

  return (
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
        

        <Route
          path="/"
          element={
           <HomePageNew />
          }
        />
        {/* <Route
          path="/stock"
          element={
           <StockSearch />
          }
        /> */}
        <Route
          path="/article"
          element={
            <ProtectedRoute>
              <Articles />
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
          path="/travel"
          element={
            <ProtectedRoute>
              <TravelPage />
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
  );
}
