import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Members from "./pages/Members";
import Books from "./pages/Books";
import Borrow from "./pages/Borrow";
import Return from "./pages/Return";
import Reservations from "./pages/Reservations";
import Utilities from "./pages/Utilities";
import Login from "./pages/login";

function PrivateRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Protected Pages */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Navbar />
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/members"
          element={
            <PrivateRoute>
              <Navbar />
              <Members />
            </PrivateRoute>
          }
        />
        <Route
          path="/books"
          element={
            <PrivateRoute>
              <Navbar />
              <Books />
            </PrivateRoute>
          }
        />
        <Route
          path="/borrow"
          element={
            <PrivateRoute>
              <Navbar />
              <Borrow />
            </PrivateRoute>
          }
        />
        <Route
          path="/return"
          element={
            <PrivateRoute>
              <Navbar />
              <Return />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <PrivateRoute>
              <Navbar />
              <Reservations />
            </PrivateRoute>
          }
        />
        <Route
          path="/utilities"
          element={
            <PrivateRoute>
              <Navbar />
              <Utilities />
            </PrivateRoute>
          }
        />

        {/* Redirect root to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
