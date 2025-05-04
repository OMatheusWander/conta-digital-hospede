
import React from 'react';
import { Layout } from '@/components/Layout';
import { MedicaoForm } from '@/components/MedicaoForm';
import { Medicao } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function MedicaoPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleSaveMedicao = (medicao: Medicao) => {
    // Recupera medições existentes ou inicializa array vazio
    const storedMedicoes = localStorage.getItem('medicoes');
    const medicoes = storedMedicoes ? JSON.parse(storedMedicoes) : [];
    
    // Adiciona nova medição
    medicoes.push(medicao);
    
    // Salva no localStorage
    localStorage.setItem('medicoes', JSON.stringify(medicoes));
    
    // Notifica e redireciona
    toast.success(t('medicao.success'));
    navigate('/historico');
  };
  
  return (
    <Layout title={t('medicao.title')}>
      <MedicaoForm onSaveMedicao={handleSaveMedicao} />
    </Layout>
  );
}
