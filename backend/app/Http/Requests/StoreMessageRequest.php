<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:100'],
            'email' => ['nullable', 'email', 'max:255'],
            'body' => ['required', 'string', 'min:5', 'max:2000'],
            'lang' => ['nullable', 'in:id,en'],
            // Honeypot: real visitors never fill this hidden field.
            'website' => ['prohibited'],
        ];
    }
}
