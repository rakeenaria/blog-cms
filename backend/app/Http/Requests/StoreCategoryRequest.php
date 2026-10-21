<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $category = $this->route('category');
        $categoryId = is_object($category) ? $category->id : $category;

        return [
            'name'        => ['required', 'string', 'max:255', 'unique:categories,name,' . $categoryId],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}

