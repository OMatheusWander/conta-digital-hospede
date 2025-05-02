
export type TipoMedicao = 'agua' | 'luz';

export interface Medicao {
  id: string;
  tipo: TipoMedicao;
  data: Date;
  nome: string;
  unidadeConsumidora: string;
  hypolito: string;
  numeroHospedes: number;
  leitura: number;
  observacoes?: string;
  createdAt: Date;
}

export interface MedicaoFormData {
  tipo: TipoMedicao;
  data: Date | undefined;
  nome: string;
  unidadeConsumidora: string;
  hypolito: string;
  numeroHospedes: number | undefined;
  leitura: number | undefined;
  observacoes?: string;
}
