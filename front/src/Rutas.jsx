import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./Login.jsx";
import { Registro } from "./Registro.jsx";
import { ProveedorContexto } from "./ProveedorContexto.jsx";


export const Rutas = () => {
  return (
    <BrowserRouter>
      <ProveedorContexto>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </ProveedorContexto>
    </BrowserRouter>
  );
};
