<?php

use Illuminate\Support\Facades\Schedule;

// Keep repository languages, push dates, and the public repo count fresh.
// Runs when the scheduler is active: `php artisan schedule:work` (local) or a cron entry (server).
Schedule::command('github:sync')->dailyAt('03:00');
