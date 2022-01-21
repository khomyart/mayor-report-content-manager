<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\ReportBook;
use App\Models\Article;
use App\Models\Presentation;
use App\Models\Template;
use App\Models\TemplateImage;

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

    public function presentations() {
        return $this->hasMany(Presentation::class);
    }

    public function templates() {
        return $this->hasMany(Template::class);
    }

    public function templateImages() {
        return $this->hasMany(TemplateImage::class);
    }
}
