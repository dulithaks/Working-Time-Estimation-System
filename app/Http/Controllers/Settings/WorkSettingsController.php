<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\WorkSetting;
use Illuminate\Http\Request;
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

    public function update(Request $request)
    {
        if ($request->user()?->role !== 'Project Manager') {
            abort(403);
        }

        $request->validate([
            'workday_start' => ['required', 'date_format:H:i'],
            'workday_end' => ['required', 'date_format:H:i'],
        ]);

        $settings = WorkSetting::first();

        if (! $settings) {
            $settings = new WorkSetting();
        }

        $settings->workday_start = $request->input('workday_start');
        $settings->workday_end = $request->input('workday_end');
        $settings->save();

        return redirect()->route('work-time.edit');
    }
}
