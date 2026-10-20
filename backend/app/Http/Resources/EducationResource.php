<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Education */
class EducationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'institution' => $this->institution,
            'period' => $this->period,
            'description' => $this->description,
            'score' => $this->score,
            'score_max' => $this->score_max,
            'featured' => $this->is_featured,
        ];
    }
}
