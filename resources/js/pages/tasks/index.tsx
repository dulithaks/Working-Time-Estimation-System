import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import taskRoutes from '@/routes/tasks';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: taskRoutes.index(),
    },
];

type Task = {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date?: string;
    estimation?: number;
    user?: {
        name: string;
    };
    status?: string;
};

export default function Tasks() {
    const { auth, tasks } = usePage<{ auth: { user: { role: string } }; tasks: Task[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 text-sm shadow-sm dark:border-sidebar-border">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="text-lg font-semibold">Tasks</h1>
                            <p className="text-muted-foreground">A list of all tasks.</p>
                        </div>
                        {auth.user?.role === 'Project Manager' && (
                            <div className="flex items-center gap-2">
                                <Link href={taskRoutes.create()}>
                                    <Button>Create task</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="min-w-full divide-y divide-border text-left text-sm">
                        <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Start date</th>
                                <th className="px-4 py-3">End date</th>
                                <th className="px-4 py-3">Assignee</th>
                                <th className="px-4 py-3">Estimation</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Actions</th>
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
                                            {task.end_date ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {task.user?.name ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {task.estimation ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {task.status ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {task.description}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {auth.user?.role === 'Engineer' ? (
                                                <Link href={taskRoutes.estimate({ task: task.id })}>
                                                    <Button size="sm">Add estimation</Button>
                                                </Link>
                                            ) : (
                                                '-'
                                            )}
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
