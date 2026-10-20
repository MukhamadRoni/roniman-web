<?php

namespace App\Console\Commands;

use App\Models\Project;
use App\Support\Profile;
use Illuminate\Console\Command;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class SyncGithubRepos extends Command
{
    protected $signature = 'github:sync
        {--import : Also add repositories that are not in the database yet (hidden until you publish them)}';

    protected $description = 'Refresh language, stars, homepage, and last push date of projects from the GitHub API';

    public function handle(): int
    {
        $username = config('portfolio.github.username');
        $repos = [];

        try {
            for ($page = 1; $page <= 5; $page++) {
                $response = Http::withHeaders(['Accept' => 'application/vnd.github+json', 'User-Agent' => 'personal-web'])
                    ->when(config('portfolio.github.token'), fn ($http, $token) => $http->withToken($token))
                    ->timeout(20)
                    ->get("https://api.github.com/users/{$username}/repos", [
                        'per_page' => 100,
                        'page' => $page,
                        'type' => 'owner',
                    ]);

                if ($response->failed()) {
                    $this->error("GitHub answered {$response->status()}: ".$response->json('message', 'unknown error'));

                    return self::FAILURE;
                }

                $batch = $response->json();
                $repos = array_merge($repos, $batch);

                if (count($batch) < 100) {
                    break;
                }
            }
        } catch (ConnectionException $e) {
            $this->error('Could not reach GitHub: '.$e->getMessage());

            return self::FAILURE;
        }

        $public = array_filter($repos, fn (array $repo) => ! ($repo['private'] ?? false) && ! ($repo['fork'] ?? false));
        Cache::forever(Profile::PUBLIC_REPOS_CACHE_KEY, count($public));

        $updated = 0;
        $imported = 0;

        foreach ($public as $repo) {
            $attributes = [
                'language' => $repo['language'] ?? null,
                'stars' => (int) ($repo['stargazers_count'] ?? 0),
                'homepage' => ($repo['homepage'] ?? null) ?: null,
                'repo_url' => $repo['html_url'],
                'pushed_at' => isset($repo['pushed_at']) ? Carbon::parse($repo['pushed_at']) : null,
            ];

            $project = Project::query()->where('slug', $repo['name'])->first();

            if ($project) {
                $project->update($attributes);
                $updated++;
            } elseif ($this->option('import')) {
                Project::create($attributes + [
                    'slug' => $repo['name'],
                    'category' => 'web',
                    'description' => ['id' => $repo['description'] ?? '', 'en' => $repo['description'] ?? ''],
                    'tags' => $repo['topics'] ?? [],
                    'is_visible' => false,
                    'sort_order' => 999,
                ]);
                $imported++;
            }
        }

        $this->info(sprintf(
            'Public repos: %d. Updated %d project(s)%s.',
            count($public),
            $updated,
            $this->option('import') ? ", imported {$imported} hidden project(s)" : ''
        ));

        return self::SUCCESS;
    }
}
