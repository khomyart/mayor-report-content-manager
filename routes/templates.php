<?php
use App\Http\Controllers\Reports;
use App\Http\Controllers\Templates;
use App\Http\Controllers\TemplateImages;

use App\Models\Report;

use Illuminate\Http\Request;

Route::get('/report/{id}/templates', [Templates::class, 'show'])
->whereNumber('id')->middleware('auth')->name('show_templates');

Route::post('/report/template/create', [Templates::class, 'create'])
->whereNumber('id')->middleware('auth');

Route::get('/report/{id}/templates/get', [Templates::class, 'get'])
->whereNumber('id')->middleware('auth');


Route::post('/report/{reportId}/image/create', [TemplateImages::class, 'create'])
->whereNumber('reportId')->middleware('auth');

Route::post('/report/{reportId}/image/{imageId}/delete', [TemplateImages::class, 'delete'])
->whereNumber('reportId')->whereNumber('imageId')->middleware('auth');

Route::post('/report/{reportId}/image/{imageId}/rename', [TemplateImages::class, 'rename'])
->whereNumber('reportId')->whereNumber('imageId')->middleware('auth');

Route::post('/report/{id}/images/get', [TemplateImages::class, 'get'])
->whereNumber('id')->middleware('auth');

