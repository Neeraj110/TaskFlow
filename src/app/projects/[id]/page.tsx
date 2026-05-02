import AppShell from "../../../components/layout/AppShell";
import SectionHeader from "../../../components/shared/SectionHeader";
import EmptyState from "../../../components/shared/EmptyState";

type ApiProject = {
    _id: string;
    title: string;
    description?: string;
};

type ApiTask = {
    _id: string;
    title: string;
    dueDate?: string;
    assignedTo?: { name?: string } | string;
    projectId?: { _id: string } | string;
};

function formatDate(value?: string) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

export default async function ProjectDetailPage({
    params,
}: {
    params: { id: string };
}) {
    let project: ApiProject | null = null;
    let tasks: ApiTask[] = [];

    try {
        const [projectRes, tasksRes] = await Promise.all([
            fetch(`/api/projects/${params.id}`, {
                cache: "no-store",
            }),
            fetch("/api/tasks", {
                cache: "no-store",
            }),
        ]);

        const projectData = projectRes.ok ? await projectRes.json() : null;
        project = projectData?.project || null;

        const tasksData = tasksRes.ok ? await tasksRes.json() : { tasks: [] };
        tasks = Array.isArray(tasksData.tasks) ? tasksData.tasks : [];
    } catch {
        project = null;
        tasks = [];
    }
    const projectTasks = tasks.filter((task) => {
        if (!task.projectId) return false;
        if (typeof task.projectId === "string") return task.projectId === params.id;
        return task.projectId._id === params.id;
    });

    if (!project) {
        return (
            <AppShell title="Project" subtitle="Project details">
                <EmptyState
                    title="Project not found"
                    description="We could not load this project. Check the URL or create a new project."
                    actionLabel="Back to projects"
                />
            </AppShell>
        );
    }

    return (
        <AppShell title={project.title} subtitle={project.description || "Project details"}>
            <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-sm">
                    <SectionHeader title="Timeline" subtitle="Milestones" actionLabel="Edit" />
                    <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-white/70 p-6 text-center text-sm text-zinc-500">
                        Add milestones to track delivery.
                    </div>
                </div>
                <div className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-sm">
                    <SectionHeader title="Team" subtitle="Owners" actionLabel="Invite" />
                    <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-white/70 p-6 text-center text-sm text-zinc-500">
                        Assign team members to see ownership here.
                    </div>
                </div>
            </section>

            <section className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-sm">
                <SectionHeader title="Tasks" subtitle="This sprint" actionLabel="New task" />
                {projectTasks.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-white/70 p-6 text-center text-sm text-zinc-500">
                        No tasks linked to this project yet.
                    </div>
                ) : (
                    <div className="mt-6 grid gap-3 md:grid-cols-3">
                        {projectTasks.map((task) => (
                            <div key={task._id} className="rounded-2xl border border-zinc-100 bg-zinc-50 p-4">
                                <p className="text-sm font-semibold text-zinc-900">{task.title}</p>
                                <p className="mt-2 text-xs text-zinc-500">
                                    Owner: {typeof task.assignedTo === "object" && task.assignedTo?.name ? task.assignedTo.name : "Unassigned"}
                                </p>
                                <p className="text-xs text-zinc-500">Due: {formatDate(task.dueDate)}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </AppShell>
    );
}
