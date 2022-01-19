<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Presentation;
use App\Models\Image;
use Illuminate\Support\Facades\DB;

use App\Traits\Store;

class Slides extends Controller
{
    use Store;

    public function create(Request $request, $presentationId) {
        return $request->file();
    }
}
