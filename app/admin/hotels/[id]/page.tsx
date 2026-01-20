// app/hotels/[id]/page.tsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, BuildingIcon, MapPinIcon, BedIcon } from "lucide-react";

type Hotel = {
    _id: number;
    title: string;
    address: string;
    numberOfRooms: string;
    description?: string;
    rating?: number;
    priceRange?: string;
    amenities?: string[];
    // Adicione outros campos conforme necessário
};

type ApiResponse = {
    data: Hotel;
    success: boolean;
    message?: string;
};

type PageProps = {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: PageProps) {
    const { id } = await params;

    try {
        const response = await fetch(
            `https://api-hotels-node-3ae790f3666e.herokuapp.com/api/hotels/${id}`,
            { cache: 'no-store' }
        );

        if (!response.ok) {
            return {
                title: 'Hotel não encontrado',
            };
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
            return {
                title: `${result.data.title} - Detalhes do Hotel`,
                description: result.data.description || `Detalhes do hotel ${result.data.title}`,
            };
        }
    } catch (error) {
        console.error("Erro ao buscar hotel:", error);
    }

    return {
        title: 'Detalhes do Hotel',
    };
}

export default async function HotelPage({ params }: PageProps) {
    const { id } = await params;
    let hotel: Hotel | null = null;

    try {
        const response = await fetch(
            `https://api-hotels-node-3ae790f3666e.herokuapp.com/api/hotels/${id}`,
            { cache: 'no-store' }
        );

        if (!response.ok) {
            if (response.status === 404) {
                notFound(); // Redireciona para a página 404
            }
            throw new Error(`Falha ao buscar hotel: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.success && result.data) {
            hotel = result.data;
        } else {
            notFound();
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        notFound();
    }

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon">
                        <Link href="/admin//hotels">
                            <ArrowLeftIcon className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{hotel?.title}</h1>
                        <p className="text-muted-foreground">ID: {hotel?._id}</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href={`/hotels/${id}/editar`}>Editar</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/admin/hotels">Voltar para lista</Link>
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Conteúdo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Informações principais */}
                <div className="md:col-span-2 space-y-6">
                    {/* Card de informações básicas */}
                    <div className="rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Informações do Hotel</h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <BuildingIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Nome</p>
                                    <p className="font-medium">{hotel?.title}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPinIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Endereço</p>
                                    <p className="font-medium">{hotel?.address}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <BedIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Número de Quartos</p>
                                    <p className="font-medium">{hotel?.numberOfRooms}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Descrição (se existir) */}
                    {hotel?.description && (
                        <div className="rounded-lg border p-6">
                            <h2 className="text-xl font-semibold mb-4">Descrição</h2>
                            <p className="text-muted-foreground whitespace-pre-line">
                                {hotel.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Sidebar/Informações adicionais */}
                <div className="space-y-6">
                    {/* Card de status */}
                    <div className="rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Detalhes</h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">ID do Hotel</p>
                                <p className="font-mono font-medium">{hotel?._id}</p>
                            </div>

                            {hotel?.rating && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Classificação</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <span
                                                    key={i}
                                                    className={`text-xl ${i < (hotel?.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <span className="font-medium">{hotel.rating}/5</span>
                                    </div>
                                </div>
                            )}

                            {hotel?.priceRange && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Faixa de Preço</p>
                                    <p className="font-medium">{hotel.priceRange}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ações rápidas */}
                    <div className="rounded-lg border p-6">
                        <h2 className="text-xl font-semibold mb-4">Ações</h2>
                        <div className="space-y-3">
                            <Button asChild className="w-full">
                                <Link href={`/hotels/${id}/editar`}>
                                    Editar Hotel
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link href={`/hotels/${id}/quartos`}>
                                    Ver Quartos
                                </Link>
                            </Button>
                            <Button variant="destructive" className="w-full">
                                Excluir Hotel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}