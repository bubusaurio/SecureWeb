import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-10 rounded shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Bienvenido a SecureWeb</h1>
        <p className="text-lg text-gray-700">Has iniciado sesión correctamente.</p>
        <p className="mt-2 text-gray-500">
          Esta es la página principal de la materia <span className="font-semibold">Software Seguro</span>.
        </p>
        <div className="mt-8 text-left">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Prácticas Realizadas</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>
              <span className="font-medium">Prácticas de seguridad en inicio de sesión:</span>
              <ul className="list-disc list-inside ml-6">
                <li>Validación de contraseña segura (mínimo 8 caracteres, una mayúscula, un número y un símbolo)</li>
                <li>Registro y login de usuarios</li>
                <li>Almacenamiento de usuarios en archivo JSON</li>
                <li>Protección de credenciales sensibles usando variables de entorno (.env)</li>
                <li>Permitir acceso frontend-backend usando CORS</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
