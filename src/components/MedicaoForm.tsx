
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  FormControl, 
  FormHelperText, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  Stack, 
  TextField, 
  Typography 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Medicao, MedicaoFormData, TipoUnidade } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Mock de unidades consumidoras
const UNIDADES_CONSUMIDORAS = [
  { id: '1', nome: 'Sede Administrativa', tipo: 'padrao' },
  { id: '2', nome: 'Hotel Marina', tipo: 'hotel' },
  { id: '3', nome: 'Hotel Praia', tipo: 'hotel' },
  { id: '4', nome: 'Escritório Regional', tipo: 'padrao' },
] as const;

const formSchema = z.object({
  tipo: z.enum(['agua', 'luz'], {
    required_error: 'Tipo de medição é obrigatório',
  }),
  unidadeConsumidora: z.string({
    required_error: 'Unidade consumidora é obrigatória',
  }),
  tipoUnidade: z.enum(['padrao', 'hotel']),
  data: z.date({
    required_error: 'Data da medição é obrigatória',
  }),
  hora: z.string().min(1, 'Hora da medição é obrigatória'),
  nome: z.string().min(2, {
    message: 'Nome deve ter pelo menos 2 caracteres',
  }),
  leitura: z.number({
    required_error: 'Leitura é obrigatória',
    invalid_type_error: 'Deve ser um número',
  }).positive('Valor deve ser positivo'),
  numeroHospedes: z
    .number({
      invalid_type_error: 'Deve ser um número',
    })
    .positive('Valor deve ser positivo')
    .optional()
    .nullable(),
  unidadesHabitacionaisLocadas: z
    .number({
      invalid_type_error: 'Deve ser um número',
    })
    .positive('Valor deve ser positivo')
    .optional()
    .nullable(),
  observacoes: z.string().optional(),
});

interface MedicaoFormProps {
  onSaveMedicao?: (medicao: Medicao) => void;
}

export function MedicaoForm({ onSaveMedicao }: MedicaoFormProps) {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MedicaoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: 'agua',
      unidadeConsumidora: '',
      tipoUnidade: 'padrao',
      data: new Date(),
      hora: format(new Date(), 'HH:mm'),
      nome: auth.user?.nome || '',
      leitura: undefined,
      numeroHospedes: undefined,
      unidadesHabitacionaisLocadas: undefined,
      observacoes: '',
    },
  });
  
  const selectedUnidadeId = watch('unidadeConsumidora');
  const tipoUnidade = watch('tipoUnidade');
  
  // Atualiza o tipo de unidade quando a unidade consumidora é selecionada
  React.useEffect(() => {
    if (selectedUnidadeId) {
      const unidade = UNIDADES_CONSUMIDORAS.find(u => u.id === selectedUnidadeId);
      if (unidade) {
        setValue('tipoUnidade', unidade.tipo as TipoUnidade);
      }
    }
  }, [selectedUnidadeId, setValue]);

  const handleFormSubmit = async (data: MedicaoFormData) => {
    setLoading(true);
    
    try {
      // Simula um delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const novaMedicao: Medicao = {
        id: uuidv4(),
        ...data,
        data: data.data!,
        numeroHospedes: data.numeroHospedes || undefined,
        unidadesHabitacionaisLocadas: data.unidadesHabitacionaisLocadas || undefined,
        leitura: data.leitura!,
        createdAt: new Date(),
        userId: auth.user?.id || '',
      };
      
      onSaveMedicao?.(novaMedicao);
      
      toast.success(t('medicao.success'));
      reset();
    } catch (error) {
      console.error('Erro ao salvar medição:', error);
      toast.error('Erro ao salvar medição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Stack spacing={4}>
            <Typography variant="h5">{t('medicao.title')}</Typography>
            
            <Grid container spacing={3}>
              {/* Tipo de Medição */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.tipo}>
                  <InputLabel>{t('medicao.tipo')}</InputLabel>
                  <Controller
                    name="tipo"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label={t('medicao.tipo')}>
                        <MenuItem value="agua">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <WaterDrop style={{ color: '#3b82f6' }} />
                            <span>{t('medicao.agua')}</span>
                          </Stack>
                        </MenuItem>
                        <MenuItem value="luz">
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Lightbulb style={{ color: '#eab308' }} />
                            <span>{t('medicao.energia')}</span>
                          </Stack>
                        </MenuItem>
                      </Select>
                    )}
                  />
                  {errors.tipo && (
                    <FormHelperText>{errors.tipo.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              {/* Unidade Consumidora */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.unidadeConsumidora}>
                  <InputLabel>{t('medicao.unidadeConsumidora')}</InputLabel>
                  <Controller
                    name="unidadeConsumidora"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label={t('medicao.unidadeConsumidora')}>
                        {UNIDADES_CONSUMIDORAS.map((unidade) => (
                          <MenuItem key={unidade.id} value={unidade.id}>
                            {unidade.nome}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.unidadeConsumidora && (
                    <FormHelperText>{errors.unidadeConsumidora.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              {/* Data */}
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <Controller
                    name="data"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label={t('medicao.dia')}
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.data,
                            helperText: errors.data?.message,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              
              {/* Hora */}
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                  <Controller
                    name="hora"
                    control={control}
                    render={({ field }) => (
                      <TimePicker
                        label={t('medicao.hora')}
                        value={parseTimeString(field.value)}
                        onChange={(time) => {
                          if (time) {
                            field.onChange(format(time, 'HH:mm'));
                          }
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.hora,
                            helperText: errors.hora?.message,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              
              {/* Nome do Responsável */}
              <Grid item xs={12}>
                <TextField
                  {...register('nome')}
                  label={t('medicao.responsavel')}
                  fullWidth
                  error={!!errors.nome}
                  helperText={errors.nome?.message}
                />
              </Grid>
              
              {/* Leitura */}
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('leitura', { valueAsNumber: true })}
                  label={t('medicao.leitura')}
                  type="number"
                  inputProps={{ step: 'any' }}
                  fullWidth
                  error={!!errors.leitura}
                  helperText={errors.leitura?.message}
                />
              </Grid>
              
              {/* Campos para hoteis */}
              {tipoUnidade === 'hotel' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('numeroHospedes', { valueAsNumber: true })}
                      label={t('medicao.hotel.hospedes')}
                      type="number"
                      fullWidth
                      error={!!errors.numeroHospedes}
                      helperText={errors.numeroHospedes?.message}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      {...register('unidadesHabitacionaisLocadas', { valueAsNumber: true })}
                      label={t('medicao.hotel.uh')}
                      type="number"
                      fullWidth
                      error={!!errors.unidadesHabitacionaisLocadas}
                      helperText={errors.unidadesHabitacionaisLocadas?.message}
                    />
                  </Grid>
                </>
              )}
              
              {/* Observações */}
              <Grid item xs={12}>
                <TextField
                  {...register('observacoes')}
                  label={t('medicao.observacao')}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {t('medicao.salvar')}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

// Função auxiliar para converter string de hora em objeto Date
function parseTimeString(timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours || 0);
  date.setMinutes(minutes || 0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

// Lucide icons para os tipos de medição
function WaterDrop(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

function Lightbulb(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="9" y1="18" x2="15" y2="18" />
      <line x1="10" y1="22" x2="14" y2="22" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8A6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}
