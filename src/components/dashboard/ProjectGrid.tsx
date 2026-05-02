interface ProjectCard {
    id: string;
    title: string;
    description?: string;
    progress?: number;
    members?: string[];
}

interface ProjectGridProps {
    projects: ProjectCard[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
    return (
        <div className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Projects</p>
                    <h2 className="mt-2 text-xl font-semibold text-zinc-900">Recent workspaces</h2>
                </div>
                <button className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700">
                    New project
                </button>
            </div>
            {projects.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-white/70 p-6 text-center text-sm text-zinc-500">
                    No projects yet. Create a project to see progress here.
                </div>
            ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {projects.map((project) => (
                        <div key={project.id} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-zinc-900">{project.title}</p>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        {project.description || "No description added."}
                                    </p>
                                </div>
                                <span className="text-xs font-semibold text-orange-600">
                                    {project.progress === undefined ? "--" : `${project.progress}%`}
                                </span>
                            </div>
                            <div className="mt-4 h-2 w-full rounded-full bg-zinc-200">
                                <div
                                    className="h-2 rounded-full bg-orange-500"
                                    style={{ width: `${project.progress ?? 0}%` }}
                                />
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500">
                                {(project.members || []).length === 0 ? (
                                    <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">
                                        No members yet
                                    </span>
                                ) : (
                                    (project.members || []).map((member) => (
                                        <span key={member} className="rounded-full border border-zinc-200 bg-white px-3 py-1">
                                            {member}
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
