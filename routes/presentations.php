<?php
use App\Http\Controllers\Presentations;
use App\Http\Controllers\Slides;
use App\Http\Controllers\Images;

use App\Models\Presentation;
use App\Models\Report;

use Illuminate\Http\Request;

// PRESENTATION
Route::get('/presentations', [Presentations::class, 'show'])
->middleware('auth')->name('presentations');

Route::post('/presentation/create', [Presentations::class, 'create'])
->middleware('auth')->name('create_presentation');

Route::get('/presentation/remove/{id}', [Presentations::class, 'delete'])
->whereNumber('id')->middleware('auth')->name('remove_presentation');

Route::post('/presentation/update', [Presentations::class, 'update'])
->middleware('auth')->name('update_presentation');

Route::get('/presentation/move/{id}/{direction}', [Presentations::class, 'move'])
->whereNumber('id')->middleware('auth')->name('move_presentation');

// SLIDES
Route::get('/presentation/{id}/slides', function($id) {
    function getConvertedImagesSrc($imageList) {
        $index = 0;
        foreach ($imageList as $key => $image) {
            $imageList[$index]['src'] = Storage::url($image["src"]);
            $index++;
        }

        return $imageList;
    }

    return view('app.slides', 
    [
        'presentationId' => $id,
        'serverUrl' => url('/'),
        'slides' => Presentation::find($id)->slides->toArray(),
        'images' => getConvertedImagesSrc(Presentation::find($id)->images->toArray()),
    ]);
})
->whereNumber('id')->middleware('auth')->name('show_slides');

Route::post('/presentation/{id}/slides/create', [Slides::class, 'create'])
->whereNumber('id')->middleware('auth');

Route::post('/presentation/{presentationId}/image/create', [Images::class, 'create'])
->whereNumber('presentationId')->middleware('auth');

Route::post('/presentation/{presentationId}/image/{imageId}/delete', [Images::class, 'delete'])
->whereNumber('presentationId')->whereNumber('imageId')->middleware('auth');

Route::post('/presentation/{presentationId}/image/{imageId}/rename', [Images::class, 'rename'])
->whereNumber('presentationId')->whereNumber('imageId')->middleware('auth');

// Route::post('/presentation/{presentationId}/image/get', [Images::class, 'getList'])
// ->middleware('auth');

