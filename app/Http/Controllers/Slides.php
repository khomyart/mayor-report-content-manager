<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Presentation;
use App\Models\Slide;
use Illuminate\Support\Facades\DB;

use App\Traits\Store;

class Slides extends Controller
{
    public function create(Request $request) {
        $presentationId = $request->post('presentationId');
        $slides = json_decode($request->post('slides'), true);

        foreach (Slide::where('presentation_id', $presentationId)->get() as $slide) {
            $slide->delete();
        }

        foreach ($slides as $slide) {
            Slide::create([
                'name' => $slide['name'],
                'content' => $slide['content'],
                'presentation_id' =>  $presentationId,
            ]);
        }

        $newSlides = Presentation::find($presentationId)->slides;
        return $newSlides;
        // return $newSlides;
    }
}
