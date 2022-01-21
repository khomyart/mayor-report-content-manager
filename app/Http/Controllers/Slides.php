<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Presentation;
use App\Models\Slide;
use App\Models\Report;

use App\Traits\Store;

class Slides extends Controller
{
    public function show ($id) {
            $presentation = Presentation::find($id);
            
            return view('app.slides', 
            [
                'presentationId' => $id,
                'reportId' => $presentation->report_id,
                'serverUrl' => url('/'),
                'presentationName' => $presentation->name,
                'slides' => $presentation->slides->toArray(),
                'images' => Images::getConvertedImageList($presentation->images->toArray()),
                'templates' => Report::find($presentation->report_id)->templates->toArray(),
                'url' => url('/').'/presentations',
                'mode' => 'presentation'
            ]);
    }

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
        // return $request->post('slides');
    }
}
