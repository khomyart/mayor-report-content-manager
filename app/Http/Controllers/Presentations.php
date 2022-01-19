<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\Presentation;
use Illuminate\Support\Facades\DB;

use App\Traits\Store;

class Presentations extends Controller
{
    use Store;

    public function show (Request $request) {
        $reports = [];
        $reportsItems = Report::where('id', '>', 0)->orderByDesc("year")->get()->toArray();

        foreach ($reportsItems as $reportKey => $reportItem) {
            $reports[] = $reportItem;
            $reports[$reportKey]["presentations"] = Presentation::where('report_id', $reportItem["id"])->orderBy("number_in_list")->get()->toArray();
        }

        return view('app.presentations', ['reports' => $reports]);
    }

    public function create (Request $request) {
        $isValidationPassed = true;
        $lastNumberInList = DB::table('presentations')->orderByDesc('number_in_list')->first();
        $lastNumberInList != null ? $lastNumberInList = $lastNumberInList->number_in_list : 0;

        if(Report::find($request->post('report_id')) && $isValidationPassed) {
            $createdPresentation = Presentation::create(
                [
                    'report_id' => $request->post('report_id'),
                    'name' => $request->post('presentation_name'),
                    'number_in_list' => $lastNumberInList + 1
                ]
            );
        }
    
        return back();
    }

    public function update (Request $request) {
        $isValidationPassed = true;
        
        if ($isValidationPassed == true) {
            $currentPresentation = Presentation::find($request->post('presentation_id'));
            
            $currentPresentation->report_id = $request->post('report_id');
            $currentPresentation->name = $request->post('presentation_name');
            $currentPresentation->save();
        }

        return back();
    }

    public function delete (Request $request, $id) {
        $presentation = Presentation::find($id);
        $presentation->delete();
        return redirect()->route('presentations');
    }

    public function move (Request $request, $id, $direction) {
        $currentPresentation = Presentation::find($id);
        $currentPresentationNumberInList = $currentPresentation->number_in_list;
        $closestAbovePresentation = Presentation::where('number_in_list', '>', $currentPresentation->number_in_list)
            ->where('report_id', $currentPresentation->report_id)
            ->orderBy('number_in_list')
            ->first();
        $closestBelowPresentation = Presentation::where('number_in_list', '<', $currentPresentation->number_in_list)
            ->where('report_id', $currentPresentation->report_id)
            ->orderByDesc('number_in_list')
            ->first();

        if ($direction == "up") {
            if ($closestAbovePresentation != null) {
                $currentPresentation->number_in_list = $closestAbovePresentation->number_in_list;
                $currentPresentation->save();
                $closestAbovePresentation->number_in_list = $currentPresentationNumberInList;
                $closestAbovePresentation->save();
            }
        }

        if ($direction == "down") {
            if ($closestBelowPresentation != null) {
                $currentPresentation->number_in_list = $closestBelowPresentation->number_in_list;
                $currentPresentation->save();
                $closestBelowPresentation->number_in_list = $currentPresentationNumberInList;
                $closestBelowPresentation->save();
            }
        }

        return back();
    }
}
