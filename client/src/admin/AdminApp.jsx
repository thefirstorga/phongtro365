import React from "react";
import axios from "axios";
import { AdminContextProvider } from "./components/AdminContext";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import IndexPage from "./pages/IndexPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ReportsPage from "./pages/ReportsPage";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function AdminApp() {
  return (
    <AdminContextProvider>
      <Routes>
        <Route path="/admin" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route
            path="register"
            element={
              <ProtectedRoute>
                <RegisterPage />
              </ProtectedRoute>
            }
          />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </AdminContextProvider>
  );
}

export default AdminApp;
