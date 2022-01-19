<?php

namespace App\Traits;
use Illuminate\Support\Facades\Storage;

trait Store {
    
    //TODO: done with this method
    public function saveImage($file_from_request) {
        $path = Storage::putFile('public', $file_from_request);
        return $path;
    }

    public function saveFile($file_from_request) {
        $path = Storage::putFile('public', $file_from_request);
        return $path;
    }

    public function deleteFile($file_name) {
        Storage::delete($file_name);
    }
}   
