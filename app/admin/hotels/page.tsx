import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";

type Hotel = {
  title: string;
  _id: number;
  numberOfRooms: string;
  address: string;
};

type ApiResponse = {
  data: Hotel[];
  success?: boolean;
  message?: string;
};

export default async function Home() {
  let hotels: Hotel[] = [];

  try {
    const response = await fetch(
      "https://api-hotels-node-3ae790f3666e.herokuapp.com/api/hotels",
      { next: { revalidate: 60 } } // Adicionar cache/revalidação se necessário
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();
    hotels = result.data || [];

  } catch (error) {
    console.error("Failed to fetch hotels:", error);
    // Aqui você poderia retornar um estado de erro ou componente de fallback
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hotéis</h1>
        <Button asChild>
          <Link href="/hotels/cadastrar">
            + Cadastrar hotel
          </Link>
        </Button>
      </div>

      <Separator />

      {hotels.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum hotel cadastrado.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>Lista de hotéis cadastrados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Quartos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hotels.map((hotel) => (
              <TableRow key={hotel._id}>
                <TableCell className="font-medium">{hotel._id}</TableCell>
                <TableCell>
                  <Link
                    href={`/hotels/${hotel._id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {hotel.title}
                  </Link>
                </TableCell>
                <TableCell>{hotel.address}</TableCell>
                <TableCell>{hotel.numberOfRooms}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}