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
            $remainingHoursInCurrentDay = $this->remainingHoursInDayByStartDateTime($currentDay);

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
    public function calulateStartdate(float|int $estimation, Carbon|string $endDate): Carbon
    {
         // If estimation is negative, throw an exception as this method is only for calculating end date based on start date
        if ($estimation > 0) {
            throw new \InvalidArgumentException('Estimation must be a negative value when calculating start date.');
        }

        $estimationInHours = abs($estimation * self::WORK_HOURS_PER_DAY);

        $currentDay = $endDate instanceof Carbon ? $endDate->copy() : Carbon::parse($endDate);
        
        // If the provided end date is outside of working hours, set it to the end of the previous working day
        if($currentDay->greaterThan($currentDay->copy()->setTimeFrom($this->workEndTime))) {
            $currentDay->setTimeFrom($this->workEndTime);
        }

        do {
            echo "Current day: " . $currentDay->format('Y-m-d H:i') . ", Remaining estimation in hours: " . $estimationInHours . "\n";
            // If end date is a holiday, skip it
            if ($this->isHoliday($currentDay)) {
                $currentDay->setTimeFrom($this->workEndTime)->subDay();
                continue;
            }

            // If end date is a weekend, skip it
            if ($currentDay->isWeekend()) {
                $currentDay->setTimeFrom($this->workEndTime)->subDay();
                continue;
            }

            // Calculate remaining working hours in the current day
            $remainingHoursInCurrentDay = $this->remainingHoursInDayByEndDateTime($currentDay);
            
            if ($remainingHoursInCurrentDay >= $estimationInHours) {
                return $currentDay->copy()->subHours($estimationInHours);
                } else {
                    $estimationInHours -= $remainingHoursInCurrentDay;
                    $currentDay = $currentDay->copy()
                    ->setTimeFrom($this->workEndTime)
                    ->subDay();
                    // dd($remainingHoursInCurrentDay, 'estimationInHours after subtraction: ' . $estimationInHours, 'currentDay after moving to previous day: ' . $currentDay->format('Y-m-d H:i'));
            }

            // dd('after calculation', $currentDay->format('Y-m-d H:i'), $estimationInHours);
        } while ($estimationInHours > 0);

        return $currentDay;
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
    protected function remainingHoursInDayByStartDateTime(Carbon $startDateTime): float
    {
        $diff =  $startDateTime->diffInMinutes($startDateTime->copy()->setTime($this->workEndTime->format('H'), $this->workEndTime->format('i')));
        $diffInHours = $diff / 60;
        return min(max($diffInHours, 0), self::WORK_HOURS_PER_DAY);
    }

    /**
     * Returns the remaining working hours in the day for the given date.
     */
    protected function remainingHoursInDayByEndDateTime(Carbon $endDateTime): float
    {
        $diff =  $endDateTime->copy()->setTimeFrom($this->workStartTime)->diffInMinutes($endDateTime);
        $diffInHours = $diff / 60;
        return min(max($diffInHours, 0), self::WORK_HOURS_PER_DAY);
    }
}