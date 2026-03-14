<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Project Manager',
            'email' => 'pm@example.com',
            'role' => 'Project Manager',
            'password' => bcrypt('p@ssword')
        ]);

        User::factory()->create([
            'name' => 'Engineer',
            'email' => 'engineer@example.com',
            'role' => 'Engineer',
            'password' => bcrypt('p@ssword')
        ]);

        $this->call(TaskSeeder::class);
    }
}
