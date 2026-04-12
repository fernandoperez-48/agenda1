import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './ProveedorContexto.jsx'

export const ResultadoContacto = () => {

    const [usuarioAuth, setUsuarioAuth] = useContext(AuthContext)
    const [contactosState, setContactosState] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

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

    const cerrarSesion = () => {
        localStorage.removeItem('usuario')
        setUsuarioAuth(null)
        navigate('/login')
    }

    return (
        <>
            <nav className="navbar navbar-dark bg-primary">
                <div className="container">
                    <span className="navbar-brand fw-bold">Agenda</span>
                    <div className="d-flex align-items-center gap-3">
                        <span className="text-white">Hola, {usuarioAuth.nick}</span>
                        <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                {cargando && (
                    <div className="d-flex justify-content-center mt-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}

                {!cargando && !error && (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Contactos</h5>
                            <span className="badge bg-secondary">{contactosState.length} contactos</span>
                        </div>

                        {contactosState.length === 0 ? (
                            <div className="alert alert-info">No hay contactos para mostrar.</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover align-middle">
                                    <thead className="table-primary">
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Apellido</th>
                                            <th>Email</th>
                                            <th>Empresa</th>
                                            <th>Teléfonos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contactosState.map((contacto) => (
                                            <tr key={contacto._id}>
                                                <td>{contacto.nombre}</td>
                                                <td>{contacto.apellido}</td>
                                                <td>{contacto.email}</td>
                                                <td>{contacto.empresa || '-'}</td>
                                                <td>{contacto.telefonos?.join(', ') || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}
