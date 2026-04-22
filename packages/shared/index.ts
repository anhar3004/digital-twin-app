// packages/shared/index.ts
export interface DigitalTwinData {
  id: string;
  name: string;
  serialNumber: string;
  modelId: string;
  status: 'Aktif' | 'Expired' | 'Maintenance';
  temperature: number;
  rpm: number;
  uptime: number;
}