import AppShell from "../../components/layout/AppShell";
import EmptyState from "../../components/shared/EmptyState";
import SectionHeader from "../../components/shared/SectionHeader";
import { headers } from "next/headers";

type ApiProject = {
    _id: string;
    name: string;        // ✅ BUG FIX: title → name
    description?: string;
    userRole?: "ADMIN" | "MEMBER";
};

// ✅ Helper — absolute baseUrl banana
async function getBaseUrl() {
    const headerList = await headers();
    const host =
        headerList.get("x-forwarded-host") ??
        headerList.get("host") ??
        "localhost:3000";
    const proto = headerList.get("x-forwarded-proto") ?? "http";
    return process.env.NEXTAUTH_URL ?? `${proto}://${host}`;
}

export default async function ProjectsPage() {
    let projects: ApiProject[] = [];

    try {
        // ✅ BUG FIX: absolute URL + cookie forward karo session ke liye
        const baseUrl = await getBaseUrl();
        const headerList = await headers();
        const cookie = headerList.get("cookie") ?? "";

        const projectsRes = await fetch(`${baseUrl}/api/projects`, {
            cache: "no-store",
            headers: { cookie },
        });
        const data = projectsRes.ok ? await projectsRes.json() : { projects: [] };
        projects = Array.isArray(data.projects) ? data.projects : [];
    } catch {
        projects = [];
    }

    return (
        <AppShell
            title="Projects"
            subtitle="Track ownership, milestones, and delivery confidence."
        >
            <section className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-sm">
                <SectionHeader
                    title="Portfolio"
                    subtitle="Active projects"
                    actionLabel="New project"
                />
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
                                    {/* ✅ project.name (not project.title) */}
                                    <h3 className="text-lg font-semibold text-zinc-900">
                                        {project.name}
                                    </h3>
                                    {/* ✅ Role badge dikhao */}
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${project.userRole === "ADMIN"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-zinc-100 text-zinc-600"
                                            }`}
                                    >
                                        {project.userRole ?? "MEMBER"}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-zinc-500">
                                    {project.description || "No description added yet."}
                                </p>
                                <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                                    <span>View tasks →</span>
                                    <span className="font-semibold text-orange-600">
                                        Open project →
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </section>
        </AppShell>
    );
}