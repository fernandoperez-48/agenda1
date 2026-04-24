import { useContext, useEffect, useState } from 'react'
import { AuthContext } from './ProveedorContexto.jsx'

const formularioVacio = {
    nombre: '',
    apellido: '',
    email: '',
    empresa: '',
    domicilio: '',
    telefonos: ''
}

export const ResultadoContacto = () => {

    const [usuarioAuth] = useContext(AuthContext)
    const [contactosState, setContactosState] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [formulario, setFormulario] = useState(formularioVacio)
    const [errorFormulario, setErrorFormulario] = useState(null)
    const [guardando, setGuardando] = useState(false)

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

    const handleChange = (e) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value })
    }

    const handleAgregar = async (e) => {
        e.preventDefault()
        setErrorFormulario(null)
        setGuardando(true)

        const nuevoContacto = {
            nombre: formulario.nombre,
            apellido: formulario.apellido,
            email: formulario.email,
        }
        if (formulario.empresa) nuevoContacto.empresa = formulario.empresa
        if (formulario.domicilio) nuevoContacto.domicilio = formulario.domicilio
        if (formulario.telefonos) {
            nuevoContacto.telefonos = formulario.telefonos.split(',').map(t => t.trim()).filter(t => t)
        }

        try {
            const peticion = await fetch('http://localhost:1234/contactos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': usuarioAuth.token
                },
                body: JSON.stringify(nuevoContacto)
            })

            if (!peticion.ok) {
                setErrorFormulario('No se pudo crear el contacto. Verificá los datos.')
                setGuardando(false)
                return
            }

            await resultados()
            setFormulario(formularioVacio)
            setMostrarFormulario(false)

        } catch (e) {
            console.log(e)
            setErrorFormulario('Error de conexión con el servidor')
        }

        setGuardando(false)
    }

    const handleCancelar = () => {
        setFormulario(formularioVacio)
        setErrorFormulario(null)
        setMostrarFormulario(false)
    }

    return (
        <>
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
                            <div className="d-flex align-items-center gap-2">
                                <span className="badge bg-secondary">{contactosState.length} contactos</span>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setMostrarFormulario(true)}
                                >
                                    + Agregar contacto
                                </button>
                            </div>
                        </div>

                        {mostrarFormulario && (
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h6 className="card-title">Nuevo contacto</h6>
                                    {errorFormulario && (
                                        <div className="alert alert-danger py-2">{errorFormulario}</div>
                                    )}
                                    <form onSubmit={handleAgregar}>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <label className="form-label">Nombre *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="nombre"
                                                    value={formulario.nombre}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Apellido *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="apellido"
                                                    value={formulario.apellido}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Email *</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    value={formulario.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Empresa</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="empresa"
                                                    value={formulario.empresa}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Domicilio</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="domicilio"
                                                    value={formulario.domicilio}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Teléfonos</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="telefonos"
                                                    value={formulario.telefonos}
                                                    onChange={handleChange}
                                                    placeholder="Separados por coma"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-3 d-flex gap-2">
                                            <button
                                                type="submit"
                                                className="btn btn-success btn-sm"
                                                disabled={guardando}
                                            >
                                                {guardando ? 'Guardando...' : 'Guardar'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={handleCancelar}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

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
