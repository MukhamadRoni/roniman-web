<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Project;
use App\Models\SkillGroup;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use RuntimeException;

/**
 * Seeds portfolio content from database/data/*.json.
 * Edit the JSON files and run `php artisan db:seed --class=PortfolioSeeder` to refresh.
 * Projects are matched by slug, so re-seeding keeps their ids and synced GitHub data.
 */
class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->load('projects') as $project) {
            $project['pushed_at'] = $project['pushed_at'] ? Carbon::parse($project['pushed_at']) : null;
            Project::updateOrCreate(['slug' => $project['slug']], $project);
        }

        Article::query()->where('is_sample', true)->delete();
        foreach ($this->load('articles') as $article) {
            Article::updateOrCreate(
                ['title' => $article['title'], 'platform' => $article['platform']],
                $article
            );
        }

        Experience::query()->delete();
        foreach ($this->load('experiences') as $experience) {
            Experience::create($experience);
        }

        Education::query()->delete();
        foreach ($this->load('educations') as $education) {
            Education::create($education);
        }

        foreach ($this->load('skills') as $group) {
            SkillGroup::updateOrCreate(['key' => $group['key']], $group);
        }
    }

    /** @return array<int, array<string, mixed>> */
    private function load(string $name): array
    {
        $path = database_path("data/{$name}.json");
        $data = json_decode((string) file_get_contents($path), true);

        if (! is_array($data)) {
            throw new RuntimeException("Invalid seed file: {$path}");
        }

        return $data;
    }
}
