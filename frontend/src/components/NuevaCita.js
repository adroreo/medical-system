import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NuevaCita = ({ user, onLogout }) => {
  const [especialidades, setEspecialidades] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [formData, setFormData] = useState({
    especialidad_id: '',
    doctor_id: '',
    fecha: '',
    hora: '',
    motivo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  const cargarEspecialidades = async () => {
    try {
      const response = await axios.get('/api/especialidades');
      if (response.data.success) {
        setEspecialidades(response.data.especialidades);
      }
    } catch (error) {
      setError('Error al cargar especialidades');
    }
  };

  const cargarDoctores = async (especialidadId) => {
    try {
      const response = await axios.get(`/api/doctores/${especialidadId}`);
      if (response.data.success) {
        setDoctores(response.data.doctores);
      }
    } catch (error) {
      setError('Error al cargar doctores');
    }
  };

  const handleEspecialidadChange = (e) => {
    const especialidadId = e.target.value;
    setFormData({ ...formData, especialidad_id: especialidadId, doctor_id: '' });
    setDoctores([]);
    
    if (especialidadId) {
      cargarDoctores(especialidadId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const fechaHora = `${formData.fecha} ${formData.hora}:00`;

    try {
      const response = await axios.post('/api/citas', {
        usuario_id: user.usuario_id,
        doctor_id: formData.doctor_id,
        fecha_hora: fechaHora,
        motivo: formData.motivo
      });

      if (response.data.success) {
        alert('Cita creada exitosamente');
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear la cita');
    } finally {
      setLoading(false);
    }
  };

  // Fecha mínima (mañana)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

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

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3>Agendar Nueva Cita</h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Especialidad</label>
                    <select
                      className="form-select"
                      value={formData.especialidad_id}
                      onChange={handleEspecialidadChange}
                      required
                    >
                      <option value="">Seleccione especialidad</option>
                      {especialidades.map(esp => (
                        <option key={esp.id} value={esp.id}>
                          {esp.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Doctor</label>
                    <select
                      className="form-select"
                      value={formData.doctor_id}
                      onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                      required
                      disabled={!doctores.length}
                    >
                      <option value="">Seleccione doctor</option>
                      {doctores.map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Fecha</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.fecha}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                      min={minDate}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Hora</label>
                    <select
                      className="form-select"
                      value={formData.hora}
                      onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                      required
                    >
                      <option value="">Seleccione hora</option>
                      <option value="08:00">08:00 AM</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Motivo de la consulta</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.motivo}
                    onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                    placeholder="Describa el motivo de su consulta"
                  ></textarea>
                </div>

                <div className="d-flex justify-content-between">
                  <Link to="/dashboard" className="btn btn-secondary">
                    Volver
                  </Link>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Creando...' : 'Agendar Cita'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevaCita;
