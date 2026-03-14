<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\WorkSetting;
use Inertia\Inertia;

class WorkSettingsController extends Controller
{
    public function edit()
    {
        $settings = WorkSetting::first();

        return Inertia::render('settings/work-time', [
            'settings' => $settings ? [
                'workday_start' => $settings->workday_start?->format('H:i'),
                'workday_end' => $settings->workday_end?->format('H:i'),
            ] : null,
        ]);
    }
}
