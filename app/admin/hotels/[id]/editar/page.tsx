// app/hotels/[id]/editar/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import {
    ArrowLeftIcon,
    BuildingIcon,
    SaveIcon,
    Loader2Icon,
    AlertCircleIcon,
    CheckCircle2Icon
} from "lucide-react";

type Hotel = {
    _id: number;
    title: string;
    address: string;
    numberOfRooms: string;
    description?: string;
    rating?: number;
    priceRange?: string;
    amenities?: string[];
};

type PageProps = {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function EditHotelPage({ params }: PageProps) {
    const router = useRouter();
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [hotelId, setHotelId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        address: "",
        numberOfRooms: "",
        description: "",
        rating: "",
        priceRange: "",
    });

    // Extrair params da Promise
    useEffect(() => {
        async function getParams() {
            try {
                const resolvedParams = await params;
                setHotelId(resolvedParams.id);
            } catch (err) {
                console.error("Erro ao obter params:", err);
                setError("Erro ao carregar parâmetros da página");
            }
        }

        getParams();
    }, [params]);

    // Buscar dados do hotel quando hotelId estiver disponível
    useEffect(() => {
        if (!hotelId) return;

        async function fetchHotel() {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://api-hotels-node-3ae790f3666e.herokuapp.com/api/hotels/${hotelId}`
                );

                if (!response.ok) {
                    throw new Error("Hotel não encontrado");
                }

                const result = await response.json();

                if (result.success && result.data) {
                    setHotel(result.data);
                    setFormData({
                        title: result.data.title || "",
                        address: result.data.address || "",
                        numberOfRooms: result.data.numberOfRooms || "",
                        description: result.data.description || "",
                        rating: result.data.rating?.toString() || "",
                        priceRange: result.data.priceRange || "",
                    });
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Erro ao carregar hotel");
            } finally {
                setLoading(false);
            }
        }

        fetchHotel();
    }, [hotelId]);

    // Manipular mudanças no formulário
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Enviar formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!hotelId) return;

        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch(
                `https://api-hotels-node-3ae790f3666e.herokuapp.com/api/hotels/${hotelId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: formData.title,
                        address: formData.address,
                        numberOfRooms: formData.numberOfRooms,
                        description: formData.description,
                        rating: formData.rating ? Number(formData.rating) : undefined,
                        priceRange: formData.priceRange,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao atualizar hotel");
            }

            const result = await response.json();

            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push(`/hotels/${hotelId}`);
                    router.refresh();
                }, 2000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao salvar alterações");
        } finally {
            setSaving(false);
        }
    };

    // Excluir hotel
    const handleDelete = async () => {
        if (!hotelId) return;

        if (!confirm("Tem certeza que deseja excluir este hotel? Esta ação não pode ser desfeita.")) {
            return;
        }

        try {
            const response = await fetch(
                `https://api-hotels-node-3ae790f3666e.herokuapp.com/api/hotels/${hotelId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao excluir hotel");
            }

            router.push("/hotels");
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao excluir hotel");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2Icon className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Carregando hotel...</p>
                </div>
            </div>
        );
    }

    if (error && !hotel) {
        return (
            <div className="p-4 md:p-6">
                <Alert variant="destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button asChild className="mt-4">
                    <Link href="/hotels">Voltar para lista</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon">
                        <Link href={`/hotels/${hotelId}`}>
                            <ArrowLeftIcon className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Editar Hotel</h1>
                        <p className="text-muted-foreground">
                            {hotel?.title} • ID: {hotelId}
                        </p>
                    </div>
                </div>

                <Button asChild variant="outline">
                    <Link href={`/hotels/${hotelId}`}>
                        Cancelar
                    </Link>
                </Button>
            </div>

            <Separator />

            {/* Alertas */}
            {success && (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Sucesso!</AlertTitle>
                    <AlertDescription className="text-green-700">
                        Hotel atualizado com sucesso. Redirecionando...
                    </AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coluna esquerda */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BuildingIcon className="h-5 w-5" />
                                    Informações Básicas
                                </CardTitle>
                                <CardDescription>
                                    Informações essenciais do hotel
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Nome do Hotel *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Ex: Hotel Maravilha"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Endereço *</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Ex: Av. Paulista, 1000"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="numberOfRooms">Número de Quartos *</Label>
                                    <Input
                                        id="numberOfRooms"
                                        name="numberOfRooms"
                                        type="number"
                                        value={formData.numberOfRooms}
                                        onChange={handleChange}
                                        placeholder="Ex: 50"
                                        required
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Detalhes Adicionais</CardTitle>
                                <CardDescription>
                                    Informações complementares
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="rating">Classificação (0-5)</Label>
                                    <Input
                                        id="rating"
                                        name="rating"
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={formData.rating}
                                        onChange={handleChange}
                                        placeholder="Ex: 4.5"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priceRange">Faixa de Preço</Label>
                                    <Input
                                        id="priceRange"
                                        name="priceRange"
                                        value={formData.priceRange}
                                        onChange={handleChange}
                                        placeholder="Ex: R$ 200 - R$ 500"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Coluna direita */}
                    <div className="space-y-6">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Descrição</CardTitle>
                                <CardDescription>
                                    Descreva as características do hotel
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 h-full">
                                    <Label htmlFor="description">Descrição do Hotel</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Descreva as instalações, serviços, localização..."
                                        className="min-h-[200px]"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card de ações */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Ações</CardTitle>
                                <CardDescription>
                                    Gerencie o hotel
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={saving || !hotelId}
                                >
                                    {saving ? (
                                        <>
                                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <SaveIcon className="mr-2 h-4 w-4" />
                                            Salvar Alterações
                                        </>
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => router.push(`/hotels/${hotelId}`)}
                                    disabled={saving}
                                >
                                    Visualizar Hotel
                                </Button>

                                <Separator />

                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full"
                                    onClick={handleDelete}
                                    disabled={saving || !hotelId}
                                >
                                    Excluir Hotel
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Informações do sistema */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações do Sistema</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">ID do Hotel:</span>
                                    <span className="font-mono">{hotelId || "Carregando..."}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Última atualização:</span>
                                    <span>{new Date().toLocaleDateString('pt-BR')}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>

            {/* Footer */}
            <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                    Campos marcados com * são obrigatórios
                </p>
                <div className="flex gap-2">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/hotels">Ver todos os hotéis</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}