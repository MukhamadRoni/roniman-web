<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title', 'excerpt', 'lang', 'platform', 'url', 'tags', 'read_minutes',
        'cover_code', 'is_sample', 'published_at',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'read_minutes' => 'integer',
            'is_sample' => 'boolean',
            'published_at' => 'date',
        ];
    }

    public function scopeLatestFirst(Builder $query): Builder
    {
        return $query->orderByDesc('published_at')->orderByDesc('id');
    }
}
