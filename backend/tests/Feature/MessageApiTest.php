<?php

namespace Tests\Feature;

use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessageApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_message_is_stored_and_whatsapp_link_returned(): void
    {
        $response = $this->postJson('/api/messages', [
            'body' => 'Halo Roni, ayo kolaborasi.',
            'lang' => 'id',
        ]);

        $response->assertCreated()->assertJsonStructure(['id', 'whatsapp_url']);
        $this->assertStringStartsWith('https://wa.me/6283111735013?text=', $response->json('whatsapp_url'));
        $this->assertDatabaseHas('messages', ['body' => 'Halo Roni, ayo kolaborasi.', 'lang' => 'id']);
    }

    public function test_empty_message_is_rejected(): void
    {
        $this->postJson('/api/messages', ['body' => ''])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('body');

        $this->assertSame(0, Message::count());
    }

    public function test_honeypot_blocks_bots(): void
    {
        $this->postJson('/api/messages', ['body' => 'Buy cheap links now', 'website' => 'spam.example'])
            ->assertUnprocessable();
    }

    public function test_messages_are_rate_limited(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/messages', ['body' => "Pesan nomor {$i}"])->assertCreated();
        }

        $this->postJson('/api/messages', ['body' => 'Pesan keenam'])->assertTooManyRequests();
    }
}
