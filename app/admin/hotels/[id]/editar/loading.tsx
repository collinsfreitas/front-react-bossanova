// app/hotels/[id]/editar/loading.tsx
export default function Loading() {
    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </div>
            </div>
            <div className="h-px bg-border" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
                    ))}
                </div>
                <div className="space-y-6">
                    <div className="h-64 bg-muted rounded-lg animate-pulse" />
                    <div className="h-40 bg-muted rounded-lg animate-pulse" />
                </div>
            </div>
        </div>
    );
}