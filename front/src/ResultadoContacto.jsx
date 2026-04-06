import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from './ProveedorContexto.jsx'
import { Login } from './Login.jsx';


export const ResultadoContacto = () => {

    const [usuarioAuth, setUsuarioAuth] = useContext(AuthContext);
    const [contactosState, setContactosState] = useState({});
    const [exito, setExito] = useState(false);

    useEffect(() => {
        resultados()
    }, []);

    const resultados = async () => {
        try {
            const peticion = await fetch('http://localhost:1234/contactos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': usuarioAuth.token
                }
            });
            const datos = await peticion.json();
            
            if(peticion.status ==404){
                setExito(false);
            } else {
                setExito(true);
                setContactosState(datos);
            }
        } catch (e) {
            console.log(e);
        }
    };


  return (
    <>
        <ul>
            {exito ? contactosState.map((contacto)=>{
                return (<li key={contacto._id}>{contacto.nombre}</li>)
            }):<Login />}

        </ul>
    
    </>
  )
}
