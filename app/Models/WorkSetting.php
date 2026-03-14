<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkSetting extends Model
{
    protected $fillable = [
        'workday_start',
        'workday_end',
    ];

    protected $casts = [
        'workday_start' => 'datetime:H:i',
        'workday_end' => 'datetime:H:i',
    ];
}
