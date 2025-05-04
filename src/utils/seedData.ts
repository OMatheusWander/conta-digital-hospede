
import { v4 as uuidv4 } from 'uuid';
import { subDays } from 'date-fns';
import { Medicao } from '@/types';

export function seedInitialData() {
  // Verifica se já existem dados
  if (localStorage.getItem('medicoes')) {
    return;
  }
  
  const hoje = new Date();
  
  const dadosIniciais: Medicao[] = [
    // Medições de água
    {
      id: uuidv4(),
      tipo: 'agua',
      data: subDays(hoje, 10),
      hora: '08:30',
      nome: 'José Silva',
      unidadeConsumidora: 'Sede Administrativa',
      tipoUnidade: 'padrao',
      leitura: 342.5,
      observacoes: 'Medição regular mensal',
      createdAt: subDays(hoje, 10),
      userId: '1',
    },
    {
      id: uuidv4(),
      tipo: 'agua',
      data: subDays(hoje, 5),
      hora: '09:15',
      nome: 'Ana Costa',
      unidadeConsumidora: 'Hotel Marina',
      tipoUnidade: 'hotel',
      numeroHospedes: 42,
      unidadesHabitacionaisLocadas: 18,
      leitura: 1230.0,
      observacoes: 'Alta ocupação no fim de semana',
      createdAt: subDays(hoje, 5),
      userId: '2',
    },
    {
      id: uuidv4(),
      tipo: 'agua',
      data: hoje,
      hora: '10:00',
      nome: 'Carlos Mendes',
      unidadeConsumidora: 'Hotel Praia',
      tipoUnidade: 'hotel',
      numeroHospedes: 65,
      unidadesHabitacionaisLocadas: 28,
      leitura: 1540.2,
      createdAt: hoje,
      userId: '1',
    },
    
    // Medições de energia
    {
      id: uuidv4(),
      tipo: 'luz',
      data: subDays(hoje, 10),
      hora: '08:45',
      nome: 'José Silva',
      unidadeConsumidora: 'Sede Administrativa',
      tipoUnidade: 'padrao',
      leitura: 4756.8,
      observacoes: 'Medição regular mensal',
      createdAt: subDays(hoje, 10),
      userId: '1',
    },
    {
      id: uuidv4(),
      tipo: 'luz',
      data: subDays(hoje, 5),
      hora: '09:30',
      nome: 'Ana Costa',
      unidadeConsumidora: 'Hotel Marina',
      tipoUnidade: 'hotel',
      numeroHospedes: 42,
      unidadesHabitacionaisLocadas: 18,
      leitura: 12450.3,
      observacoes: 'Alta ocupação no fim de semana',
      createdAt: subDays(hoje, 5),
      userId: '2',
    },
    {
      id: uuidv4(),
      tipo: 'luz',
      data: hoje,
      hora: '10:15',
      nome: 'Carlos Mendes',
      unidadeConsumidora: 'Hotel Praia',
      tipoUnidade: 'hotel',
      numeroHospedes: 65,
      unidadesHabitacionaisLocadas: 28,
      leitura: 18750.5,
      createdAt: hoje,
      userId: '1',
    },
  ];
  
  localStorage.setItem('medicoes', JSON.stringify(dadosIniciais));
  console.log('Dados iniciais carregados com sucesso');
}
