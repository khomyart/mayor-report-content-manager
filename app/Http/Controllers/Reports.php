<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Traits\Store;

use App\Models\ReportBook;

class Reports extends Controller
{
    use Store;

    public function get() {
        return view('app.reports', [
            'reports' => Report::all(),
        ]);
    }

    public function create(Request $request) {
        $report_image_path = null;
        $report_book_path = null;

        $year = $request->post("year");
        $published_at = $request->post("published_at");

        switch ($request->post("is_active")) {
            case 'on':
                $is_active = "true";
                break;
            
            default:
                $is_active = "false";
                break;
        }

        if ($request->file("report_image") != null) {
            $report_image_path = $this->saveImage($request->file("report_image"));
        } 
        if ($request->file("report_book") != null) {
            $report_book_path = $this->saveImage($request->file("report_book"));
        } 

        $report_creation_form = [
            "year" => $year,
            "published_at" => $published_at,
            "is_active" => $is_active,
            "img_src" => $report_image_path,
        ];
        
        $created_report = Report::create($report_creation_form);
        ReportBook::create([
            "report_id" => $created_report["id"],
            "path_to_report_book" => $report_book_path,
        ]);

        return redirect()->route('reports')->with('message', 'Звіт успішно створено');
    }

    public function update(Request $request, $id) {
        $report = Report::find($id);
        $report->year = $request->post("year") ?: $report->year = $request->post("year");
        $report->published_at = $request->post("published_at") ?: $report->published_at = $request->post("published_at");
        $report->is_active = $request->post("is_active") == 'on' ? 'true' : 'false';
        if ($request->hasFile("report_image")) {$report->img_src = $this->saveImage($request->file("report_image"));}
        if ($request->hasFile("report_book")) {$report->reportBook->path_to_report_book = $this->saveImage($request->file("report_book"));}

        $report->save();
        $report->reportBook->save();

        return back();
    }

    public function delete(Request $request, $id) {
        $report = Report::find($id);
        $report->delete();
        return back();
    }
}
