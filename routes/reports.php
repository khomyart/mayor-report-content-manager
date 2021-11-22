<?php

use App\Http\Controllers\Reports;

Route::get('/reports', [Reports::class, 'get'])
->middleware('auth')->name('reports');


Route::get('/reports/create', function() {
    return view('app.reports_create_update');
})->middleware('auth')->name('create_report_form');

Route::post('/reports/create', [Reports::class, 'create'])
->middleware('auth')->name('create_report_action');