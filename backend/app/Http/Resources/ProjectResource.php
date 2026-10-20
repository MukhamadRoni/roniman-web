<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Project */
class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->short_name ?: $this->slug,
            'category' => $this->category,
            'language' => $this->language,
            'description' => $this->description,
            'tags' => $this->tags ?? [],
            'metrics' => $this->metrics,
            'featured' => $this->is_featured,
            'stars' => $this->stars,
            'url' => $this->repo_url,
            'homepage' => $this->homepage,
            'pushed_at' => $this->pushed_at?->toDateString(),
        ];
    }
}
