<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Chart;

class Article extends Model
{
    protected $guarded = [];

    public function charts() {
        return $this->hasMany(Chart::class);
    }

}
