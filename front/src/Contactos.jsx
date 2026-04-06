import React, { useContext } from "react";
import { AuthContext } from "./ProveedorContexto.jsx";
import { Login } from "./Login.jsx";
import { ResultadoContacto } from "./ResultadoContacto.jsx";

export const Contactos = () => {

  const [usuarioAuth, setUsuarioAuth] = useContext(AuthContext);

  return (
    <>
        {usuarioAuth == null ? <Login /> : <ResultadoContacto />}
    </>
  )
    
};
