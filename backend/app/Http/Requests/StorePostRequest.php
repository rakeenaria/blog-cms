<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'          => ['required', 'string', 'max:255'],
            'body'           => ['required', 'string'],
            'status'         => ['required', 'in:draft,published'],
            'categories'     => ['required', 'array', 'min:1'],
            'categories.*'   => ['integer', 'exists:categories,id'],
            'featured_image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
        ];
    }
}

