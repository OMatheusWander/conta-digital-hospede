
export type TipoMedicao = 'agua' | 'luz';
export type TipoUnidade = 'padrao' | 'hotel';

export interface UnidadeConsumidora {
  id: string;
  nome: string;
  tipo: TipoUnidade;
}

export interface Usuario {
  id: string;
  email: string;
  nome: string;
}

export interface Medicao {
  id: string;
  tipo: TipoMedicao;
  data: Date;
  hora: string;
  nome: string;
  unidadeConsumidora: string;
  tipoUnidade: TipoUnidade;
  numeroHospedes?: number;
  unidadesHabitacionaisLocadas?: number;
  leitura: number;
  observacoes?: string;
  createdAt: Date;
  userId: string;
}

export interface MedicaoFormData {
  tipo: TipoMedicao;
  data: Date | undefined;
  hora: string;
  nome: string;
  unidadeConsumidora: string;
  tipoUnidade: TipoUnidade;
  numeroHospedes?: number | undefined;
  unidadesHabitacionaisLocadas?: number | undefined;
  leitura: number | undefined;
  observacoes?: string;
}

export interface Auth {
  isAuthenticated: boolean;
  user: Usuario | null;
  token: string | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}
