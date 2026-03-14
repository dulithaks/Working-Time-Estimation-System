import { usePage } from '@inertiajs/react';
import { CheckCircle2Icon, AlertCircleIcon } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function FlashAlert() {
    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string };
    };

    if (!flash) {
        return null;
    }

    return (
        <div className="space-y-2 px-4 pt-4">
            {flash.success && (
                <Alert variant="success" className="w-full" role="status">
                    <CheckCircle2Icon />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
            )}

            {flash.error && (
                <Alert variant="destructive" className="w-full" role="alert">
                    <AlertCircleIcon />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{flash.error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
