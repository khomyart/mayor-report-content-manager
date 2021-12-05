<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\Article;
use App\Models\Chart;
use App\Models\ChartDataset;

use App\Traits\Store;

class Articles extends Controller
{
    use Store;

    public function create (Request $request) {
        $validation_is_passed = true;

        $report = Report::find($request->post('report_id'));
        $articles = $report->articles;

        if(Report::find($request->post('report_id')) && $validation_is_passed) {
            $createdArticle = Article::create(
                [
                    'report_id' => $request->post('report_id'),
                    'name' => $request->post('article_name'),
                    'content' => $request->post('article_text'),
                    'path_to_additional_content' => 
                        $request->hasFile('additional_file') ? $this->saveFile($request->file('additional_file')) : null,
                    'number_in_list' => count($articles),
                ]
            );

            $index = 0;
            foreach(json_decode($request->post('charts'), true) as $chart) {
                $chart = Chart::create([
                    'article_id' => $createdArticle->id,
                    'number_in_list' => $index,
                    'title' => $chart['title'],
                    'legend' => $chart['legend'],
                    'type' => $chart['type'],
                    'axis_x' => $chart['axis']['x'],
                    'axis_y' => $chart['axis']['y'],
                    'suffix' => $chart['suffix'],
                    // 'is_data_labels_shown' => ?,
                    'is_verbal_rounding_enabled' => $chart['isVerbalRoundingEnabled'],
                    'is_verbal_rounding_enabled_for_hovered_labels' => $chart['isVerbalRoundingEnabledForHoveredLabels'],
                ]);

                $index++;
            }

            return $createdArticle;
        }
    }

    public function update (Request $request) {
        
    }

    public function delete (Request $request) {
        
    }
}
