<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('excerpt')->nullable();
            $table->string('lang', 2)->index()->comment('Language the article is written in: id | en');
            $table->string('platform', 64);
            $table->string('url')->nullable();
            $table->json('tags')->nullable();
            $table->unsignedSmallInteger('read_minutes')->default(5);
            $table->text('cover_code')->nullable()->comment('Optional code snippet drawn on the cover');
            $table->boolean('is_sample')->default(false)->comment('Placeholder content, replace with real articles');
            $table->date('published_at')->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
