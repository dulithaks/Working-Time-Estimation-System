<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Database\Factories\UserFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Task::truncate();

        $userId = User::first()?->id;

        $tasks = [
            [
                'title' => 'Kickoff meeting',
                'description' => 'Hold kickoff meeting with the team.',
                'start_date' => now()->startOfWeek()->addDay(1)->toDateString(),
                'user_id' => User::factory()->create()->id,
                'estimation' => 2,
                'status' => 'pending',
            ],
            [
                'title' => 'Design review',
                'description' => 'Review the latest design mockups.',
                'start_date' => now()->startOfWeek()->addDay(2)->toDateString(),
                'user_id' => User::factory()->create()->id,
                'estimation' => 4,
                'status' => 'in_progress',
            ],
            [
                'title' => 'Development sprint',
                'description' => 'Start the first sprint work items.',
                'end_date' => now()->startOfWeek()->addDay(3)->toDateString(),
                'user_id' => User::factory()->create()->id,
                'estimation' => 8,
                'status' => 'pending',
            ],
        ];

        foreach ($tasks as $task) {
            Task::create($task);
        }
    }
}
