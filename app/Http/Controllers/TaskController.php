<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
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

        return Inertia::render('tasks/create');
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
            'estimation' => ['nullable', 'numeric'],
            'status' => ['required', 'in:pending,in_progress,completed'],
        ]);

        $task = Task::create([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'estimation' => $request->input('estimation'),
            'status' => $request->input('status'),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('tasks.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
