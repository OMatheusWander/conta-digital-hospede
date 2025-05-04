
import React from 'react';
import { Typography, Card, CardContent, Grid } from '@mui/material';
import { Layout } from '@/components/Layout';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  
  return (
    <Layout title="Dashboard">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Bem-vindo ao Sistema de Medições
          </Typography>
          <Typography variant="body1" paragraph>
            Utilize o menu lateral para navegar entre as funcionalidades do sistema.
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              cursor: 'pointer', 
              transition: 'transform 0.3s', 
              '&:hover': { transform: 'translateY(-4px)' } 
            }}
            onClick={() => navigate('/medicao')}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Registrar Medição
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Registre novas medições de água e energia para as unidades consumidoras.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              cursor: 'pointer', 
              transition: 'transform 0.3s', 
              '&:hover': { transform: 'translateY(-4px)' } 
            }}
            onClick={() => navigate('/historico')}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Visualizar Histórico
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Consulte o histórico de medições e visualize gráficos de consumo.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
