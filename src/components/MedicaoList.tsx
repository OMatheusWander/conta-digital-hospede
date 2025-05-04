
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MedicaoCard } from "./MedicaoCard";
import { Medicao, TipoMedicao } from "@/types";

interface MedicaoListProps {
  medicoes: Medicao[];
  onDeleteMedicao: (id: string) => void;
}

export function MedicaoList({ medicoes, onDeleteMedicao }: MedicaoListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState<string>("todos");

  const filteredMedicoes = medicoes.filter((medicao) => {
    const matchesSearch =
      medicao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicao.unidadeConsumidora.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo =
      filterTipo === "todos" || medicao.tipo === filterTipo;

    return matchesSearch && matchesTipo;
  });

  const sortedMedicoes = [...filteredMedicoes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, unidade..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={filterTipo}
          onValueChange={(value) => setFilterTipo(value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="agua">Água</SelectItem>
            <SelectItem value="luz">Luz</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedMedicoes.length > 0 ? (
        <div className="space-y-4">
          {sortedMedicoes.map((medicao) => (
            <MedicaoCard
              key={medicao.id}
              medicao={medicao}
              onDelete={onDeleteMedicao}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {medicoes.length > 0
              ? "Nenhuma medição corresponde aos filtros aplicados."
              : "Nenhuma medição registrada ainda."}
          </p>
        </div>
      )}
    </div>
  );
}
