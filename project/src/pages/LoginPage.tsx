import React from 'react';
import LoginForm from '../components/LoginForm';
import { MapIcon } from 'lucide-react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-white">
        <div className="mb-8 text-center">
          <MapIcon size={48} className="mx-auto text-indigo-900" />
          <h1 className="text-3xl font-bold mt-4">Plataforma WebGIS</h1>
        </div>
        
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-1">Bem-Vindo!</h2>
          <p className="text-gray-600 mb-6">Por favor, digite o seu login e a sua senha</p>
          
          <LoginForm />
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Desenvolvido por</p>
          <p className="font-semibold">Webgis</p>
          <p>Copyright © 2025 jlcsanselmo - Todos os direitos reservados.</p>
        </div>
      </div>
      
      <div className="hidden md:flex md:w-1/2 bg-indigo-50 flex-col justify-center items-center p-8">
        <div className="max-w-md">
          <img 
            src="https://images.unsplash.com/photo-1508108712903-49b7ef9b1df8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
            alt="Mapa e tecnologia" 
            className="rounded-lg shadow-xl mb-8"
          />
          
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">Decisões inteligentes ao alcance de um toque</h2>
          <p className="text-gray-600">Transforme dados em ações estratégicas.</p>
          
          <div className="flex justify-center mt-8">
            <span className="h-2 w-2 rounded-full bg-indigo-900 mx-1"></span>
            <span className="h-2 w-2 rounded-full bg-gray-300 mx-1"></span>
            <span className="h-2 w-2 rounded-full bg-gray-300 mx-1"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;