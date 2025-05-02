
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicaoForm } from "@/components/MedicaoForm";
import { MedicaoList } from "@/components/MedicaoList";
import { Medicao } from "@/types";

const STORAGE_KEY = "hotel-medicoes";

export default function Dashboard() {
  const [medicoes, setMedicoes] = useState<Medicao[]>([]);
  const [activeTab, setActiveTab] = useState("registrar");

  // Carregar medições do localStorage na inicialização
  useEffect(() => {
    const storedMedicoes = localStorage.getItem(STORAGE_KEY);
    if (storedMedicoes) {
      try {
        const parsed = JSON.parse(storedMedicoes);
        
        // Converter strings de data para objetos Date
        const medicoes = parsed.map((m: any) => ({
          ...m,
          data: new Date(m.data),
          createdAt: new Date(m.createdAt),
        }));
        
        setMedicoes(medicoes);
      } catch (error) {
        console.error("Erro ao carregar medições:", error);
      }
    }
  }, []);

  // Salvar medições no localStorage quando houver mudanças
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medicoes));
  }, [medicoes]);

  const handleSaveMedicao = (medicao: Medicao) => {
    setMedicoes((prev) => [...prev, medicao]);
    setActiveTab("historico");
  };

  const handleDeleteMedicao = (id: string) => {
    setMedicoes((prev) => prev.filter((medicao) => medicao.id !== id));
  };

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Sistema de Medições</h1>
        <p className="text-muted-foreground mt-2">
          Controle de leitura de faturas de água e luz para hotéis
        </p>
      </div>

      <Tabs
        defaultValue="registrar"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="registrar">Registrar Medição</TabsTrigger>
          <TabsTrigger value="historico">
            Histórico
            {medicoes.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {medicoes.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="registrar">
          <div className="mx-auto max-w-md">
            <MedicaoForm onSaveMedicao={handleSaveMedicao} />
          </div>
        </TabsContent>
        
        <TabsContent value="historico">
          <MedicaoList
            medicoes={medicoes}
            onDeleteMedicao={handleDeleteMedicao}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
