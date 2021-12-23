<?php

use App\Models\Article;
use App\Models\Report;
use Illuminate\Http\Request;
use App\Http\Controllers\Articles;

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
    $article = Article::find($id);
    
    foreach ($article->charts as $chart) {
        $chart->datasets;
    }

    return view('app.articles_update', ['article' => $article, 'reports' => Report::all()]);
})->whereNumber('id')->middleware('auth')->name('update_article');

Route::post('/article/update/{id}', [Articles::class, 'update']);