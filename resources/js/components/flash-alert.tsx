import { usePage } from '@inertiajs/react';
import { Alert } from '@/components/ui/alert';

export default function FlashAlert() {
    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string };
    };

    if (!flash) {
        return null;
    }

    return (
        <div className="space-y-2">
            {flash.success && (
                <Alert className="w-full" role="status">
                    {flash.success}
                </Alert>
            )}
            {flash.error && (
                <Alert variant="destructive" className="w-full" role="alert">
                    {flash.error}
                </Alert>
            )}
        </div>
    );
}
