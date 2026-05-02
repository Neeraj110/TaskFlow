import AppShell from "../../components/layout/AppShell";
import EmptyState from "../../components/shared/EmptyState";
import SectionHeader from "../../components/shared/SectionHeader";

type ApiProject = {
    _id: string;
    title: string;
    description?: string;
};

export default async function ProjectsPage() {
    let projectsData: { projects: ApiProject[] } = { projects: [] };

    try {
        const projectsRes = await fetch("/api/projects", {
            cache: "no-store",
        });
        projectsData = projectsRes.ok ? await projectsRes.json() : { projects: [] };
    } catch {
        projectsData = { projects: [] };
    }
    const projects: ApiProject[] = Array.isArray(projectsData.projects)
        ? projectsData.projects
        : [];

    return (
        <AppShell
            title="Projects"
            subtitle="Track ownership, milestones, and delivery confidence."
        >
            <section className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-sm">
                <SectionHeader title="Portfolio" subtitle="Active projects" actionLabel="New project" />
                {projects.length === 0 ? (
                    <div className="mt-6">
                        <EmptyState
                            title="No projects yet"
                            description="Create your first project to start tracking tasks and milestones."
                            actionLabel="Create project"
                        />
                    </div>
                ) : (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {projects.map((project) => (
                            <a
                                key={project._id}
                                href={`/projects/${project._id}`}
                                className="rounded-2xl border border-zinc-100 bg-zinc-50 p-5 transition hover:border-orange-200 hover:bg-orange-50"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-zinc-900">{project.title}</h3>
                                    <span className="text-xs font-semibold text-zinc-600">Active</span>
                                </div>
                                <p className="mt-2 text-sm text-zinc-500">
                                    {project.description || "No description added yet."}
                                </p>
                                <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                                    <span>Details pending</span>
                                    <span className="font-semibold text-orange-600">View details →</span>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </section>
        </AppShell>
    );
}
