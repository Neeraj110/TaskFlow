interface TaskRow {
    id: string;
    title: string;
    project: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
    due: string;
}

interface TaskTableProps {
    tasks: TaskRow[];
}

const statusStyles: Record<TaskRow["status"], string> = {
    TODO: "bg-orange-50 text-orange-700",
    IN_PROGRESS: "bg-blue-50 text-blue-700",
    DONE: "bg-emerald-50 text-emerald-700",
};

export default function TaskTable({ tasks }: TaskTableProps) {
    return (
        <div className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-sm" id="tasks">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Assigned tasks</p>
                    <h2 className="mt-2 text-xl font-semibold text-zinc-900">This week</h2>
                </div>
                <button className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700">
                    View all
                </button>
            </div>
            {tasks.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-white/70 p-6 text-center text-sm text-zinc-500">
                    No tasks assigned yet. Tasks will appear here once created.
                </div>
            ) : (
                <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-100">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-50 text-xs uppercase tracking-widest text-zinc-400">
                            <tr>
                                <th className="px-4 py-3">Task</th>
                                <th className="px-4 py-3">Project</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Priority</th>
                                <th className="px-4 py-3">Due</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {tasks.map((task) => (
                                <tr key={task.id} className="bg-white">
                                    <td className="px-4 py-3 font-medium text-zinc-900">{task.title}</td>
                                    <td className="px-4 py-3 text-zinc-500">{task.project}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>
                                            {task.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-500">{task.priority}</td>
                                    <td className="px-4 py-3 text-zinc-500">{task.due}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
