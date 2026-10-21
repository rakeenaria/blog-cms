<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'          => ['sometimes', 'required', 'string', 'max:255'],
            'body'           => ['sometimes', 'required', 'string'],
            'status'         => ['sometimes', 'required', 'in:draft,published'],
            'categories'     => ['sometimes', 'required', 'array', 'min:1'],
            'categories.*'   => ['integer', 'exists:categories,id'],
            'featured_image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],
        ];
    }
}

