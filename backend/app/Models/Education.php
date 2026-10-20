<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    protected $table = 'educations';

    protected $fillable = [
        'institution', 'period', 'description', 'score', 'score_max', 'is_featured', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'description' => 'array',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
