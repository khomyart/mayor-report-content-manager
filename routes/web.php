<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('auth.login');
});

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

Route::get('/dashboard', function () {
    return view('app.dashboard');
})->middleware('auth')->name('dashboard');

Route::get('/reports', function () {
    return view('app.reports');
})->middleware('auth')->name('reports');

Route::get('/articles', function () {
    return view('app.articles');
})->middleware('auth')->name('articles');

Route::get('/presentations', function () {
    return view('app.presentations');
})->middleware('auth')->name('presentations');
  