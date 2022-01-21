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

Route::get('/login', function () {
    return redirect('/');
});

Route::get('/dashboard', function () {
    return view('app.dashboard');
})->middleware('auth')->name('dashboard');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

require __DIR__.'/reports.php';
require __DIR__.'/articles.php';
require __DIR__.'/presentations.php';
require __DIR__.'/templates.php';
