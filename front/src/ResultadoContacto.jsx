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
    const [formulario, setFormulario] = useState(formularioVacio)
    const [modoFormulario, setModoFormulario] = useState(null) // null | 'agregar' | 'editar'
    const [editandoId, setEditandoId] = useState(null)
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

    const buildBody = () => {
        const body = {
            nombre: formulario.nombre,
            apellido: formulario.apellido,
            email: formulario.email,
        }
        if (formulario.empresa) body.empresa = formulario.empresa
        if (formulario.domicilio) body.domicilio = formulario.domicilio
        if (formulario.telefonos) {
            body.telefonos = formulario.telefonos.split(',').map(t => t.trim()).filter(t => t)
        }
        return body
    }

    const handleSubmitFormulario = async (e) => {
        e.preventDefault()
        setErrorFormulario(null)
        setGuardando(true)

        const url = modoFormulario === 'editar'
            ? `http://localhost:1234/contactos/${editandoId}`
            : 'http://localhost:1234/contactos'
        const method = modoFormulario === 'editar' ? 'PUT' : 'POST'

        try {
            const peticion = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': usuarioAuth.token
                },
                body: JSON.stringify(buildBody())
            })

            if (!peticion.ok) {
                setErrorFormulario('No se pudo guardar el contacto. Verificá los datos.')
                setGuardando(false)
                return
            }

            await resultados()
            setFormulario(formularioVacio)
            setModoFormulario(null)
            setEditandoId(null)

        } catch (e) {
            console.log(e)
            setErrorFormulario('Error de conexión con el servidor')
        }

        setGuardando(false)
    }

    const handleCancelar = () => {
        setFormulario(formularioVacio)
        setErrorFormulario(null)
        setModoFormulario(null)
        setEditandoId(null)
    }

    const handleAbrirEditar = (contacto) => {
        setFormulario({
            nombre: contacto.nombre || '',
            apellido: contacto.apellido || '',
            email: contacto.email || '',
            empresa: contacto.empresa || '',
            domicilio: contacto.domicilio || '',
            telefonos: contacto.telefonos?.join(', ') || ''
        })
        setEditandoId(contacto._id)
        setModoFormulario('editar')
        setErrorFormulario(null)
    }

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Eliminar este contacto?')) return
        try {
            const peticion = await fetch(`http://localhost:1234/contactos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': usuarioAuth.token }
            })
            if (!peticion.ok) {
                setError('No se pudo eliminar el contacto')
                return
            }
            await resultados()
        } catch (e) {
            console.log(e)
            setError('Error de conexión con el servidor')
        }
    }

    const handleTogglePublico = async (id) => {
        try {
            const peticion = await fetch(`http://localhost:1234/contactos/${id}/publico`, {
                method: 'PATCH',
                headers: { 'Authorization': usuarioAuth.token }
            })
            if (!peticion.ok) {
                setError('No se pudo cambiar la visibilidad')
                return
            }
            await resultados()
        } catch (e) {
            console.log(e)
            setError('Error de conexión con el servidor')
        }
    }

    const esMio = (contacto) =>
        contacto.propietario && contacto.propietario.toString() === usuarioAuth.id?.toString()

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
                                    onClick={() => { setModoFormulario('agregar'); setFormulario(formularioVacio); setErrorFormulario(null) }}
                                    disabled={modoFormulario !== null}
                                >
                                    + Agregar contacto
                                </button>
                            </div>
                        </div>

                        {modoFormulario !== null && (
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h6 className="card-title">
                                        {modoFormulario === 'editar' ? 'Editar contacto' : 'Nuevo contacto'}
                                    </h6>
                                    {errorFormulario && (
                                        <div className="alert alert-danger py-2">{errorFormulario}</div>
                                    )}
                                    <form onSubmit={handleSubmitFormulario}>
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
                                            <th>Visibilidad</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contactosState.map((contacto) => (
                                            <tr
                                                key={contacto._id}
                                                className={editandoId === contacto._id ? 'table-warning' : ''}
                                            >
                                                <td>{contacto.nombre}</td>
                                                <td>{contacto.apellido}</td>
                                                <td>{contacto.email}</td>
                                                <td>{contacto.empresa || '-'}</td>
                                                <td>{contacto.telefonos?.join(', ') || '-'}</td>
                                                <td>
                                                    {esMio(contacto) ? (
                                                        <span className={`badge ${contacto.esPublico ? 'bg-success' : 'bg-secondary'}`}>
                                                            {contacto.esPublico ? 'Público' : 'Privado'}
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-info text-dark">Público</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {esMio(contacto) && (
                                                        <div className="d-flex gap-1 flex-wrap">
                                                            <button
                                                                className="btn btn-outline-primary btn-sm"
                                                                onClick={() => handleAbrirEditar(contacto)}
                                                                disabled={modoFormulario !== null}
                                                                title="Editar"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                className={`btn btn-sm ${contacto.esPublico ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                                                                onClick={() => handleTogglePublico(contacto._id)}
                                                                title={contacto.esPublico ? 'Hacer privado' : 'Hacer público'}
                                                            >
                                                                {contacto.esPublico ? 'Privatizar' : 'Publicar'}
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => handleEliminar(contacto._id)}
                                                                title="Eliminar"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
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
