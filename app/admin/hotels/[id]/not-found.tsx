// app/hotels/[id]/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
            <div className="rounded-full bg-destructive/10 p-4 mb-6">
                <AlertTriangleIcon className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Hotel não encontrado</h1>
            <p className="text-muted-foreground mb-6 max-w-md">
                O hotel que você está procurando não existe ou foi removido.
            </p>
            <div className="flex gap-3">
                <Button asChild>
                    <Link href="/hotels">Ver todos os hotéis</Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/">Página inicial</Link>
                </Button>
            </div>
        </div>
    );
}