<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    public const CATEGORIES = ['web', 'data', 'auto', 'embedded', 'desktop'];

    protected $fillable = [
        'slug', 'short_name', 'category', 'language', 'description', 'tags', 'metrics',
        'is_featured', 'is_visible', 'sort_order', 'stars', 'repo_url', 'homepage', 'pushed_at',
    ];

    protected function casts(): array
    {
        return [
            'description' => 'array',
            'tags' => 'array',
            'metrics' => 'array',
            'is_featured' => 'boolean',
            'is_visible' => 'boolean',
            'stars' => 'integer',
            'sort_order' => 'integer',
            'pushed_at' => 'datetime',
        ];
    }

    /** Visible projects, featured first, then by sort order and latest push. */
    public function scopeShowcase(Builder $query): Builder
    {
        return $query->where('is_visible', true)
            ->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderByDesc('pushed_at');
    }
}
