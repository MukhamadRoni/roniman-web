<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'category' => ['nullable', Rule::in(Project::CATEGORIES)],
        ]);

        $projects = Project::query()
            ->showcase()
            ->when($validated['category'] ?? null, fn ($q, $category) => $q->where('category', $category))
            ->get();

        return ProjectResource::collection($projects);
    }

    public function show(Project $project): ProjectResource
    {
        abort_unless($project->is_visible, 404);

        return new ProjectResource($project);
    }
}
