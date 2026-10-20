<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        'company', 'role', 'started_at', 'ended_at', 'highlights', 'tags', 'is_featured', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'company' => 'array',
            'role' => 'array',
            'highlights' => 'array',
            'tags' => 'array',
            'started_at' => 'date',
            'ended_at' => 'date',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
