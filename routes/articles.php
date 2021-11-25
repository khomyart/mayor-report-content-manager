<?php

use App\Models\Article;
use App\Models\Report;
use Illuminate\Http\Request;
use App\Http\Controllers\Articles;

Route::get('/articles', function () {
    $reports = Report::all();
    return view('app.articles', ["reports" => $reports]);
})->middleware('auth')->name('articles');

Route::get('/articles/create/{current_report_id?}', function ($current_report_id = null) {

    return view("app.articles_create", ['reports' => Report::all(), 'current_report_id' => $current_report_id]);
})->middleware('auth')->name('create_article_form');

Route::post('/articles/create', [Articles::class, 'create'])
->middleware('auth')->name('create_article');