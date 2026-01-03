<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Algorithm\BubbleSortController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('visualize')->group(function () {
    Route::get('/bubble-sort', function () {
        return Inertia::render('visualize/BubbleSort', [
            'breadcrumbs' => [
                ['title' => 'Algorithms', 'href' => '/'],
                ['title' => 'Bubble Sort']
            ]
        ]);
    });
    Route::get('/selection-sort', function () {
        return Inertia::render('visualize/SelectionSort', [
            'breadcrumbs' => [
                ['title' => 'Algorithms', 'href' => '/'],
                ['title' => 'Selection Sort']
            ]
        ]);
    });
});

require __DIR__.'/settings.php';
