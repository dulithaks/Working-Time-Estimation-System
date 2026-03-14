<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Redirect the dashboard to tasks
    Route::redirect('/dashboard', '/tasks')->name('dashboard');

    Route::get('tasks', [\App\Http\Controllers\TaskController::class, 'index'])->name('tasks.index');
    Route::get('tasks/create', [\App\Http\Controllers\TaskController::class, 'create'])->name('tasks.create');
    Route::post('tasks', [\App\Http\Controllers\TaskController::class, 'store'])->name('tasks.store');

    Route::get('tasks/{task}/estimate', [\App\Http\Controllers\TaskController::class, 'estimate'])->name('tasks.estimate');
    Route::post('tasks/{task}/estimate', [\App\Http\Controllers\TaskController::class, 'updateEstimation'])->name('tasks.updateEstimation');

    Route::get('settings/work-time', [\App\Http\Controllers\Settings\WorkSettingsController::class, 'edit'])->name('work-time.edit');
    Route::put('settings/work-time', [\App\Http\Controllers\Settings\WorkSettingsController::class, 'update'])->name('work-time.update');

    Route::get('settings/holidays', [\App\Http\Controllers\Settings\HolidayController::class, 'index'])
        ->name('settings.holidays.index');

    Route::post('settings/holidays', [\App\Http\Controllers\Settings\HolidayController::class, 'store'])
        ->name('settings.holidays.store');

    Route::delete('settings/holidays/{holiday}', [\App\Http\Controllers\Settings\HolidayController::class, 'destroy'])
        ->name('settings.holidays.destroy');
});

require __DIR__.'/settings.php';
