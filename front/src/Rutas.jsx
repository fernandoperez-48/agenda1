import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./Login.jsx";
import { Registro } from "./Registro.jsx";
import { Contactos } from "./Contactos.jsx";
import { ProveedorContexto } from "./ProveedorContexto.jsx";
import { Navbar } from "./Navbar.jsx";


export const Rutas = () => {
  return (
    <BrowserRouter>
      <ProveedorContexto>
        <Navbar />
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
