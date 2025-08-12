"use client";
import React from "react";

import Cart from "../components/Cart";
import { ProtectedRoute } from "../components/ProtectedRoute";

const Cartpage = () => {
  return (
    <ProtectedRoute>
      <div className="layout-maxed my-14">
        <Cart />
      </div>
    </ProtectedRoute>
  );
};

export default Cartpage;
