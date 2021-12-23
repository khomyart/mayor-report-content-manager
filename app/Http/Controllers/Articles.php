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

    public function show (Request $request) {
        $reports = [];
        $reportsInstances = Report::all();
        
        foreach ($reportsInstances as $key => $reportInstance) {
            $reports[] = $reportInstance;
            foreach ($reportInstance->articles as $key => $article) {
                foreach($article->charts as $chart) {
                    $chart->datasets;
                }
            }
        }

        return view('app.articles', ['reports' => $reports]);
        // return $reports;
    }

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

                $chartInstance = Chart::create([
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

                if(count($chart['dataset']) > 0) {
                    foreach($chart['dataset'] as $dataset) {
                        ChartDataset::create([
                            'chart_id' => $chartInstance -> id,
                            'label' => $dataset['label'],
                            'value' => $dataset['value']
                        ]);
                    }
                }

                $index++;
            }

            return $createdArticle;
        }
    }

    public function update (Request $request, $id) {
        $validation_is_passed = true;
        $currentArticle = Article::find($id);

        if(!empty($currentArticle) && $validation_is_passed) {
            $currentArticle->name = $request->post('article_name');
            $currentArticle->content = $request->post('article_text');

            if ($request->post('is_file_deleted') == "true") {
                $currentArticle->path_to_additional_content = null;
            } 

            if ($request->hasFile('additional_file')) {
                $currentArticle->path_to_additional_content = $this->saveFile($request->file('additional_file'));
            }
                
            foreach($currentArticle->charts as $chart) {
                $chart->delete();
            }

            $index = 0;
            foreach(json_decode($request->post('charts'), true) as $chart) {
                $chartInstance = Chart::create([
                    'article_id' => $currentArticle->id,
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

                if(count($chart['dataset']) > 0) {
                    foreach($chart['dataset'] as $dataset) {
                        ChartDataset::create([
                            'chart_id' => $chartInstance -> id,
                            'label' => $dataset['label'],
                            'value' => $dataset['value']
                        ]);
                    }
                }

                $index++;
            }
            $currentArticle->save();
            return $currentArticle;
        }
    }

    public function delete (Request $request, $id) {
        $article = Article::find($id);
        $article->path_to_additional_content != null ?:  Storage::delete($article->path_to_additional_content);
        return back();
    }
}
