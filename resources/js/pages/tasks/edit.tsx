import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import tasks from '@/routes/tasks';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: tasks.index(),
    },
    {
        title: 'Edit',
        href: tasks.index(),
    },
];

export default function EditTask() {
    const { csrf_token, task, users } = usePage<{
        csrf_token: string;
        task: {
            id: number;
            title: string;
            description?: string;
            start_date: string;
            end_date?: string;
            status: string;
            user_id: number;
        };
        users: Array<{ id: number; name: string }>;
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Task" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 text-sm shadow-sm dark:border-sidebar-border">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-lg font-semibold">Edit Task</h1>
                            <p className="text-muted-foreground">Update task details below.</p>
                        </div>
                        <Link href={tasks.index()}>
                            <Button variant="outline">Back to list</Button>
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-sm dark:border-sidebar-border">
                    <form
                        action={tasks.update({ task: task.id }).url}
                        method="post"
                        className="grid gap-4"
                    >
                        <input type="hidden" name="_token" value={csrf_token} />
                        <input type="hidden" name="_method" value="PUT" />

                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" defaultValue={task.title} required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" defaultValue={task.description} />
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Start date</Label>
                                <Input
                                    id="start_date"
                                    name="start_date"
                                    type="datetime-local"
                                    defaultValue={task.start_date}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end_date">End date</Label>
                                <Input
                                    id="end_date"
                                    name="end_date"
                                    type="datetime-local"
                                    defaultValue={task.end_date}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="user_id">Assignee</Label>
                                <select
                                    id="user_id"
                                    name="user_id"
                                    className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    defaultValue={task.user_id}
                                    required
                                >
                                    <option value="">Select user</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    id="status"
                                    name="status"
                                    className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    defaultValue={task.status}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="submit">Save</Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
