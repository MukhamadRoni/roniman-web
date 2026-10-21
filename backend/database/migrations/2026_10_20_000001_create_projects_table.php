<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique()->comment('GitHub repository name');
            $table->string('short_name')->nullable()->comment('Display name when the repo name is too long');
            $table->string('category', 32)->index()->comment('web | data | auto | embedded | desktop');
            $table->string('language', 64)->nullable();
            $table->json('description')->comment('{"id": "...", "en": "..."}');
            $table->json('tags')->nullable();
            $table->json('metrics')->nullable()->comment('Featured card rows: {"id": [[label, value]], "en": [...]}');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_visible')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->unsignedInteger('stars')->default(0);
            $table->string('repo_url');
            $table->string('homepage')->nullable();
            $table->timestamp('pushed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
