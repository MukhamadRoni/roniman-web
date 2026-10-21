<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json([
    'name' => config('app.name'),
    'endpoints' => [
        'GET /api/portfolio',
        'GET /api/projects?category=web|data|auto|embedded|desktop',
        'GET /api/projects/{slug}',
        'GET /api/articles?lang=id|en',
        'POST /api/messages',
    ],
    'frontend' => config('cors.allowed_origins'),
]));
