<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioApiTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_portfolio_endpoint_returns_every_section(): void
    {
        $response = $this->getJson('/api/portfolio');

        $response->assertOk()
            ->assertJsonStructure([
                'profile' => ['name', 'contact' => ['email', 'whatsapp'], 'hero' => ['title' => ['id', 'en']], 'about', 'stats' => ['years', 'public_repos']],
                'projects' => [['slug', 'name', 'category', 'language', 'description' => ['id', 'en'], 'tags', 'featured', 'url', 'pushed_at']],
                'articles' => [['title', 'lang', 'platform', 'published_at', 'sample']],
                'experiences' => [['company' => ['id', 'en'], 'role', 'started_at', 'highlights']],
                'educations' => [['institution', 'period', 'description']],
                'skills' => [['key', 'name', 'icon', 'items']],
            ]);

        // Featured project comes first.
        $this->assertSame('e-voting', $response->json('projects.0.slug'));
        $this->assertTrue($response->json('projects.0.featured'));
    }

    public function test_projects_can_be_filtered_by_category(): void
    {
        $response = $this->getJson('/api/projects?category=embedded');

        $response->assertOk();
        $this->assertNotEmpty($response->json('data'));
        $this->assertSame(['embedded'], array_values(array_unique(array_column($response->json('data'), 'category'))));
    }

    public function test_topline_is_shown_as_a_desktop_project(): void
    {
        $this->getJson('/api/projects/topline')
            ->assertOk()
            ->assertJsonPath('data.name', 'Topline')
            ->assertJsonPath('data.category', 'desktop')
            ->assertJsonPath('data.url', 'https://github.com/MukhamadRoni/topline');

        $slugs = array_column($this->getJson('/api/projects?category=desktop')->json('data'), 'slug');
        $this->assertSame(['topline'], $slugs);
    }

    public function test_document_ocr_is_listed_without_a_repo(): void
    {
        $this->getJson('/api/projects/document-ocr')
            ->assertOk()
            ->assertJsonPath('data.name', 'Document OCR')
            ->assertJsonPath('data.category', 'data')
            ->assertJsonPath('data.url', null)
            ->assertJsonPath('data.featured', false);
    }

    public function test_simready_assets_is_listed_with_its_repo(): void
    {
        $this->getJson('/api/projects/simready-assets')
            ->assertOk()
            ->assertJsonPath('data.name', 'SimReady Assets')
            ->assertJsonPath('data.category', 'data')
            ->assertJsonPath('data.url', 'https://github.com/MukhamadRoni/simready-assets')
            ->assertJsonPath('data.featured', false);
    }

    public function test_invalid_category_is_rejected(): void
    {
        $this->getJson('/api/projects?category=games')->assertUnprocessable();
    }

    public function test_hidden_projects_are_not_listed_or_shown(): void
    {
        Project::query()->where('slug', 'RoVaultX')->update(['is_visible' => false]);

        $slugs = array_column($this->getJson('/api/projects')->json('data'), 'slug');
        $this->assertNotContains('RoVaultX', $slugs);
        $this->getJson('/api/projects/RoVaultX')->assertNotFound();
    }

    public function test_articles_can_be_filtered_by_language(): void
    {
        $response = $this->getJson('/api/articles?lang=en');

        $response->assertOk();
        $this->assertSame(['en'], array_values(array_unique(array_column($response->json('data'), 'lang'))));
    }
}
