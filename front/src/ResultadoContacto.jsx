import { useContext, useEffect, useState } from 'react'
import { AuthContext } from './ProveedorContexto.jsx'

export const ResultadoContacto = () => {

    const [usuarioAuth] = useContext(AuthContext)
    const [contactosState, setContactosState] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        resultados()
    }, [])

    const resultados = async () => {
        try {
            const peticion = await fetch('http://localhost:1234/contactos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': usuarioAuth.token
                }
            })

            if (!peticion.ok) {
                setError('No se pudieron obtener los contactos')
                setCargando(false)
                return
            }

            const datos = await peticion.json()
            setContactosState(datos)
            setCargando(false)

        } catch (e) {
            console.log(e)
            setError('Error de conexión con el servidor')
            setCargando(false)
        }
    }

    if (cargando) return <p>Cargando contactos...</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>

    return (
        <>
            <h2>Contactos de {usuarioAuth.nick}</h2>
            <ul>
                {contactosState.map((contacto) => (
                    <li key={contacto._id}>{contacto.nombre} {contacto.apellido}</li>
                ))}
            </ul>
        </>
    )
}
