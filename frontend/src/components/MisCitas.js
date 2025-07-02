import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MisCitas = ({ user, onLogout }) => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const response = await axios.get(`/api/mis-citas/${user.usuario_id}`);
      if (response.data.success) {
        setCitas(response.data.citas);
      }
    } catch (error) {
      setError('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fechaHora) => {
    const fecha = new Date(fechaHora);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'Programada': 'badge bg-primary',
      'Confirmada': 'badge bg-success',
      'Completada': 'badge bg-info',
      'Cancelada': 'badge bg-danger',
      'No asistió': 'badge bg-warning text-dark'
    };
    return badges[estado] || 'badge bg-secondary';
  };

  return (
    <div className="container mt-4">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <span className="navbar-brand">Sistema Médico</span>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">
              {user.nombre} {user.apellido}
            </span>
            <button 
              className="btn btn-outline-danger btn-sm" 
              onClick={onLogout}
            >
              Salir
            </button>
          </div>
        </div>
      </nav>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3>Mis Citas Médicas</h3>
              <Link to="/nueva-cita" className="btn btn-primary">
                Nueva Cita
              </Link>
            </div>
            <div className="card-body">
              {loading && (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-2">Cargando citas...</p>
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {!loading && !error && citas.length === 0 && (
                <div className="text-center py-5">
                  <h5 className="text-muted">No tienes citas programadas</h5>
                  <p className="text-muted">Agenda tu primera cita médica</p>
                  <Link to="/nueva-cita" className="btn btn-primary">
                    Agendar Cita
                  </Link>
                </div>
              )}

              {!loading && !error && citas.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Fecha y Hora</th>
                        <th>Doctor</th>
                        <th>Especialidad</th>
                        <th>Estado</th>
                        <th>Motivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {citas.map(cita => (
                        <tr key={cita.id}>
                          <td>{formatearFecha(cita.fecha_hora)}</td>
                          <td>{cita.doctor}</td>
                          <td>{cita.especialidad}</td>
                          <td>
                            <span className={getEstadoBadge(cita.estado)}>
                              {cita.estado}
                            </span>
                          </td>
                          <td>{cita.motivo || 'No especificado'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-3">
            <Link to="/dashboard" className="btn btn-secondary">
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisCitas;
