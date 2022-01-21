<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use App\Models\Template;
use App\Models\Report;

use App\Traits\Store;

class Templates extends Controller
{
    public function show ($id) {
        $report = Report::find($id);

        return view('app.slides', 
        [
            'presentationId' => null,
            'reportId' => $id,
            'serverUrl' => url('/'),
            'presentationName' => null,
            'slides' => $report->templates->toArray(),
            'images' => Images::getConvertedImageList($report->templateImages->toArray()),
            'templates' => null,
            'url' => url('/').'/reports',
            'mode' => 'template'
        ]);
    }

    public function create(Request $request) {
        $reportId = $request->post('reportId');
        $templates = json_decode($request->post('slides'), true);

        foreach (Template::where('report_id', $reportId)->get() as $template) {
            $template->delete();
        }

        foreach ($templates as $template) {
            Template::create([
                'name' => $template['name'],
                'content' => $template['content'],
                'report_id' =>  $reportId,
            ]);
        }

        return $this->get($reportId);
    }

    public function get($reportId) {
        $templates = Report::find($reportId)->templates;
        return $templates;
    }
}
