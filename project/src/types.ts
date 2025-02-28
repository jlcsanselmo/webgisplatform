export interface User {
  email: string;
  password: string;
}

export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  url: string;
  type: 'tile' | 'geojson';
}