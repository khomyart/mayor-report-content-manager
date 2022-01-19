<?php
use App\Http\Controllers\Presentations;

use App\Models\Presentation;
use App\Models\Report;

use Illuminate\Http\Request;

Route::get('/presentations', [Presentations::class, 'show'])
->middleware('auth')->name('presentations');

Route::post('/presentation/create', [Presentations::class, 'create'])
->middleware('auth')->name('create_presentation');

Route::get('/presentation/remove/{id}', [Presentations::class, 'delete'])
->whereNumber('id')->middleware('auth')->name('remove_presentation');

Route::post('/presentation/update', [Presentations::class, 'update'])
->middleware('auth')->name('update_presentation');

Route::get('/presentation/move/{id}/{direction}', [Presentations::class, 'move'])
->name('move_presentation');

Route::get('/presentation/{id}/slides', [Slides::class, 'show'])
->name('show_slides');
