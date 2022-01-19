<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Slide;
use App\Models\Image;

class Presentation extends Model
{
    protected $guarded = [];

    public function slides() {
        return $this->hasMany(Slide::class);
    }

    public function images() {
        return $this->hasMany(Image::class);
    }
}
