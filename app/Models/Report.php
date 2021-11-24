<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\ReportBook;
use App\Models\Article;

class Report extends Model
{
    use SoftDeletes;

    protected $guarded = [];
    
    public function reportBook() {
        return $this->hasOne(ReportBook::class);
    }

    public function articles() {
        return $this->hasMany(Article::class);
    }

    // public function presentations() {
        
    // }
}
