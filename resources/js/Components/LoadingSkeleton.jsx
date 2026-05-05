export function TableSkeleton({ rows = 5, cols = 4 }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex gap-4">
                {Array.from({ length: cols }).map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse flex-1" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="px-4 py-3 border-b border-gray-100 flex gap-4">
                    {Array.from({ length: cols }).map((_, j) => (
                        <div key={j} className="h-4 bg-gray-100 rounded animate-pulse flex-1" />
                    ))}
                </div>
            ))}
        </div>
    )
}

export function CardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
                    <div className="flex gap-2">
                        <div className="h-5 bg-gray-100 rounded-full w-20" />
                        <div className="h-5 bg-gray-100 rounded-full w-20" />
                        <div className="h-5 bg-gray-100 rounded-full w-24" />
                    </div>
                </div>
                <div className="w-16 h-8 bg-gray-200 rounded-lg" />
            </div>
        </div>
    )
}

export function StatCardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
            <div className="flex items-center justify-between">
                <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-8 bg-gray-300 rounded w-16" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            </div>
        </div>
    )
}

export default function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
            <TableSkeleton />
        </div>
    )
}
