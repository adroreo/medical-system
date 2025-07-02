import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="container mt-4">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <span className="navbar-brand">Sistema Médico</span>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">
              Bienvenido, {user.nombre} {user.apellido} ({user.tipo})
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

      {/* Dashboard content */}
      <div className="row">
        <div className="col-12">
          <h1>Dashboard - {user.tipo}</h1>
          
          {user.tipo === 'paciente' && (
            <div className="row mt-4">
              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <h5 className="card-title">Nueva Cita</h5>
                    <p className="card-text">Programa una nueva cita médica</p>
                    <Link to="/nueva-cita" className="btn btn-primary">
                      Agendar Cita
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <h5 className="card-title">Mis Citas</h5>
                    <p className="card-text">Ver mis citas programadas</p>
                    <Link to="/mis-citas" className="btn btn-success">
                      Ver Citas
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {user.tipo === 'doctor' && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Panel del Doctor</h5>
                    <p>Especialidad: {user.especialidad}</p>
                    <p>Aquí irían las funciones del doctor (ver citas, pacientes, etc.)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {user.tipo === 'admin' && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Panel de Administración</h5>
                    <p>Aquí irían las funciones de administración</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
