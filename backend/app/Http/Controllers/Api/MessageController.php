<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMessageRequest;
use App\Models\Message;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    /**
     * Store a contact message. The frontend then opens WhatsApp with the same text,
     * so every message also has a copy in the database.
     */
    public function store(StoreMessageRequest $request): JsonResponse
    {
        $data = $request->validated();

        $message = Message::create([
            'name' => $data['name'] ?? null,
            'email' => $data['email'] ?? null,
            'body' => $data['body'],
            'lang' => $data['lang'] ?? 'id',
            'ip_address' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
        ]);

        return response()->json([
            'id' => $message->id,
            'whatsapp_url' => 'https://wa.me/'.config('portfolio.contact.whatsapp').'?text='.rawurlencode($message->body),
        ], 201);
    }
}
