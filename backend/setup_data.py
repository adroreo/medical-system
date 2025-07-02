import pymysql
import bcrypt

# Configuración de base de datos
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'db01',
    'charset': 'utf8mb4'
}

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def setup_data():
    try:
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        print("Insertando datos de prueba...")
        
        # Limpiar datos existentes
        cursor.execute("DELETE FROM citas")
        cursor.execute("DELETE FROM pacientes")
        cursor.execute("DELETE FROM doctores")
        cursor.execute("DELETE FROM administradores")
        cursor.execute("DELETE FROM usuarios")
        cursor.execute("DELETE FROM especialidades")
        
        # Insertar especialidades
        especialidades = [
            ('Medicina General', 'Atención médica integral'),
            ('Cardiología', 'Especialidad del corazón'),
            ('Dermatología', 'Especialidad de la piel'),
            ('Pediatría', 'Atención médica infantil')
        ]
        
        for esp in especialidades:
            cursor.execute("""
                INSERT INTO especialidades (nombre, descripcion) 
                VALUES (%s, %s)
            """, esp)
        
        # Hash para password123
        password_hash = hash_password('password123')
        
        # Insertar usuarios
        usuarios = [
            ('admin@hospital.com', password_hash, 'admin'),
            ('doctor@hospital.com', password_hash, 'doctor'),
            ('paciente@email.com', password_hash, 'paciente')
        ]
        
        for user in usuarios:
            cursor.execute("""
                INSERT INTO usuarios (email, contrasena_hash, tipo) 
                VALUES (%s, %s, %s)
            """, user)
        
        # Obtener ID de especialidad
        cursor.execute("SELECT especialidad_id FROM especialidades WHERE nombre = 'Medicina General'")
        especialidad_general = cursor.fetchone()
        especialidad_id = especialidad_general[0] if especialidad_general else 1
        
        # Obtener IDs de usuarios insertados
        cursor.execute("SELECT usuario_id, email FROM usuarios ORDER BY usuario_id")
        usuarios_insertados = cursor.fetchall()
        
        admin_id = None
        doctor_id = None
        paciente_id = None
        
        for user in usuarios_insertados:
            if 'admin@' in user[1]:
                admin_id = user[0]
            elif 'doctor@' in user[1]:
                doctor_id = user[0]
            elif 'paciente@' in user[1]:
                paciente_id = user[0]
        
        # Insertar administrador
        if admin_id:
            cursor.execute("""
                INSERT INTO administradores (usuario_id, nombre, apellido)
                VALUES (%s, 'Admin', 'Sistema')
            """, (admin_id,))
        
        # Insertar doctor
        if doctor_id:
            cursor.execute("""
                INSERT INTO doctores (usuario_id, nombre, apellido, especialidad_id, telefono, numero_licencia)
                VALUES (%s, 'Juan', 'Pérez', %s, '123456789', 'LIC001')
            """, (doctor_id, especialidad_id))
        
        # Insertar paciente
        if paciente_id:
            cursor.execute("""
                INSERT INTO pacientes (usuario_id, nombre, apellido, fecha_nacimiento, genero, telefono, direccion)
                VALUES (%s, 'María', 'García', '1990-05-15', 'Femenino', '987654321', 'Av. Principal 123')
            """, (paciente_id,))
        
        conn.commit()
        print("✅ Datos insertados correctamente!")
        
        # Verificar
        cursor.execute("SELECT email, tipo FROM usuarios")
        users = cursor.fetchall()
        print(f"\nUsuarios creados:")
        for user in users:
            print(f"  - {user[0]} ({user[1]})")
        
        print(f"\nCredenciales para prueba:")
        print(f"Email: admin@hospital.com, doctor@hospital.com, paciente@email.com")
        print(f"Contraseña: password123")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == '__main__':
    setup_data()
