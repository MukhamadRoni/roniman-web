<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\EducationResource;
use App\Http\Resources\ExperienceResource;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\SkillGroupResource;
use App\Models\Article;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Project;
use App\Models\SkillGroup;
use App\Support\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortfolioController extends Controller
{
    /** Everything the landing page needs, in one request. */
    public function __invoke(Request $request): JsonResponse
    {
        return response()->json([
            'profile' => Profile::toArray(),
            'projects' => ProjectResource::collection(Project::query()->showcase()->get())->resolve($request),
            'articles' => ArticleResource::collection(Article::query()->latestFirst()->limit(6)->get())->resolve($request),
            'experiences' => ExperienceResource::collection(
                Experience::query()->orderByDesc('is_featured')->orderBy('sort_order')->get()
            )->resolve($request),
            'educations' => EducationResource::collection(Education::query()->orderBy('sort_order')->get())->resolve($request),
            'skills' => SkillGroupResource::collection(SkillGroup::query()->orderBy('sort_order')->get())->resolve($request),
        ]);
    }
}
