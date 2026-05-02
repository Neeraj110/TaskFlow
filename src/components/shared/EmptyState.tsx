interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
}

export default function EmptyState({
    title,
    description,
    actionLabel,
}: EmptyStateProps) {
    return (
        <div className="rounded-3xl border border-dashed border-zinc-200 bg-white/70 p-8 text-center">
            <p className="text-lg font-semibold text-zinc-900">{title}</p>
            <p className="mt-2 text-sm text-zinc-500">{description}</p>
            {actionLabel ? (
                <button className="mt-4 rounded-full bg-zinc-900 px-5 py-2 text-xs font-semibold text-white">
                    {actionLabel}
                </button>
            ) : null}
        </div>
    );
}
