import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
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
            estimation: number;
        };
        users: Array<{ id: number; name: string }>;
    }>().props;

    const [startDate, setStartDate] = useState(task.start_date);
    const [endDate, setEndDate] = useState(task.end_date ?? '');

    const estimate = Number(task.estimation ?? 0);
    const isNegative = estimate < 0;

    const formatDateTimeLocal = (date: Date) => {
        const pad = (value: number) => value.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
            date.getHours(),
        )}:${pad(date.getMinutes())}`;
    };

    const calculate = () => {
        const hours = estimate;
        if (isNaN(hours) || hours === 0) {
            return;
        }

        if (isNegative) {
            if (!endDate) {
                return;
            }
            const end = new Date(endDate);
            end.setTime(end.getTime() + hours * 60 * 60 * 1000);
            setStartDate(formatDateTimeLocal(end));
        } else {
            if (!startDate) {
                return;
            }
            const start = new Date(startDate);
            start.setTime(start.getTime() + hours * 60 * 60 * 1000);
            setEndDate(formatDateTimeLocal(start));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Task" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 text-sm shadow-sm dark:border-sidebar-border">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-lg font-semibold">Edit Task</h1>
                            <p className="text-muted-foreground">
                                Update task details below.
                            </p>
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
                            <Input
                                id="title"
                                name="title"
                                defaultValue={task.title}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                defaultValue={task.description}
                            />
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="estimation">Estimation</Label>
                                <Input
                                    id="estimation"
                                    name="estimation"
                                    value={String(task.estimation)}
                                    readOnly
                                />
                            </div>
                            <div className="grid items-end gap-2">
                                <Button
                                    type="button"
                                    className="w-xs"
                                    variant="secondary"
                                    onClick={calculate}
                                >
                                    {isNegative
                                        ? 'Calculate start date'
                                        : 'Calculate end date'}
                                </Button>
                            </div>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="start_date">Start date</Label>
                                <Input
                                    id="start_date"
                                    name="start_date"
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(event) =>
                                        setStartDate(event.target.value)
                                    }
                                    required={!isNegative}
                                    readOnly={isNegative}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end_date">End date</Label>
                                <Input
                                    id="end_date"
                                    name="end_date"
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(event) =>
                                        setEndDate(event.target.value)
                                    }
                                    required={isNegative}
                                    readOnly={!isNegative}
                                />
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
