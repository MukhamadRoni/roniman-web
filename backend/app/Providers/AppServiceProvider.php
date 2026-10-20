<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Contact form: 5 messages per minute and 20 per day per visitor.
        RateLimiter::for('messages', fn (Request $request) => [
            Limit::perMinute(5)->by($request->ip()),
            Limit::perDay(20)->by($request->ip()),
        ]);
    }
}
