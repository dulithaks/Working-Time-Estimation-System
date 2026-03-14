import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2Icon, AlertCircleIcon, XIcon } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function FlashAlert() {
    const { flash } = usePage().props as {
        flash?: { success?: string; error?: string };
    };

    const [visible, setVisible] = useState({ success: false, error: false });

    useEffect(() => {
        setVisible({
            success: Boolean(flash?.success),
            error: Boolean(flash?.error),
        });
    }, [flash]);

    if (!flash) {
        return null;
    }

    return (
        <div className="space-y-2 px-4 pt-4">
            {flash.success && visible.success && (
                <Alert variant="success" className="relative w-full" role="status">
                    <button
                        type="button"
                        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        onClick={() => setVisible((prev) => ({ ...prev, success: false }))}
                        aria-label="Close"
                    >
                        <XIcon className="h-4 w-4" />
                    </button>
                    <CheckCircle2Icon />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{flash.success}</AlertDescription>
                </Alert>
            )}

            {flash.error && visible.error && (
                <Alert variant="destructive" className="relative w-full" role="alert">
                    <button
                        type="button"
                        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        onClick={() => setVisible((prev) => ({ ...prev, error: false }))}
                        aria-label="Close"
                    >
                        <XIcon className="h-4 w-4" />
                    </button>
                    <AlertCircleIcon />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{flash.error}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}
