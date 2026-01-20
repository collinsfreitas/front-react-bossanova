import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator"; // Use o separador do shadcn se tiver
import Link from "next/link";
import { BuildingIcon, PlusIcon } from "lucide-react";

type Hotel = {
  _id: number;
  title: string;
  address: string;
  numberOfRooms: string;
  // Adicione outros campos conforme a API retorna
};

type ApiResponse = {
  data: Hotel[];
  success: boolean;
  message?: string;
};

export const metadata = {
  title: 'Lista de Hotéis',
  description: 'Visualize e gerencie todos os hotéis cadastrados',
};

export default async function Home() {
  let hotels: Hotel[] = [];

  try {
    const response = await fetch(
      "https://api-hotels-node-3ae790f3666e.herokuapp.com/api/hotels",
      {
        cache: 'no-store', // Ou 'force-cache' dependendo do caso
        // headers: { 'Authorization': 'Bearer token' } // Se precisar de autenticação
      }
    );

    if (!response.ok) {
      throw new Error(`Falha ao buscar hotéis: ${response.status}`);
    }

    const result: ApiResponse = await response.json();

    if (result.success && result.data) {
      hotels = result.data;
    }

  } catch (error) {
    console.error("Erro na requisição:", error);
    // Em produção, considere usar error.tsx do Next.js
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotéis</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os hotéis do sistema
          </p>
        </div>

        <Button asChild className="w-full sm:w-auto">
          <Link href="/hotels/novo">
            <span className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Novo Hotel
            </span>
          </Link>
        </Button>
      </div>

      <Separator />

      {/* Conteúdo */}
      {hotels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <BuildingIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Nenhum hotel encontrado</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Comece cadastrando seu primeiro hotel
          </p>
          <Button asChild>
            <Link href="/hotels/novo">
              Cadastrar Hotel
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableCaption>
              {hotels.length} {hotels.length === 1 ? 'hotel cadastrado' : 'hotéis cadastrados'}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead className="text-right">Quartos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotels.map((hotel) => (
                <TableRow key={hotel._id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{hotel._id}</TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/hotels/${hotel._id}`}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {hotel.title}
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {hotel.address}
                  </TableCell>
                  <TableCell className="text-right">
                    {hotel.numberOfRooms}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

