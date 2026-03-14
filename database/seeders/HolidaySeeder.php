<?php

namespace Database\Seeders;

use App\Models\Holiday;
use Illuminate\Database\Seeder;

class HolidaySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Holiday::create([
            'name' => 'Recurring holidays',
            'date' => '2004-05-17',
            'is_recurring' => true,
        ]);

        Holiday::create([
            'name' => 'One-time holidays',
            'date' => '2004-05-27',
            'is_recurring' => false,
        ]);
    }
}
