<?php

namespace Database\Seeders;

use App\Models\WorkSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        WorkSetting::firstOrCreate([
            'id' => 1,
        ], [
            'workday_start' => '08:00:00',
            'workday_end' => '16:00:00',
        ]);
    }
}
