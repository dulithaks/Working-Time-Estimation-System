import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { XIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
    const [alert, setAlert] = useState<string | null>(null);

    const estimate = Number(task.estimation ?? 0);
    const isNegative = estimate < 0;

    const formatDateTimeLocal = (date: Date) => {
        const pad = (value: number) => value.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
            date.getHours(),
        )}:${pad(date.getMinutes())}`;
    };

    const calculate = async () => {
        const hours = estimate;
        if (isNaN(hours) || hours === 0) {
            return;
        }

        const payload: Record<string, unknown> = {
            estimation: hours,
        };

        if (isNegative) {
            if (!endDate) {
                setAlert('Please enter an end date before calculating the start date.');
                return;
            }

            payload.end_date = endDate;
        } else {
            if (!startDate) {
                setAlert('Please enter a start date before calculating the end date.');
                return;
            }

            payload.start_date = startDate;
        }

        try {
            const response = await fetch(tasks.calculate({ task: task.id }).url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf_token,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const json = await response.json().catch(() => ({}));
                setAlert(json?.message ?? 'Unable to calculate date.');
                return;
            }

            const json = await response.json();

            setStartDate(json.start_date ?? startDate);
            setEndDate(json.end_date ?? endDate);
            setAlert(null);
        } catch (error) {
            setAlert('Unable to calculate date. Please try again.');
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
                        {alert ? (
                            <Alert variant="destructive" className="relative">
                                <button
                                    type="button"
                                    className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                                    onClick={() => setAlert(null)}
                                    aria-label="Close"
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{alert}</AlertDescription>
                            </Alert>
                        ) : null}

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
