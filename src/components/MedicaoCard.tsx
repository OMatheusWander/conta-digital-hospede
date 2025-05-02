
import React from "react";
import { format } from "date-fns";
import { Droplet, Database, Calendar, User, Home, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Medicao } from "@/types";

interface MedicaoCardProps {
  medicao: Medicao;
  onDelete: (id: string) => void;
}

export function MedicaoCard({ medicao, onDelete }: MedicaoCardProps) {
  const isAgua = medicao.tipo === "agua";
  
  return (
    <Card className={`w-full border-l-4 ${isAgua ? "border-l-blue-500" : "border-l-yellow-500"}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {isAgua ? (
              <Droplet className="mr-2 h-5 w-5 text-blue-500" />
            ) : (
              <Database className="mr-2 h-5 w-5 text-yellow-500" />
            )}
            <CardTitle>
              Medição de {isAgua ? "Água" : "Luz"}
              <Badge variant="outline" className="ml-2">
                {medicao.leitura} {isAgua ? "m³" : "kWh"}
              </Badge>
            </CardTitle>
          </div>
          <Badge variant="secondary">
            {format(new Date(medicao.createdAt), "dd/MM/yyyy HH:mm")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Data: <span className="font-medium">{format(new Date(medicao.data), "dd/MM/yyyy")}</span>
            </span>
          </div>
          
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Responsável: <span className="font-medium">{medicao.nome}</span>
            </span>
          </div>
          
          <div className="flex items-center">
            <Home className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Unidade: <span className="font-medium">{medicao.unidadeConsumidora}</span>
            </span>
          </div>
          
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Hóspedes: <span className="font-medium">{medicao.numeroHospedes}</span>
            </span>
          </div>
        </div>
        
        {medicao.observacoes && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Observações: <span className="text-foreground">{medicao.observacoes}</span>
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="text-sm text-muted-foreground">
          Hypolito: <span className="font-medium">{medicao.hypolito}</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(medicao.id)}
        >
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
}
