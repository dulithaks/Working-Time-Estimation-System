import { Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
    },
    {
        title: 'Holidays',
        href: '/settings/holidays',
    },
];

type Holiday = {
    id: number;
    name: string;
    date: string;
    is_recurring: boolean;
};

export default function Holidays({ holidays }: { holidays: Holiday[] }) {
    const { auth, csrf_token, flash } = usePage<{
        auth: { user: { role: string } };
        csrf_token: string;
        flash?: { success?: string; error?: string };
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Holidays" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 text-sm shadow-sm dark:border-sidebar-border">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-lg font-semibold">Holidays</h1>
                            <p className="text-muted-foreground">Add and remove company holidays.</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-sm dark:border-sidebar-border">
                    {flash?.success && (
                        <Alert className="mb-4" role="status">
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{flash.success}</AlertDescription>
                        </Alert>
                    )}
                    {flash?.error && (
                        <Alert variant="destructive" className="mb-4" role="alert">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{flash.error}</AlertDescription>
                        </Alert>
                    )}

                    {auth.user?.role === 'Project Manager' ? (
                        <form action="/settings/holidays" method="post" className="grid gap-4">
                            <input type="hidden" name="_token" value={csrf_token} />

                            <div className="grid gap-2 md:grid-cols-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" name="date" type="date" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="is_recurring">Recurring</Label>
                                    <select
                                        id="is_recurring"
                                        name="is_recurring"
                                        className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        defaultValue="0"
                                    >
                                        <option value="0">No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit">Add holiday</Button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-sm text-muted-foreground">Only Project Managers can manage holidays.</p>
                    )}

                    <div className="mt-6 overflow-hidden rounded-xl border border-border bg-background">
                        <table className="min-w-full divide-y divide-border text-left text-sm">
                            <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Recurring</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-background">
                                {holidays.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-sm text-muted-foreground">
                                            No holidays found.
                                        </td>
                                    </tr>
                                ) : (
                                    holidays.map((holiday) => (
                                        <tr key={holiday.id} className="hover:bg-accent/50">
                                            <td className="px-4 py-3 font-medium text-foreground">{holiday.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{holiday.date}</td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {holiday.is_recurring ? 'Yes' : 'No'}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {auth.user?.role === 'Project Manager' ? (
                                                    <form action={`/settings/holidays/${holiday.id}`} method="post">
                                                        <input type="hidden" name="_token" value={csrf_token} />
                                                        <input type="hidden" name="_method" value="DELETE" />
                                                        <Button type="submit" variant="destructive" size="sm">
                                                            Delete
                                                        </Button>
                                                    </form>
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
            </div>
        </AppLayout>
    );
}
