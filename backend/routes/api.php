<?php

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\ProjectController;
use Illuminate\Support\Facades\Route;

// All routes here are prefixed with /api (see bootstrap/app.php).

Route::get('/portfolio', PortfolioController::class)->name('portfolio');

Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
Route::get('/projects/{project:slug}', [ProjectController::class, 'show'])->name('projects.show');

Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');

Route::post('/messages', [MessageController::class, 'store'])
    ->middleware('throttle:messages')
    ->name('messages.store');
