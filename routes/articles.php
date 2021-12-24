<?php
use App\Http\Controllers\Articles;

use App\Models\Article;
use App\Models\Report;
use App\Models\Chart;
use App\Models\ChartDataset;

use Illuminate\Http\Request;

Route::get('/articles', [Articles::class, 'show'])
->middleware('auth')->name('articles');

Route::get('/articles/create/{current_report_id?}', function ($current_report_id = null) {
    return view("app.articles_create", ['reports' => Report::all(), 'current_report_id' => $current_report_id]);
})->middleware('auth')->name('create_article_form');

Route::post('/articles/create', [Articles::class, 'create'])
->middleware('auth')->name('create_article');

Route::get('/articles/remove/{id}', [Articles::class, 'delete'])
->whereNumber('id')->middleware('auth')->name('remove_article');

Route::get('/article/update/{id}', function ($id) {
   
    $article = Article::find($id)->toArray();
    $article["charts"] = Chart::where('article_id', $article["id"])->orderBy("number_in_list")->get()->toArray();
    foreach($article["charts"] as $chartKey => $chart) {
        $article["charts"][$chartKey]["datasets"] = ChartDataset::where('chart_id', $chart["id"])->get()->toArray();
    }

    return view('app.articles_update', ['article' => $article, 'reports' => Report::all()]);
})->whereNumber('id')->middleware('auth')->name('update_article');

Route::post('/article/update/{id}', [Articles::class, 'update']);

Route::get('/article/move/{id}/{direction}', [Articles::class, 'move'])
->name('move_article');