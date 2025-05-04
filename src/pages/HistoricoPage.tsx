
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { MedicaoHistorico } from '@/components/MedicaoHistorico';
import { Medicao } from '@/types';
import { useTranslation } from 'react-i18next';

export default function HistoricoPage() {
  const { t } = useTranslation();
  const [medicoes, setMedicoes] = useState<Medicao[]>([]);
  
  useEffect(() => {
    // Recuperar medições do localStorage
    const storedMedicoes = localStorage.getItem('medicoes');
    if (storedMedicoes) {
      try {
        const parsedMedicoes = JSON.parse(storedMedicoes);
        
        // Converter strings de data para objetos Date
        const medicoes = parsedMedicoes.map((m: any) => ({
          ...m,
          data: new Date(m.data),
          createdAt: new Date(m.createdAt),
        }));
        
        setMedicoes(medicoes);
      } catch (error) {
        console.error('Erro ao carregar medições:', error);
      }
    }
  }, []);
  
  return (
    <Layout title={t('historico.title')}>
      <MedicaoHistorico medicoes={medicoes} />
    </Layout>
  );
}
