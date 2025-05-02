
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Database, Droplet } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TipoMedicao, Medicao, MedicaoFormData } from "@/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const formSchema = z.object({
  tipo: z.enum(["agua", "luz"]),
  data: z.date({
    required_error: "A data da medição é obrigatória",
  }),
  nome: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres",
  }),
  unidadeConsumidora: z.string().min(1, {
    message: "Unidade consumidora é obrigatória",
  }),
  hypolito: z.string().min(1, {
    message: "Hypolito é obrigatório",
  }),
  numeroHospedes: z.number({
    required_error: "Número de hóspedes é obrigatório",
    invalid_type_error: "Deve ser um número",
  }),
  leitura: z.number({
    required_error: "Leitura é obrigatória",
    invalid_type_error: "Deve ser um número",
  }),
  observacoes: z.string().optional(),
});

interface MedicaoFormProps {
  onSaveMedicao: (medicao: Medicao) => void;
}

export function MedicaoForm({ onSaveMedicao }: MedicaoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MedicaoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "agua",
      nome: "",
      unidadeConsumidora: "",
      hypolito: "",
      observacoes: "",
    },
  });

  const handleFormSubmit = (data: MedicaoFormData) => {
    if (!data.data) return;
    
    const novaMedicao: Medicao = {
      id: uuidv4(),
      ...data,
      data: data.data,
      numeroHospedes: Number(data.numeroHospedes),
      leitura: Number(data.leitura),
      createdAt: new Date(),
    };
    
    onSaveMedicao(novaMedicao);
    toast.success("Medição registrada com sucesso!");
    reset();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Registrar Medição</CardTitle>
        <CardDescription>
          Preencha os dados da medição de água ou luz
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo">Tipo de Medição</Label>
              <Select 
                onValueChange={(value: TipoMedicao) => setValue("tipo", value)} 
                defaultValue="agua"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de medição" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agua">
                    <div className="flex items-center">
                      <Droplet className="mr-2 h-4 w-4 text-blue-500" />
                      <span>Água</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="luz">
                    <div className="flex items-center">
                      <Database className="mr-2 h-4 w-4 text-yellow-500" />
                      <span>Luz</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="data">Data da Medição</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="data"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !register("data") && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {register("data") ? (
                      format(new Date(), "PPP")
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    onSelect={(date) => setValue("data", date)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {errors.data && (
                <p className="text-sm text-red-500 mt-1">{errors.data.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="nome">Nome do Responsável</Label>
              <Input 
                id="nome" 
                placeholder="Seu nome" 
                {...register("nome")}
              />
              {errors.nome && (
                <p className="text-sm text-red-500 mt-1">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="unidadeConsumidora">Unidade Consumidora</Label>
              <Input
                id="unidadeConsumidora"
                placeholder="Número da unidade consumidora"
                {...register("unidadeConsumidora")}
              />
              {errors.unidadeConsumidora && (
                <p className="text-sm text-red-500 mt-1">{errors.unidadeConsumidora.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hypolito">Hypolito</Label>
              <Input
                id="hypolito"
                placeholder="Hypolito"
                {...register("hypolito")}
              />
              {errors.hypolito && (
                <p className="text-sm text-red-500 mt-1">{errors.hypolito.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="numeroHospedes">Número de Hóspedes</Label>
              <Input
                id="numeroHospedes"
                type="number"
                placeholder="Quantidade de hóspedes"
                {...register("numeroHospedes", { 
                  valueAsNumber: true 
                })}
              />
              {errors.numeroHospedes && (
                <p className="text-sm text-red-500 mt-1">{errors.numeroHospedes.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="leitura">Leitura</Label>
              <Input
                id="leitura"
                type="number"
                placeholder="Valor da leitura"
                {...register("leitura", { 
                  valueAsNumber: true 
                })}
              />
              {errors.leitura && (
                <p className="text-sm text-red-500 mt-1">{errors.leitura.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais (opcional)"
                className="resize-none"
                {...register("observacoes")}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Registrar Medição</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
