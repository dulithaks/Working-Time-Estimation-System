<?php

namespace App\Services;

use Carbon\Carbon;
use App\Models\Holiday;
use App\Models\WorkSetting;

class EstimationService
{
    private const WORK_HOURS_PER_DAY = 8;
    private Carbon $workStartTime;
    private Carbon $workEndTime;

    public function __construct()
    {
        $worktime = WorkSetting::first();
        if ($worktime) {
            $this->workStartTime = Carbon::parse($worktime->workday_start);
            $this->workEndTime = Carbon::parse($worktime->workday_end);
        }
    }

    /**
     * Returns the other task date based on the estimation (in days).
     *
     * If estimation is positive, the provided date is treated as the start date and
     * the returned value is the end date.
     *
     * If estimation is negative, the provided date is treated as the end date and
     * the returned value is the start date.
     *
     * @param float|int $estimation
     * @param \Carbon\Carbon|string $date
     * @return \Carbon\Carbon
     */
    public function calulateEnddate(float|int $estimation, Carbon|string $startDate): Carbon
    {
        // If estimation is negative, throw an exception as this method is only for calculating end date based on start date
        if ($estimation < 0) {
            throw new \InvalidArgumentException('Estimation must be a positive value when calculating end date.');
        }

        $estimationInHours = $estimation * self::WORK_HOURS_PER_DAY;

        $currentDay = $startDate instanceof Carbon ? $startDate->copy() : Carbon::parse($startDate);

        do {
            // If end date is a holiday, skip it
            if ($this->isHoliday($currentDay)) {
                $currentDay->setTime($this->workStartTime->format('H'), $this->workStartTime->format('i'))->addDay();
                continue;
            }

            // If end date is a weekend, skip it
            if ($currentDay->isWeekend()) {
                $currentDay->setTime($this->workStartTime->format('H'), $this->workStartTime->format('i'))->addDay();
                continue;
            }

            // Calculate remaining working hours in the current day
            $remainingHoursInCurrentDay = $this->remainingHoursInDay($currentDay);

            if ($remainingHoursInCurrentDay >= $estimationInHours) {
                return $currentDay->copy()->addHours($estimationInHours);
            } else {
                $estimationInHours -= $remainingHoursInCurrentDay;
                $currentDay = $currentDay->copy()
                    ->setTime($this->workStartTime->format('H'), $this->workStartTime->format('i'))
                    ->addDay();
            }
        } while ($estimationInHours > 0);

        return $currentDay;
    }

    /**
     * Returns the other task date based on the estimation (in days).
     * 
     */
    public function calulateStartdate(float|int $estimation, Carbon|string $date): Carbon
    {
        if ($estimation > 0) {
            throw new \InvalidArgumentException('Estimation must be a negative value when calculating start date.');
        }

        $carbonDate = $date instanceof Carbon ? $date : Carbon::parse($date);

        $date2 = $carbonDate->copy()->addDays($estimation);

        // If date 2 smaller than date 1, we need to calculate the actual working days between them and adjust date 2 accordingly
        if ($date2->lessThan($carbonDate)) {
        }
    }

    /**
     * Checks if the given date is a holiday.
     */
    protected function isHoliday(Carbon $date): bool
    {
        $x = Holiday::whereDate('date', $date->format('Y-m-d'))
            ->orWhere(function ($query) use ($date) {
                $query->where('date', 'like', '%-' . $date->format('m') . '-' . $date->format('d'))
                    ->where('is_recurring', true);
            })->exists();


        return $x;
    }

    /**
     * Returns the remaining working hours in the day for the given date.
     */
    protected function remainingHoursInDay(Carbon $date): float
    {
        $diff =  $date->diffInMinutes($date->copy()->setTime($this->workEndTime->format('H'), $this->workEndTime->format('i')));
        $diffInHours = $diff / 60;
        return min(max($diffInHours, 0), self::WORK_HOURS_PER_DAY);
    }
}
