from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import bcrypt
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Permitir requests desde React

# Configuración de base de datos
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'db01',
    'charset': 'utf8mb4'
}

def get_db_connection():
    """Crear conexión a la base de datos"""
    return pymysql.connect(**DB_CONFIG)

def hash_password(password):
    """Generar hash de contraseña"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password, hashed):
    """Verificar contraseña"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# API para login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Buscar usuario
        cursor.execute("""
            SELECT usuario_id, email, contrasena_hash, tipo 
            FROM usuarios 
            WHERE email = %s AND activo = 1
        """, (email,))
        
        user = cursor.fetchone()
        
        if user and check_password(password, user[2]):
            # Login exitoso
            user_data = {
                'usuario_id': user[0],
                'email': user[1],
                'tipo': user[3]
            }
            
            # Actualizar último login
            cursor.execute("""
                UPDATE usuarios 
                SET ultimo_login = NOW() 
                WHERE usuario_id = %s
            """, (user[0],))
            conn.commit()
            
            # Obtener datos adicionales según el tipo
            if user[3] == 'paciente':
                cursor.execute("""
                    SELECT nombre, apellido 
                    FROM pacientes 
                    WHERE usuario_id = %s
                """, (user[0],))
                profile = cursor.fetchone()
                if profile:
                    user_data['nombre'] = profile[0]
                    user_data['apellido'] = profile[1]
            
            elif user[3] == 'doctor':
                cursor.execute("""
                    SELECT d.nombre, d.apellido, e.nombre as especialidad
                    FROM doctores d
                    JOIN especialidades e ON d.especialidad_id = e.especialidad_id
                    WHERE d.usuario_id = %s
                """, (user[0],))
                profile = cursor.fetchone()
                if profile:
                    user_data['nombre'] = profile[0]
                    user_data['apellido'] = profile[1]
                    user_data['especialidad'] = profile[2]
            
            return jsonify({
                'success': True,
                'message': 'Login exitoso',
                'user': user_data
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Email o contraseña incorrectos'
            }), 401
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error del servidor: {str(e)}'
        }), 500
    finally:
        if 'conn' in locals():
            conn.close()

# API para obtener especialidades
@app.route('/api/especialidades', methods=['GET'])
def get_especialidades():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT especialidad_id, nombre, descripcion FROM especialidades")
        especialidades = cursor.fetchall()
        
        result = []
        for esp in especialidades:
            result.append({
                'id': esp[0],
                'nombre': esp[1],
                'descripcion': esp[2]
            })
        
        return jsonify({
            'success': True,
            'especialidades': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500
    finally:
        if 'conn' in locals():
            conn.close()

# API para obtener doctores por especialidad
@app.route('/api/doctores/<int:especialidad_id>', methods=['GET'])
def get_doctores(especialidad_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT d.doctor_id, d.nombre, d.apellido, d.telefono
            FROM doctores d
            WHERE d.especialidad_id = %s
        """, (especialidad_id,))
        
        doctores = cursor.fetchall()
        
        result = []
        for doc in doctores:
            result.append({
                'id': doc[0],
                'nombre': f"Dr. {doc[1]} {doc[2]}",
                'telefono': doc[3]
            })
        
        return jsonify({
            'success': True,
            'doctores': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500
    finally:
        if 'conn' in locals():
            conn.close()

# API para crear cita
@app.route('/api/citas', methods=['POST'])
def crear_cita():
    data = request.get_json()
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Obtener paciente_id del usuario
        cursor.execute("""
            SELECT paciente_id 
            FROM pacientes 
            WHERE usuario_id = %s
        """, (data['usuario_id'],))
        
        paciente = cursor.fetchone()
        if not paciente:
            return jsonify({
                'success': False,
                'message': 'Paciente no encontrado'
            }), 404
        
        # Crear la cita
        cursor.execute("""
            INSERT INTO citas (paciente_id, doctor_id, fecha_hora, motivo, estado)
            VALUES (%s, %s, %s, %s, 'Programada')
        """, (
            paciente[0],
            data['doctor_id'],
            data['fecha_hora'],
            data.get('motivo', '')
        ))
        
        conn.commit()
        cita_id = cursor.lastrowid
        
        return jsonify({
            'success': True,
            'message': 'Cita creada exitosamente',
            'cita_id': cita_id
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500
    finally:
        if 'conn' in locals():
            conn.close()

# API para obtener citas del paciente
@app.route('/api/mis-citas/<int:usuario_id>', methods=['GET'])
def get_mis_citas(usuario_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT c.cita_id, c.fecha_hora, c.estado, c.motivo,
                   CONCAT('Dr. ', d.nombre, ' ', d.apellido) as doctor,
                   e.nombre as especialidad
            FROM citas c
            JOIN pacientes p ON c.paciente_id = p.paciente_id
            JOIN doctores d ON c.doctor_id = d.doctor_id
            JOIN especialidades e ON d.especialidad_id = e.especialidad_id
            WHERE p.usuario_id = %s
            ORDER BY c.fecha_hora DESC
        """, (usuario_id,))
        
        citas = cursor.fetchall()
        
        result = []
        for cita in citas:
            result.append({
                'id': cita[0],
                'fecha_hora': cita[1].strftime('%Y-%m-%d %H:%M'),
                'estado': cita[2],
                'motivo': cita[3],
                'doctor': cita[4],
                'especialidad': cita[5]
            })
        
        return jsonify({
            'success': True,
            'citas': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500
    finally:
        if 'conn' in locals():
            conn.close()

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'API Sistema Médico',
        'status': 'funcionando'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
