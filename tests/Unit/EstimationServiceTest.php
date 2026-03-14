<?php

use App\Services\EstimationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Database\Seeders\HolidaySeeder;
use Database\Seeders\WorkSettingsSeeder;

uses(Tests\TestCase::class, RefreshDatabase::class)->beforeEach(function () {
    // run db seeders
    $this->seed(WorkSettingsSeeder::class);
    $this->seed(HolidaySeeder::class);
});

dataset('end dates', [
    [44.723656, '24-05-2004 19:03', '27-07-2004 13:47'],
    [12.782709, '24-05-2004 08:03', '10-06-2004 14:18'],
    [8.276628, '24-05-2004 07:03', '04-06-2004 10:12'],
]);

dataset('start dates', [
    [-5.5, '24-05-2004 18:05', '14-05-2004 12:00'],
    [-6.7470217, '24-05-2004 18:03', '13-05-2004 10:02'],
]);

test('calculate end date', function (float $estimation, string $startDate, string $expectedEndDate) {
    $service = new EstimationService();

    $end = $service->calulateEnddate($estimation, $startDate);

    expect($end->format('d-m-Y H:i'))->toBe($expectedEndDate);
})->with('end dates');

test('calculate start date', function (float $estimation, string $endDate, string $expectedStartDate) {
    $service = new EstimationService();

    $start = $service->calulateStartdate($estimation, $endDate);

    expect($start->format('d-m-Y H:i'))->toBe($expectedStartDate);
})->with('start dates');
