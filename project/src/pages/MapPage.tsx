import React from 'react';
import MapComponent from '../components/MapComponent';
import { LogOut, MapIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MapPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-indigo-900 text-white p-2 flex justify-between items-center">
        <div className="flex items-center">
          <MapIcon className="mr-2" />
          <h1 className="text-xl font-bold">Plataforma WebGIS</h1>
        </div>
        
        <div className="flex items-center">
          <button 
            onClick={handleLogout}
            className="flex items-center text-sm bg-indigo-800 hover:bg-indigo-700 px-3 py-1 rounded"
          >
            <LogOut size={16} className="mr-1" />
            Sair
          </button>
        </div>
      </header>
      
      <main className="flex-1 relative">
        <MapComponent />
      </main>
    </div>
  );
};

export default MapPage;