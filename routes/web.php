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
});

require __DIR__.'/settings.php';
