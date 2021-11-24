<?php

use App\Http\Controllers\Reports;
use App\Models\Report;

Route::get('/reports', [Reports::class, 'get'])
->middleware('auth')->name('reports');

Route::get('/reports/create', function() {
    return view('app.reports_create_update');
})->middleware('auth')->name('create_report_form');

Route::post('/reports/create', [Reports::class, 'create'])
->middleware('auth')->name('create_report_action');

Route::get('reports/delete/{id}', [Reports::class, 'delete'])
->whereNumber('id')->middleware('auth');

Route::get('reports/update/{id}', function($id) {
    $report = Report::find($id);
    $data = [
        'id' => $report['id'],
        'year' => $report['year'], 
        'published_at' => $report['published_at'], 
        'is_active' => $report['is_active'], 
        'img_src' => $report['img_src'],
        'path_to_report_book' => $report->reportBook["path_to_report_book"],
    ];
    return view('app.reports_create_update', ['data' => $data]);
})->whereNumber('id')->middleware('auth');

Route::post('reports/update/{id}', [Reports::class, 'update'])
->whereNumber('id')->middleware('auth');