import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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
                        <div className="grid gap-4">
                            <div className="grid gap-1">
                                <p className="text-sm font-medium">Workday start</p>
                                <p className="text-base text-foreground">{settings.workday_start}</p>
                            </div>
                            <div className="grid gap-1">
                                <p className="text-sm font-medium">Workday end</p>
                                <p className="text-base text-foreground">{settings.workday_end}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">Work time settings are not configured yet.</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
