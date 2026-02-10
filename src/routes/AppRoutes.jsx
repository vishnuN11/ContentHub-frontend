import { Routes, Route } from "react-router-dom";
import SignIn from "../pages/SignIn";
import Articles from "../pages/Articles";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Articles />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
