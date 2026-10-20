<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Support\Profile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GithubSyncTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_sync_updates_projects_and_repo_count(): void
    {
        Http::fake([
            'api.github.com/*' => Http::response([
                ['name' => 'e-voting', 'private' => false, 'fork' => false, 'language' => 'PHP', 'stargazers_count' => 7,
                    'homepage' => 'https://vote.example', 'html_url' => 'https://github.com/MukhamadRoni/e-voting', 'pushed_at' => '2026-10-15T08:00:00Z'],
                ['name' => 'brand-new-repo', 'private' => false, 'fork' => false, 'language' => 'Go', 'stargazers_count' => 0,
                    'homepage' => null, 'html_url' => 'https://github.com/MukhamadRoni/brand-new-repo', 'pushed_at' => '2026-10-16T08:00:00Z',
                    'description' => 'New thing', 'topics' => ['go']],
                ['name' => 'someone-elses-fork', 'private' => false, 'fork' => true, 'html_url' => 'https://github.com/x/y'],
            ]),
        ]);

        $this->artisan('github:sync', ['--import' => true])->assertSuccessful();

        $project = Project::where('slug', 'e-voting')->first();
        $this->assertSame(7, $project->stars);
        $this->assertSame('https://vote.example', $project->homepage);
        $this->assertSame('2026-10-15', $project->pushed_at->toDateString());

        $imported = Project::where('slug', 'brand-new-repo')->first();
        $this->assertNotNull($imported);
        $this->assertFalse($imported->is_visible);

        $this->assertSame(2, Profile::publicRepos());
    }

    public function test_sync_reports_github_errors(): void
    {
        Http::fake(['api.github.com/*' => Http::response(['message' => 'API rate limit exceeded'], 403)]);

        $this->artisan('github:sync')->assertFailed();
    }
}
