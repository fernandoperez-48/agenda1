import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export const Registro = () => {

    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const recogerForm = (e) => {
        e.preventDefault()

        const usuario = {
            nick: e.target.usuario.value,
            mail: e.target.mail.value,
            password: e.target.password.value
        }

        guardarUsuario(usuario)
    }

    const guardarUsuario = async (usuario) => {
        try {
            const peticion = await fetch('http://localhost:1234/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            })

            if (!peticion.ok) {
                setError('Error al registrar usuario')
                return
            }

            navigate('/login')

        } catch (e) {
            console.log(e)
            setError('Error de conexión con el servidor')
        }
    }

    return (
        <>
            <h2>Registro</h2>
            <form onSubmit={recogerForm}>
                <label htmlFor="usuario">Usuario</label>
                <input type="text" id="usuario" name="usuario" placeholder='Usuario' />
                <label htmlFor="mail">Email</label>
                <input type="email" name='mail' id="mail" placeholder='E-mail' />
                <label htmlFor="password">Password</label>
                <input type="text" name='password' id="password" placeholder='Password' />
                <input type="submit" value="Registrarse" />
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <NavLink to="/login">¿Ya tenés cuenta? Iniciá sesión</NavLink>
        </>
    )
}
