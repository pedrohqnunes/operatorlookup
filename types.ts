// Supabase Schema / Application Data Model

export enum ContactType {
  SAC = 'SAC',
  OUVIDORIA = 'OUVIDORIA',
  VENDAS = 'VENDAS',
  SUPORTE_TECNICO = 'SUPORTE_TECNICO',
  WHATSAPP = 'WHATSAPP',
  EMAIL = 'EMAIL',
  OUTRO = 'OUTRO'
}

export interface Contact {
  type: ContactType;
  value: string;
  description?: string;
  available_hours?: string; // e.g., "24h", "Seg-Sex 08:00-18:00"
}

export interface Reputation {
  score: number; // 0 to 10
  source: 'Reclame Aqui' | 'Google Places' | 'Consumidor.gov' | 'Internal AI Analysis';
  status: 'Ruim' | 'Regular' | 'Bom' | 'Ótimo';
  total_reviews?: number;
  last_updated: string;
}

export interface OutageStatus {
  has_active_outage: boolean;
  description?: string;
  affected_regions: string[];
  last_checked: string;
}

// --- NEW MODULES ---

export interface IncidentEvent {
  date: string; // ISO Date
  summary: string;
  duration?: string; // e.g. "4h"
  severity: 'BAIXA' | 'MEDIA' | 'ALTA';
}

export interface IncidentHistory {
  events: IncidentEvent[]; // Last 7-30 days
  stability_trend: 'ESTAVEL' | 'DEGRADANDO' | 'MELHORANDO';
}

export interface DataReliability {
  score: number; // 0-100
  rating: 'BAIXA' | 'MEDIA' | 'ALTA';
  explanation: string;
  criteria: {
    source_count: boolean;
    cross_validation: boolean;
    recent_update: boolean;
  };
}

export interface OperationalRisk {
  score: number; // 0-100
  level: 'BAIXO' | 'MODERADO' | 'ALTO';
  factors: string[]; // List of factors contributing to risk
}

export interface SourceMetadata {
  url: string;
  title: string;
  type: 'OFICIAL' | 'TERCEIROS' | 'NOTICIA';
  reliability: 'ALTA' | 'MEDIA' | 'BAIXA';
  timestamp: string;
}

// -------------------

export interface OperatorProfile {
  id: string; // UUID in Supabase
  name: string; // Normalized Name
  legal_name?: string; // Razão Social
  cnpj?: string;
  website?: string;
  logo_url?: string;
  description?: string;
  
  // Relations
  contacts: Contact[];
  reputation: Reputation[];
  coverage: string[]; // List of UF codes (e.g., "SP", "RJ") or regions
  outage_status: OutageStatus;
  
  // New Modules
  incident_history: IncidentHistory;
  data_reliability: DataReliability;
  operational_risk: OperationalRisk;
  
  // Metadata
  sources: SourceMetadata[]; // List of detailed sources
  last_analyzed: string;
}

// Internal Application State
export interface SearchState {
  query: string;
  isLoading: boolean;
  error: string | null;
  data: OperatorProfile | null;
}