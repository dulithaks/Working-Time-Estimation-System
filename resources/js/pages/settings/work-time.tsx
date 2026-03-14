import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import workTimeRoutes from '@/routes/work-time';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
    },
    {
        title: 'Work time',
        href: '/settings/work-time',
    },
];

export default function WorkTimeSettings({ settings }: { settings: { workday_start: string; workday_end: string } | null }) {
    const { auth, csrf_token, flash } = usePage<{
        auth: { user: { role: string } };
        csrf_token: string;
        flash?: { success?: string; error?: string };
    }>().props;

    // Some browsers (especially mobile) only open the native time picker when showPicker() is called.
    // This ensures the picker opens on click/focus when supported.
    useEffect(() => {
        const openPicker = (event: Event) => {
            const target = event.target as HTMLInputElement | null;
            target?.showPicker?.();
        };

        const start = document.getElementById('workday_start');
        const end = document.getElementById('workday_end');

        start?.addEventListener('click', openPicker);
        end?.addEventListener('click', openPicker);

        return () => {
            start?.removeEventListener('click', openPicker);
            end?.removeEventListener('click', openPicker);
        };
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Work time settings" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-4 text-sm shadow-sm dark:border-sidebar-border">
                    <h1 className="text-lg font-semibold">Work time settings</h1>
                    <p className="text-muted-foreground">View the configured workday start and end times.</p>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-sm dark:border-sidebar-border">
                    {settings ? (
                        <form
                            action={workTimeRoutes.update().url}
                            method="post"
                            className="grid gap-4"
                        >
                            <input type="hidden" name="_token" value={csrf_token} />                            <input type="hidden" name="_method" value="PUT" />
                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="workday_start">Workday start</Label>
                                    <Input
                                        id="workday_start"
                                        name="workday_start"
                                        type="time"
                                        defaultValue={settings.workday_start}
                                        disabled={auth.user?.role !== 'Project Manager'}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="workday_end">Workday end</Label>
                                    <Input
                                        id="workday_end"
                                        name="workday_end"
                                        type="time"
                                        defaultValue={settings.workday_end}
                                        disabled={auth.user?.role !== 'Project Manager'}
                                    />
                                </div>
                            </div>

                            {auth.user?.role === 'Project Manager' && (
                                <div className="flex justify-end">
                                    <Button type="submit">Save</Button>
                                </div>
                            )}
                        </form>
                    ) : (
                        <p className="text-sm text-muted-foreground">Work time settings are not configured yet.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
