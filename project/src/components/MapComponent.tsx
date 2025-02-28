import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, AttributionControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapLayer } from '../types';
import { Info, HelpCircle, FileText, MessageSquareQuote as MessageSquareQuestion, Globe, ZoomIn, ZoomOut, Maximize, Home, Upload } from 'lucide-react';

const MapComponent: React.FC = () => {
  const [layers, setLayers] = useState<MapLayer[]>([
    {
      id: 'sigef',
      name: 'SIGEF',
      visible: false,
      url: '/api/geoserver/sigef.json',
      type: 'geojson'
    },
    {
      id: 'car',
      name: 'CAR',
      visible: false,
      url: '/api/geoserver/car.json',
      type: 'geojson'
    }
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userLayers, setUserLayers] = useState<any[]>([]);
  
  const [geoJsonData, setGeoJsonData] = useState<any>({
    sigef: null,
    car: null
  });

  // Função para simular o carregamento de dados GeoJSON
  useEffect(() => {
    // Simulação de dados GeoJSON para SIGEF (área azul maior)
    const sigefData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Área SIGEF 1' },
          geometry: {
            type: 'Polygon',
            coordinates: [[[-48.5, -15.8], [-47.0, -15.8], [-47.0, -14.5], [-48.5, -14.5], [-48.5, -15.8]]]
          }
        }
      ]
    };

    // Simulação de dados GeoJSON para CAR (áreas verdes menores)
    const carData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Área CAR 1' },
          geometry: {
            type: 'Polygon',
            coordinates: [[[-48.6, -16.9], [-48.0, -16.9], [-48.0, -16.4], [-48.6, -16.4], [-48.6, -16.9]]]
          }
        },
        {
          type: 'Feature',
          properties: { name: 'Área CAR 2' },
          geometry: {
            type: 'Polygon',
            coordinates: [[[-48.2, -16.8], [-47.8, -16.8], [-47.8, -16.5], [-48.2, -16.5], [-48.2, -16.8]]]
          }
        },
        {
          type: 'Feature',
          properties: { name: 'Área CAR 3' },
          geometry: {
            type: 'Polygon',
            coordinates: [[[-47.9, -16.7], [-47.5, -16.7], [-47.5, -16.3], [-47.9, -16.3], [-47.9, -16.7]]]
          }
        }
      ]
    };

    setGeoJsonData({
      sigef: sigefData,
      car: carData
    });
  }, []);

  const toggleLayer = (id: string) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (metadataOpen) setMetadataOpen(false);
  };

  const toggleMetadata = () => {
    setMetadataOpen(!metadataOpen);
  };

  const handleUploadClick = () => {
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (event.target && typeof event.target.result === 'string') {
          // Assumindo que é um GeoJSON válido
          const geoJson = JSON.parse(event.target.result);
          
          // Gerar uma cor aleatória para o novo layer
          const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
          
          // Adicionar à lista de camadas do usuário
          setUserLayers([...userLayers, {
            id: `user-layer-${Date.now()}`,
            name: file.name,
            data: geoJson,
            color: randomColor
          }]);
          
          // Fechar o modal após o upload bem-sucedido
          setUploadModalOpen(false);
          
          // Limpar o input de arquivo
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } catch (error) {
        console.error("Erro ao processar o arquivo:", error);
        alert("Erro ao processar o arquivo. Certifique-se de que é um GeoJSON válido.");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="h-full w-full relative">
      {/* Sidebar */}
      <div className={`absolute top-0 left-0 h-full bg-white z-[1000] shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}>
        <div className="p-4 flex flex-col h-full">
          {sidebarOpen && (
            <>
              <div className="flex items-center mb-6">
                <Globe className="text-indigo-700 mr-2" size={32} />
                <div>
                  <h2 className="font-bold text-indigo-900">INFRAESTRUTURA</h2>
                  <p className="text-xs text-indigo-700">DE DADOS ESPACIAIS</p>
                  <p className="text-xs text-indigo-700">IDE - SISEMA</p>
                </div>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <FileText size={18} />
                  <span>Manuais</span>
                </div>
                <div 
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={toggleMetadata}
                >
                  <FileText size={18} />
                  <span>Metadados</span>
                </div>
                
                {metadataOpen && (
                  <div className="ml-6 space-y-2 mt-2 bg-gray-50 p-2 rounded">
                    {layers.map(layer => (
                      <div key={layer.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={layer.id}
                          checked={layer.visible}
                          onChange={() => toggleLayer(layer.id)}
                          className="mr-2"
                        />
                        <label htmlFor={layer.id}>{layer.name}</label>
                      </div>
                    ))}
                    
                    {userLayers.length > 0 && (
                      <>
                        <div className="font-medium mt-2 mb-1">Camadas do Usuário</div>
                        {userLayers.map(layer => (
                          <div key={layer.id} className="flex items-center">
                            <div className="w-3 h-3 mr-2" style={{ backgroundColor: layer.color }}></div>
                            <span className="text-sm truncate" title={layer.name}>
                              {layer.name.length > 20 ? `${layer.name.substring(0, 20)}...` : layer.name}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
                
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <Info size={18} />
                  <span>O que é a IDE-Sisema</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <HelpCircle size={18} />
                  <span>O que há de novo?</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <MessageSquareQuestion size={18} />
                  <span>Perguntas frequentes</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <MessageSquareQuestion size={18} />
                  <span>Suporte</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <Globe size={18} />
                  <span>Web Services</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Toggle sidebar button */}
      <button 
        onClick={toggleSidebar}
        className="absolute top-1/2 left-0 z-[1001] bg-white p-1 rounded-r-md shadow-md"
      >
        {sidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        )}
      </button>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
        <button className="bg-white p-2 rounded shadow hover:bg-gray-100">
          <ZoomIn size={20} />
        </button>
        <button className="bg-white p-2 rounded shadow hover:bg-gray-100">
          <ZoomOut size={20} />
        </button>
        <button className="bg-white p-2 rounded shadow hover:bg-gray-100">
          <Maximize size={20} />
        </button>
        <button className="bg-white p-2 rounded shadow hover:bg-gray-100">
          <Home size={20} />
        </button>
      </div>
      
      {/* Bottom tools - Substituído por um único botão de upload */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[1000]">
        <button 
          className="bg-blue-500 p-3 rounded-full shadow-lg hover:bg-blue-600"
          onClick={handleUploadClick}
        >
          <Upload className="text-white" size={24} />
        </button>
      </div>

      {/* Scale indicator */}
      <div className="absolute bottom-2 left-2 z-[1000] bg-white bg-opacity-70 px-2 py-1 text-xs">
        200 km
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Adicionar Camada</h3>
            <p className="mb-4">Selecione um arquivo Shapefile, KML ou GeoJSON para adicionar ao mapa.</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 cursor-pointer hover:bg-gray-50" onClick={triggerFileInput}>
              <Upload className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-sm text-gray-500">Clique para selecionar um arquivo ou arraste e solte aqui</p>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".json,.geojson,.kml,.shp"
                onChange={handleFileUpload}
              />
            </div>
            
            <div className="text-xs text-gray-500 mb-4">
              Formatos suportados: GeoJSON (.json, .geojson), KML (.kml), Shapefile (.shp)
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={closeUploadModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <MapContainer 
        center={[-15.8, -48.5]} 
        zoom={7} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Mapa base fixo (sempre visível) */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        />

        {layers.find(l => l.id === 'sigef')?.visible && geoJsonData.sigef && (
          <GeoJSON 
            data={geoJsonData.sigef}
            style={() => ({
              color: '#0000ff',
              weight: 2,
              opacity: 0.8,
              fillColor: '#0000ff',
              fillOpacity: 0.4
            })}
          />
        )}

        {layers.find(l => l.id === 'car')?.visible && geoJsonData.car && (
          <GeoJSON 
            data={geoJsonData.car}
            style={() => ({
              color: '#00ff00',
              weight: 2,
              opacity: 0.8,
              fillColor: '#00ff00',
              fillOpacity: 0.4
            })}
          />
        )}
        
        {/* Renderizar camadas do usuário */}
        {userLayers.map(layer => (
          <GeoJSON 
            key={layer.id}
            data={layer.data}
            style={() => ({
              color: layer.color,
              weight: 2,
              opacity: 0.8,
              fillColor: layer.color,
              fillOpacity: 0.4
            })}
          />
        ))}
        
        <AttributionControl position="bottomright" />
      </MapContainer>
    </div>
  );
};

export default MapComponent;