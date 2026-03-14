import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import taskRoutes from '@/routes/tasks';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: taskRoutes.index(),
    },
    {
        title: 'Estimate',
        href: '#',
    },
];

export default function EstimateTask() {
    const { task, csrf_token } = usePage<{
        task: { id: number; title: string; estimation?: number };
        csrf_token: string;
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Estimation" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 text-sm shadow-sm dark:border-sidebar-border">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-lg font-semibold">Update estimation</h1>
                            <p className="text-muted-foreground">Task: {task.title}</p>
                        </div>
                        <Link href={taskRoutes.index()}>
                            <Button variant="outline">Back to list</Button>
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-sm dark:border-sidebar-border">
                    <form
                        action={taskRoutes.updateEstimation({ task: task.id }).url}
                        method="post"
                        className="grid gap-4"
                    >
                        <input type="hidden" name="_token" value={csrf_token} />

                        <div className="grid gap-2">
                            <Label htmlFor="estimation">Estimation (hours)</Label>
                            <Input
                                id="estimation"
                                name="estimation"
                                type="number"
                                step="any"
                                defaultValue={task.estimation ?? 0}
                                required
                            />
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
