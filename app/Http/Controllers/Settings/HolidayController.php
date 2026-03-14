<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Holiday;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HolidayController extends Controller
{
    public function index()
    {
        $holidays = Holiday::orderBy('date')
            ->get()
            ->map(fn (Holiday $holiday) => [
                'id' => $holiday->id,
                'name' => $holiday->name,
                'date' => $holiday->date?->format('Y-m-d'),
                'is_recurring' => $holiday->is_recurring,
            ]);

        return Inertia::render('settings/holidays', [
            'holidays' => $holidays,
        ]);
    }

    public function store(Request $request)
    {
        if ($request->user()?->role !== 'Project Manager') {
            abort(403);
        }

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'is_recurring' => ['sometimes', 'boolean'],
        ]);

        Holiday::create([
            'name' => $request->input('name'),
            'date' => $request->input('date'),
            'is_recurring' => (bool) $request->input('is_recurring'),
        ]);

        return redirect()->route('settings.holidays.index')->with('success', 'Holiday added.');
    }

    public function destroy(Holiday $holiday)
    {
        if (auth()->user()?->role !== 'Project Manager') {
            abort(403);
        }

        $holiday->delete();

        return redirect()->route('settings.holidays.index')->with('success', 'Holiday removed.');
    }
}
