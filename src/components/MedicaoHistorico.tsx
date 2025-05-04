
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Medicao } from '@/types';
import { MedicaoDashboard } from './MedicaoDashboard';

interface MedicaoHistoricoProps {
  medicoes: Medicao[];
}

export function MedicaoHistorico({ medicoes }: MedicaoHistoricoProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [unidadeFiltro, setUnidadeFiltro] = useState<string>('todos');
  
  // Obtém lista única de unidades para filtro
  const unidadesUnicas = Array.from(
    new Set(medicoes.map((m) => m.unidadeConsumidora))
  );
  
  const filteredMedicoes = medicoes.filter((medicao) => {
    const matchesTipo = tipoFiltro === 'todos' || medicao.tipo === tipoFiltro;
    const matchesUnidade =
      unidadeFiltro === 'todos' || medicao.unidadeConsumidora === unidadeFiltro;
    return matchesTipo && matchesUnidade;
  });
  
  // Ordenação por data (mais recente primeiro)
  const sortedMedicoes = [...filteredMedicoes].sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );
  
  const paginatedMedicoes = sortedMedicoes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleTipoFiltroChange = (event: any) => {
    setTipoFiltro(event.target.value);
    setPage(0);
  };
  
  const handleUnidadeFiltroChange = (event: any) => {
    setUnidadeFiltro(event.target.value);
    setPage(0);
  };

  return (
    <Stack spacing={4}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <MedicaoDashboard 
            medicoes={medicoes.filter(m => m.tipo === 'agua')} 
            tipo="agua" 
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MedicaoDashboard 
            medicoes={medicoes.filter(m => m.tipo === 'luz')} 
            tipo="luz" 
          />
        </Grid>
      </Grid>
      
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Typography variant="h5">{t('historico.title')}</Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>{t('historico.tipo')}</InputLabel>
                <Select
                  value={tipoFiltro}
                  onChange={handleTipoFiltroChange}
                  label={t('historico.tipo')}
                  size="small"
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="agua">Água</MenuItem>
                  <MenuItem value="luz">Energia</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>{t('historico.unidade')}</InputLabel>
                <Select
                  value={unidadeFiltro}
                  onChange={handleUnidadeFiltroChange}
                  label={t('historico.unidade')}
                  size="small"
                >
                  <MenuItem value="todos">Todas</MenuItem>
                  {unidadesUnicas.map((unidade) => (
                    <MenuItem key={unidade} value={unidade}>
                      {unidade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            {paginatedMedicoes.length > 0 ? (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('historico.tipo')}</TableCell>
                        <TableCell>{t('historico.unidade')}</TableCell>
                        <TableCell>{t('historico.data')}</TableCell>
                        <TableCell>{t('historico.hora')}</TableCell>
                        <TableCell>{t('historico.responsavel')}</TableCell>
                        <TableCell align="right">{t('historico.leitura')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedMedicoes.map((medicao) => (
                        <TableRow key={medicao.id}>
                          <TableCell>
                            <Chip
                              label={medicao.tipo === 'agua' ? 'Água' : 'Energia'}
                              color={medicao.tipo === 'agua' ? 'primary' : 'warning'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{medicao.unidadeConsumidora}</TableCell>
                          <TableCell>
                            {format(new Date(medicao.data), 'dd/MM/yyyy', { locale: ptBR })}
                          </TableCell>
                          <TableCell>{medicao.hora}</TableCell>
                          <TableCell>{medicao.nome}</TableCell>
                          <TableCell align="right">
                            {medicao.leitura} {medicao.tipo === 'agua' ? 'm³' : 'kWh'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  component="div"
                  count={sortedMedicoes.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Linhas por página"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} de ${count}`
                  }
                />
              </>
            ) : (
              <Box
                sx={{
                  py: 5,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {t('historico.emptyState')}
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
