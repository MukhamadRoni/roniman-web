<?php

/*
| Profile content that rarely changes. Repeating content (projects, articles,
| experience, education, skills) lives in the database and is seeded from
| database/data/*.json.
*/

return [

    'name' => 'Mukhamad Roni',
    'role' => 'Software Engineer',
    'company' => 'UBS Gold',
    'location' => 'Surabaya, ID',
    'available' => true,

    'contact' => [
        'email' => env('CONTACT_EMAIL', 'mukhamadroni27@gmail.com'),
        'whatsapp' => env('CONTACT_WHATSAPP', '6283111735013'),
        'linkedin' => 'https://www.linkedin.com/in/mukhamadroni/',
        'github' => 'https://github.com/'.env('GITHUB_USERNAME', 'MukhamadRoni'),
    ],

    'github' => [
        'username' => env('GITHUB_USERNAME', 'MukhamadRoni'),
        'token' => env('GITHUB_TOKEN'),
        // Used until `php artisan github:sync` has fetched the live number.
        'public_repos_fallback' => 23,
    ],

    // Year the current software engineering career started (Jan 2023 at UBS Gold).
    'career_start' => '2023-01-01',

    'hero' => [
        'title' => [
            'id' => 'Software engineer yang membangun sistem end-to-end.',
            'en' => 'Software engineer building systems end to end.',
        ],
        'subtitle' => [
            'id' => 'PHP, Oracle, Python, dan RPA. Dari optimasi query sampai robot UV-C. Saya juga menulis dan membagikan kode secara terbuka.',
            'en' => 'PHP, Oracle, Python, and RPA. From query tuning to a UV-C robot. I also write and share my code in the open.',
        ],
    ],

    'about' => [
        'title' => [
            'id' => 'Engineer yang suka masalah nyata.',
            'en' => 'An engineer who likes real problems.',
        ],
        'paragraphs' => [
            'id' => [
                'Saya **Mukhamad Roni**, software engineer di Surabaya. Sejak 2023 saya membangun dan merawat sistem untuk banyak departemen di UBS Gold, mulai dari R&D, Human Capital, sampai QMS dan Product Cost Accounting.',
                'Latar belakang saya Teknik Komputer, jadi saya nyaman bergerak dari **query Oracle**, **REST API**, dan **Go**, sampai **machine learning**, **RAG**, dan **mikrokontroler**. Saya juga pernah mengajar C++ selama satu tahun, dan dari situ saya belajar menjelaskan hal teknis dengan sederhana.',
            ],
            'en' => [
                "I'm **Mukhamad Roni**, a software engineer based in Surabaya. Since 2023 I've built and maintained systems for many departments at UBS Gold, from R&D and Human Capital to QMS and Product Cost Accounting.",
                "With a computer engineering background, I'm comfortable moving from **Oracle queries**, **REST APIs**, and **Go** to **machine learning**, **RAG**, and **microcontrollers**. I also taught C++ for a year, which taught me to explain technical things simply.",
            ],
        ],
        'tiles' => [
            ['value' => '{years}+', 'featured' => true, 'label' => ['id' => 'tahun sebagai software engineer', 'en' => 'years as a software engineer']],
            ['value' => '3.60', 'featured' => false, 'label' => ['id' => 'IPK · Teknik Komputer, Universitas Brawijaya', 'en' => 'GPA · Computer Engineering, Universitas Brawijaya']],
            ['value' => '98%', 'featured' => false, 'label' => ['id' => 'akurasi model risiko kredit dari 470 ribu baris data', 'en' => 'credit risk model accuracy on 470K rows of data']],
            ['value' => '7+', 'featured' => false, 'label' => ['id' => 'departemen yang menggunakan sistem buatan saya', 'en' => 'departments using systems I built']],
        ],
    ],

];
