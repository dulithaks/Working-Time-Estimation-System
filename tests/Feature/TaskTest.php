<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware();
    }

    public function test_project_manager_can_create_task_without_dates()
    {
        $user = User::factory()->create(['role' => 'Project Manager']);
        $assignee = User::factory()->create();

        $response = $this->actingAs($user)->post(route('tasks.store'), [
            'title' => 'Test Task',
            'description' => 'Test Description',
            'status' => 'pending',
            'user_id' => $assignee->id,
            'start_date' => null,
            'end_date' => null,
        ]);

        $response->assertRedirect(route('tasks.index'));
        $this->assertDatabaseHas('tasks', [
            'title' => 'Test Task',
            'start_date' => null,
            'end_date' => null,
        ]);
    }

    public function test_project_manager_can_update_task_to_remove_dates()
    {
        $user = User::factory()->create(['role' => 'Project Manager']);
        $assignee = User::factory()->create();
        $task = Task::create([
            'title' => 'Old Title',
            'start_date' => now(),
            'end_date' => now()->addDay(),
            'status' => 'pending',
            'user_id' => $assignee->id,
        ]);

        $response = $this->actingAs($user)->put(route('tasks.update', $task), [
            'title' => 'New Title',
            'description' => 'New Description',
            'status' => 'in_progress',
            'user_id' => $assignee->id,
            'start_date' => null,
            'end_date' => null,
        ]);

        $response->assertRedirect(route('tasks.index'));
        $this->assertDatabaseHas('tasks', [
            'id' => $task->id,
            'title' => 'New Title',
            'start_date' => null,
            'end_date' => null,
        ]);
    }

    public function test_project_manager_can_create_task_with_dates()
    {
        $user = User::factory()->create(['role' => 'Project Manager']);
        $assignee = User::factory()->create();

        $startDate = now()->format('Y-m-d H:i:s');
        $endDate = now()->addDays(2)->format('Y-m-d H:i:s');

        $response = $this->actingAs($user)->post(route('tasks.store'), [
            'title' => 'Test Task with Dates',
            'description' => 'Test Description',
            'status' => 'pending',
            'user_id' => $assignee->id,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);

        $response->assertRedirect(route('tasks.index'));
        $this->assertDatabaseHas('tasks', [
            'title' => 'Test Task with Dates',
            'start_date' => $startDate,
            'end_date' => $endDate,
        ]);
    }
}
