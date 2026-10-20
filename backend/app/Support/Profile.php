<?php

namespace App\Support;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

/** Builds the profile payload from config/portfolio.php plus a few computed numbers. */
class Profile
{
    public const PUBLIC_REPOS_CACHE_KEY = 'github.public_repos';

    public static function yearsOfExperience(): int
    {
        return (int) floor(Carbon::parse(config('portfolio.career_start'))->diffInYears(now()));
    }

    public static function publicRepos(): int
    {
        return (int) Cache::get(self::PUBLIC_REPOS_CACHE_KEY, config('portfolio.github.public_repos_fallback'));
    }

    public static function toArray(): array
    {
        $config = config('portfolio');
        $years = self::yearsOfExperience();

        $tiles = array_map(function (array $tile) use ($years) {
            $tile['value'] = str_replace('{years}', (string) $years, $tile['value']);

            return $tile;
        }, $config['about']['tiles']);

        return [
            'name' => $config['name'],
            'role' => $config['role'],
            'company' => $config['company'],
            'location' => $config['location'],
            'available' => (bool) $config['available'],
            'contact' => $config['contact'],
            'hero' => $config['hero'],
            'about' => [
                'title' => $config['about']['title'],
                'paragraphs' => $config['about']['paragraphs'],
                'tiles' => $tiles,
            ],
            'stats' => [
                'years' => $years,
                'model_accuracy' => 98,
                'public_repos' => self::publicRepos(),
            ],
        ];
    }
}
