import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import tasks from '@/routes/tasks';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: tasks.index(),
    },
];

type Task = {
    id: number;
    title: string;
    description: string;
    start_date: string;
};

export default function Tasks() {
    const { tasks } = usePage().props as { tasks: Task[] };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 text-sm shadow-sm dark:border-sidebar-border">
                    <h1 className="text-lg font-semibold">Tasks</h1>
                    <p className="text-muted-foreground">A list of all tasks.</p>
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="min-w-full divide-y divide-border text-left text-sm">
                        <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Start date</th>
                                <th className="px-4 py-3">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-background">
                            {tasks.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-6 text-center text-sm text-muted-foreground"
                                    >
                                        No tasks found.
                                    </td>
                                </tr>
                            ) : (
                                tasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-accent/50">
                                        <td className="px-4 py-3 font-medium text-foreground">
                                            {task.title}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {task.start_date}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {task.description}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
