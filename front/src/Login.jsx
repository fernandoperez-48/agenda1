import React from 'react'
import { useState } from 'react'


export const Login = () => {

    const[formulario, setFormulario] = useState({})
    const[exito, setExito] = useState(false)

    const recogerForm = (e) => {
        e.preventDefault()
       
        let usuario=
        {
            nick: e.target.usuario.value,
            password: e.target.password.value
        }

        setFormulario(usuario)
        buscar(usuario)
        // Aquí iría la lógica para enviar los datos al backend
    }

    const buscar = async (usuario) => {
        try {
            const peticion = await fetch('http://localhost:1234/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });

            const data = await peticion.json();
            if (data.status==400) {
                setExito(false);
            } else {
                setExito(true);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
            }
        } catch (e) {
            console.log(e);
            setFormulario({}); // Reiniciar el formulario en caso de error
        }
    };


  return (
    <>
        <form onSubmit={recogerForm}>
            <label htmlFor="usuario">Usuario:</label>
            <input type="text" id="usuario" name="usuario" placeholder='Usuario' />
            <label htmlFor="password">Password:</label>
            <input type="text" name='password' id="contraseña" placeholder='Password'/>
            <input type="submit"/>
        </form>
       
    </>
  )
}
