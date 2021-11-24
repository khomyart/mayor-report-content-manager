<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ChartDataset;

class Chart extends Model
{
    protected $guarded = [];

    public function datasets() {
        return $this->hasMany(ChartDataset::class);
    }
}
