<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use App\Services\EstimationService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::with('user')
            ->orderBy('start_date')
            ->get()
            ->map(fn (Task $task) => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                'start_date' => $task->start_date?->format('Y-m-d H:i'),
                'end_date' => $task->end_date?->format('Y-m-d H:i'),
                'user' => $task->user ? ['name' => $task->user->name] : null,
                'estimation' => $task->estimation,
                'status' => $task->status,
            ]);

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
        ]);
    }

    /**
     * Show the form for adding/updating estimation.
     */
    public function estimate(Task $task)
    {
        if (auth()->user()?->role !== 'Engineer') {
            abort(403);
        }

        return Inertia::render('tasks/estimate', [
            'task' => [
                'id' => $task->id,
                'title' => $task->title,
                'estimation' => $task->estimation,
            ],
        ]);
    }

    /**
     * Update task estimation.
     */
    public function updateEstimation(Request $request, Task $task)
    {
        if ($request->user()?->role !== 'Engineer') {
            abort(403);
        }

        $request->validate([
            'estimation' => ['required', 'numeric'],
        ]);

        $task->update(["estimation" => $request->input('estimation')]);

        return redirect()->route('tasks.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        if (auth()->user()?->role !== 'Project Manager') {
            abort(403);
        }

        $users = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('tasks/create', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->user()?->role !== 'Project Manager') {
            abort(403);
        }

        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['required', 'in:pending,in_progress,completed'],
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $task = Task::create([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'status' => $request->input('status'),
            'user_id' => $request->input('user_id'),
        ]);

        return redirect()->route('tasks.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        abort(404);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        if (auth()->user()?->role !== 'Project Manager') {
            abort(403);
        }

        $task = Task::findOrFail($id);
        $users = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('tasks/edit', [
            'task' => [
                'id' => $task->id,
                'title' => $task->title,
                'description' => $task->description,
                // Format for <input type="datetime-local" />
                'start_date' => $task->start_date?->format('Y-m-d\TH:i'),
                'end_date' => $task->end_date?->format('Y-m-d\TH:i'),
                'status' => $task->status,
                'user_id' => $task->user_id,
                'estimation' => $task->estimation,
            ],
            'users' => $users,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        if ($request->user()?->role !== 'Project Manager') {
            abort(403);
        }

        $task = Task::findOrFail($id);
        $estimate = $task->estimation ?? 0;

        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:pending,in_progress,completed'],
            'user_id' => ['required', 'exists:users,id'],
        ];

        if ($estimate < 0) {
            $rules['end_date'] = ['required', 'date'];
            $rules['start_date'] = ['nullable', 'date'];
        } else {
            $rules['start_date'] = ['required', 'date'];
            $rules['end_date'] = ['nullable', 'date', 'after_or_equal:start_date'];
        }

        $request->validate($rules);

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $task->update([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'status' => $request->input('status'),
            'user_id' => $request->input('user_id'),
        ]);

        return redirect()->route('tasks.index');
    }

    /**
     * Calculate the missing date (start or end) based on estimation.
     */
    public function calculate(Request $request, Task $task)
    {
        if ($request->user()?->role !== 'Project Manager') {
            abort(403);
        }

        $request->validate([
            'estimation' => ['required', 'numeric'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        $estimate = $request->input('estimation');

        $estimationService = new EstimationService();

        if ($estimate < 0) {
            $request->validate([
                'end_date' => ['required', 'date'],
            ]);

            $start = $estimationService->calulateStartdate(
                $estimate,
                $request->input('end_date'),
            );

            return response()->json([
                'start_date' => $start->format('Y-m-d\TH:i'),
                'end_date' => $request->input('end_date'),
            ]);
        }

        $request->validate([
            'start_date' => ['required', 'date'],
        ]);

        $end = $estimationService->calulateEnddate(
            $estimate,
            $request->input('start_date'),
        );

        return response()->json([
            'start_date' => $request->input('start_date'),
            'end_date' => $end->format('Y-m-d\TH:i'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        abort(404);
    }
}
