import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AppRouters = ({ theme = "light", onToggleTheme }) => {
  const nextThemeLabel = theme === "light" ? "Dark" : "Light";

  return (
    <BrowserRouter>
      {onToggleTheme && (
        <button
          className="btn ghost theme-toggle"
          type="button"
          onClick={onToggleTheme}
        >
          {nextThemeLabel} mode
        </button>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouters;
