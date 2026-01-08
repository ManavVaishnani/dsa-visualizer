<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Algorithm\BubbleSortController;

Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/algorithms', function () {
    return Inertia::render('Algorithms', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('algorithms');

Route::get('/sorting', function () {
    return Inertia::render('Sorting');
})->name('sorting');

Route::get('/searching', function () {
    return Inertia::render('Searching');
})->name('searching');

Route::get('/graphs', function () {
    return Inertia::render('Graphs');
})->name('graphs');

Route::prefix('visualize')->group(function () {
    Route::get('/bubble-sort', function () {
        return Inertia::render('visualize/BubbleSort', [
            'breadcrumbs' => [
                ['title' => 'Home', 'href' => '/'],
                ['title' => 'Sorting', 'href' => '/sorting'],
                ['title' => 'Bubble Sort']
            ]
        ]);
    });
    Route::get('/selection-sort', function () {
        return Inertia::render('visualize/SelectionSort', [
            'breadcrumbs' => [
                ['title' => 'Home', 'href' => '/'],
                ['title' => 'Sorting', 'href' => '/sorting'],
                ['title' => 'Selection Sort']
            ]
        ]);
    });
    Route::get('/insertion-sort', function () {
        return Inertia::render('visualize/InsertionSort', [
            'breadcrumbs' => [
                ['title' => 'Home', 'href' => '/'],
                ['title' => 'Sorting', 'href' => '/sorting'],
                ['title' => 'Insertion Sort']
            ]
        ]);
    });
    Route::get('/merge-sort', function () {
        return Inertia::render('visualize/MergeSort', [
            'breadcrumbs' => [
                ['title' => 'Home', 'href' => '/'],
                ['title' => 'Sorting', 'href' => '/sorting'],
                ['title' => 'Merge Sort']
            ]
        ]);
    });
    Route::get('/quick-sort', function () {
        return Inertia::render('visualize/QuickSort', [
            'breadcrumbs' => [
                ['title' => 'Home', 'href' => '/'],
                ['title' => 'Sorting', 'href' => '/sorting'],
                ['title' => 'Quick Sort']
            ]
        ]);
    });
    Route::get('/bfs', function () {
        return Inertia::render('visualize/BFS', [
            'breadcrumbs' => [
                ['title' => 'Home', 'href' => '/'],
                ['title' => 'Graphs', 'href' => '/graphs'],
                ['title' => 'BFS']
            ]
        ]);
    });
    Route::get('/dfs', function () {
        return Inertia::render('visualize/DFS', [
            'breadcrumbs' => [
                ['title' => 'Home', 'href' => '/'],
                ['title' => 'Graphs', 'href' => '/graphs'],
                ['title' => 'DFS']
            ]
        ]);
    });
    Route::get('/linear-search', function () {
        return Inertia::render('visualize/LinearSearch', [
            'breadcrumbs' => [
                ['title' => 'Home', 'href' => '/'],
                ['title' => 'Searching', 'href' => '/searching'],
                ['title' => 'Linear Search']
            ]
        ]);
    });
    Route::get('/binary-search', function () {
        return Inertia::render('visualize/BinarySearch', [
            'breadcrumbs' => [
                ['title' => 'Home', 'href' => '/'],
                ['title' => 'Searching', 'href' => '/searching'],
                ['title' => 'Binary Search']
            ]
        ]);
    });
});

require __DIR__.'/settings.php';
