<?php

namespace Database\Seeders;

use App\Models\Task;
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

        $tasks = [
            [
                'title' => 'Kickoff meeting',
                'description' => 'Hold kickoff meeting with the team.',
                'start_date' => now()->startOfWeek()->addDay(1)->toDateString(),
            ],
            [
                'title' => 'Design review',
                'description' => 'Review the latest design mockups.',
                'start_date' => now()->startOfWeek()->addDay(2)->toDateString(),
            ],
            [
                'title' => 'Development sprint',
                'description' => 'Start the first sprint work items.',
                'start_date' => now()->startOfWeek()->addDay(3)->toDateString(),
            ],
        ];

        foreach ($tasks as $task) {
            Task::create($task);
        }
    }
}
