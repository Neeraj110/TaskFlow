interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    actionLabel?: string;
}

export default function SectionHeader({
    title,
    subtitle,
    actionLabel,
}: SectionHeaderProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{title}</p>
                {subtitle ? (
                    <h2 className="mt-2 text-xl font-semibold text-zinc-900">{subtitle}</h2>
                ) : null}
            </div>
            {actionLabel ? (
                <button className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700">
                    {actionLabel}
                </button>
            ) : null}
        </div>
    );
}
