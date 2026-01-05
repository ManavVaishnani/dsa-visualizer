<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Algorithm\BubbleSortController;

Route::get('/', function () {
    return Inertia::render('Algorithms', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

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
    Route::get('/insertion-sort', function () {
        return Inertia::render('visualize/InsertionSort', [
            'breadcrumbs' => [
                ['title' => 'Algorithms', 'href' => '/'],
                ['title' => 'Insertion Sort']
            ]
        ]);
    });
    Route::get('/merge-sort', function () {
        return Inertia::render('visualize/MergeSort', [
            'breadcrumbs' => [
                ['title' => 'Algorithms', 'href' => '/'],
                ['title' => 'Merge Sort']
            ]
        ]);
    });
    Route::get('/quick-sort', function () {
        return Inertia::render('visualize/QuickSort', [
            'breadcrumbs' => [
                ['title' => 'Algorithms', 'href' => '/'],
                ['title' => 'Quick Sort']
            ]
        ]);
    });
    Route::get('/bfs', function () {
        return Inertia::render('visualize/BFS', [
            'breadcrumbs' => [
                ['title' => 'Algorithms', 'href' => '/'],
                ['title' => 'BFS']
            ]
        ]);
    });
});

require __DIR__.'/settings.php';
