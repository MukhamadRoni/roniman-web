<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SkillGroup extends Model
{
    protected $fillable = ['key', 'name', 'icon', 'items', 'sort_order'];

    protected function casts(): array
    {
        return [
            'items' => 'array',
            'sort_order' => 'integer',
        ];
    }
}
