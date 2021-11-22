<?php

Route::get('/presentations', function () {
    return view('app.presentations');
})->middleware('auth')->name('presentations');