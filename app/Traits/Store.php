<?php

namespace App\Traits;
use Illuminate\Support\Facades\Storage;

trait Store {
    
    public function saveImage($file_from_request) {
        $path = Storage::putFile('images', $file_from_request);
        return $path;
    }
}   
