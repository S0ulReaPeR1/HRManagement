// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Corrected import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Token has expired
          logout();
        } else {
          setAuth({
            token,
            role: decoded.role, // Ensure 'role' is in JWT payload
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded)
      localStorage.setItem("token", token);
      setAuth({
        token,
        role: decoded.role, // Ensure 'role' is in JWT payload
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Failed to decode token during login:", error);
      // Optionally, handle the error (e.g., notify the user)
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({
      token: null,
      role: null,
      isAuthenticated: false,
    });
    // Optionally, redirect the user to the login page
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
