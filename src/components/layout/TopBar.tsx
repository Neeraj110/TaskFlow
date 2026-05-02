export default function TopBar() {
    return (
        <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-2xl bg-orange-500 text-white font-semibold">
                        E
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Ethara</p>
                        <p className="text-sm font-semibold text-zinc-900">Workspace</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 md:hidden">
                    <a className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold" href="/projects">
                        Projects
                    </a>
                    <a className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white" href="/dashboard">
                        Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
