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

        $userId = User::where('role', 'Engineer')->first()?->id;

        $tasks = [
            [
                'title' => 'End date calculation 1',
                'description' => 'Test end date calculation dataset row 1.',
                'user_id' => $userId,
                'estimation' => 44.723656,
                'start_date' => '2004-05-24 19:03',
                'status' => 'pending',
            ],
            [
                'title' => 'End date calculation 2',
                'description' => 'Test end date calculation dataset row 2.',
                'user_id' => $userId,
                'estimation' => 12.782709,
                'start_date' => '2004-05-24 08:03',
                'status' => 'pending',
            ],
            [
                'title' => 'End date calculation 3',
                'description' => 'Test end date calculation dataset row 3.',
                'user_id' => $userId,
                'estimation' => 8.276628,
                'start_date' => '2004-05-24 07:03',
                'status' => 'pending',
            ],
            [
                'title' => 'Start date calculation 1',
                'description' => 'Test start date calculation dataset row 1.',
                'user_id' => $userId,
                'estimation' => -5.5,
                'end_date' => '2004-05-24 18:05',
                'status' => 'pending',
            ],
            [
                'title' => 'Start date calculation 2',
                'description' => 'Test start date calculation dataset row 2.',
                'user_id' => $userId,
                'estimation' => -6.7470217,
                'end_date' => '2004-05-24 18:03',
                'status' => 'pending',
            ],
        ];

        foreach ($tasks as $task) {
            Task::create($task);
        }
    }
}
