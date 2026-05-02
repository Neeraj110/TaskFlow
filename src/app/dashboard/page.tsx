import AppShell from "../../components/layout/AppShell";
import StatCard from "../../components/dashboard/StatCard";
import TaskTable from "../../components/dashboard/TaskTable";
import ProjectGrid from "../../components/dashboard/ProjectGrid";
import ActivityFeed from "../../components/dashboard/ActivityFeed";

type ApiProject = {
    _id: string;
    title: string;
    description?: string;
};

type ApiTask = {
    _id: string;
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate?: string;
    projectId?: { _id: string; title: string } | string;
};

function formatDate(value?: string) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

export default async function DashboardPage() {
    let tasksData: { tasks: ApiTask[] } = { tasks: [] };
    let projectsData: { projects: ApiProject[] } = { projects: [] };

    try {
        const [tasksRes, projectsRes] = await Promise.all([
            fetch("/api/tasks", {
                cache: "no-store",
            }),
            fetch("/api/projects", {
                cache: "no-store",
            }),
        ]);

        tasksData = tasksRes.ok ? await tasksRes.json() : { tasks: [] };
        projectsData = projectsRes.ok ? await projectsRes.json() : { projects: [] };
    } catch {
        tasksData = { tasks: [] };
        projectsData = { projects: [] };
    }

    const tasks: ApiTask[] = Array.isArray(tasksData.tasks) ? tasksData.tasks : [];
    const projects: ApiProject[] = Array.isArray(projectsData.projects)
        ? projectsData.projects
        : [];

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "DONE").length;
    const overdueTasks = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const due = new Date(task.dueDate);
        return task.status !== "DONE" && due.getTime() < Date.now();
    }).length;

    const stats = [
        { label: "Total tasks", value: `${totalTasks}`, delta: "Updated", tone: "amber" as const },
        { label: "Completed", value: `${completedTasks}`, delta: "Updated", tone: "emerald" as const },
        { label: "Overdue", value: `${overdueTasks}`, delta: "Updated", tone: "blue" as const },
    ];

    const normalizedTasks = tasks.map((task) => {
        const projectName =
            typeof task.projectId === "object" && task.projectId
                ? task.projectId.title
                : "Unassigned";
        return {
            id: task._id,
            title: task.title,
            project: projectName,
            status: task.status,
            priority: task.priority,
            due: formatDate(task.dueDate),
        };
    });

    const normalizedProjects = projects.map((project) => ({
        id: project._id,
        title: project.title,
        description: project.description,
        progress: undefined,
        members: [],
    }));

    return (
        <AppShell
            title="Dashboard"
            subtitle="Overview of workload, risks, and delivery momentum."
        >
            <section className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                <TaskTable tasks={normalizedTasks} />
                <ActivityFeed items={[]} />
            </section>

            <section>
                <ProjectGrid projects={normalizedProjects} />
            </section>
        </AppShell>
    );
}
