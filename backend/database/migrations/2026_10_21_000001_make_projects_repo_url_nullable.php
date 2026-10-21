<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /** Showcase projects without a public repo (e.g. client work) have no repo URL. */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('repo_url')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('repo_url')->nullable(false)->change();
        });
    }
};
