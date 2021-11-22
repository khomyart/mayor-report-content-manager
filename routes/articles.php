<?php

Route::get('/articles', function () {
    return view('app.articles');
})->middleware('auth')->name('articles');