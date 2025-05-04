
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays, differenceInDays, startOfWeek, differenceInWeeks, startOfMonth, differenceInMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Medicao, TipoMedicao } from '@/types';

interface MedicaoDashboardProps {
  medicoes: Medicao[];
  tipo: TipoMedicao;
}

type PeriodoAgregacao = 'dia' | 'semana' | 'mes';

export function MedicaoDashboard({ medicoes, tipo }: MedicaoDashboardProps) {
  const { t } = useTranslation();
  const [periodoAgregacao, setPeriodoAgregacao] = useState<PeriodoAgregacao>('dia');
  
  const handlePeriodoAgregacaoChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriodo: PeriodoAgregacao | null,
  ) => {
    if (newPeriodo !== null) {
      setPeriodoAgregacao(newPeriodo);
    }
  };
  
  // Filtra medições dos últimos 30 dias
  const today = new Date();
  const startDate = subDays(today, 30);
  const recenteMedicoes = medicoes.filter(
    (m) => new Date(m.data) >= startDate
  );
  
  // Processa os dados para o gráfico com base no período de agregação
  const chartData = React.useMemo(() => {
    if (recenteMedicoes.length === 0) return [];
    
    const dados = [];
    const dadosAgregados = new Map();
    
    for (const medicao of recenteMedicoes) {
      const data = new Date(medicao.data);
      
      let chave;
      
      if (periodoAgregacao === 'dia') {
        chave = format(data, 'yyyy-MM-dd');
      } else if (periodoAgregacao === 'semana') {
        const inicioSemana = startOfWeek(data, { locale: ptBR });
        chave = format(inicioSemana, 'yyyy-MM-dd');
      } else if (periodoAgregacao === 'mes') {
        const inicioMes = startOfMonth(data);
        chave = format(inicioMes, 'yyyy-MM');
      }
      
      if (!dadosAgregados.has(chave)) {
        dadosAgregados.set(chave, {
          data: chave,
          total: 0,
          count: 0,
        });
      }
      
      const item = dadosAgregados.get(chave);
      item.total += medicao.leitura;
      item.count += 1;
    }
    
    // Converter para array e calcular a média
    for (const [, valor] of dadosAgregados) {
      const media = valor.total / valor.count;
      
      // Formatar a data para exibição
      let dataFormatada;
      if (periodoAgregacao === 'dia') {
        dataFormatada = format(new Date(valor.data), 'dd/MM', { locale: ptBR });
      } else if (periodoAgregacao === 'semana') {
        dataFormatada = `Semana ${format(new Date(valor.data), 'w', { locale: ptBR })}`;
      } else if (periodoAgregacao === 'mes') {
        dataFormatada = format(new Date(valor.data + '-01'), 'MMM/yy', { locale: ptBR });
      }
      
      dados.push({
        data: dataFormatada,
        valor: media.toFixed(2),
      });
    }
    
    // Ordenar por data
    return dados.sort((a, b) => {
      if (periodoAgregacao === 'dia' || periodoAgregacao === 'semana') {
        // Para dia e semana, mantemos a ordem da data original
        return dadosAgregados.get(a.data).data.localeCompare(dadosAgregados.get(b.data).data);
      } else {
        // Para mês, precisamos converter para objeto Date
        return new Date(a.data + '-01').getTime() - new Date(b.data + '-01').getTime();
      }
    });
  }, [recenteMedicoes, periodoAgregacao]);
  
  const chartColor = tipo === 'agua' ? '#3b82f6' : '#eab308';
  const title = tipo === 'agua' ? t('historico.dashboards.tituloAgua') : t('historico.dashboards.tituloEnergia');

  return (
    <Card>
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="h6">{title}</Typography>
          
          <ToggleButtonGroup
            value={periodoAgregacao}
            exclusive
            onChange={handlePeriodoAgregacaoChange}
            aria-label="período de agregação"
            size="small"
            color="primary"
          >
            <ToggleButton value="dia">
              {t('historico.dashboards.porDia')}
            </ToggleButton>
            <ToggleButton value="semana">
              {t('historico.dashboards.porSemana')}
            </ToggleButton>
            <ToggleButton value="mes">
              {t('historico.dashboards.porMes')}
            </ToggleButton>
          </ToggleButtonGroup>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip 
                formatter={(value: any) => [`${value} ${tipo === 'agua' ? 'm³' : 'kWh'}`, '']}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Bar 
                dataKey="valor" 
                name={tipo === 'agua' ? 'Consumo (m³)' : 'Consumo (kWh)'} 
                fill={chartColor} 
              />
            </BarChart>
          </ResponsiveContainer>
        </Stack>
      </CardContent>
    </Card>
  );
}
