<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ArticleController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'lang' => ['nullable', 'in:id,en'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $articles = Article::query()
            ->latestFirst()
            ->when($validated['lang'] ?? null, fn ($q, $lang) => $q->where('lang', $lang))
            ->paginate($validated['per_page'] ?? 10);

        return ArticleResource::collection($articles);
    }
}
