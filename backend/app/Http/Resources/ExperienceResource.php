<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Experience */
class ExperienceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'company' => $this->company,
            'role' => $this->role,
            'started_at' => $this->started_at?->toDateString(),
            'ended_at' => $this->ended_at?->toDateString(),
            'highlights' => $this->highlights,
            'tags' => $this->tags ?? [],
            'featured' => $this->is_featured,
        ];
    }
}
