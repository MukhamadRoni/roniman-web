<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Article */
class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'lang' => $this->lang,
            'platform' => $this->platform,
            'url' => $this->url,
            'tags' => $this->tags ?? [],
            'read_minutes' => $this->read_minutes,
            'cover_code' => $this->cover_code,
            'sample' => $this->is_sample,
            'published_at' => $this->published_at?->toDateString(),
        ];
    }
}
