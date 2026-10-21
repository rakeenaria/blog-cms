<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    // Public
    public function index(): JsonResponse
    {
        $categories = Category::withCount('posts')->orderBy('name')->get();
        return response()->json($categories);
    }

    public function show(Category $category): JsonResponse
    {
        $category->loadCount('posts');
        return response()->json($category);
    }

    // Admin only
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());
        return response()->json($category, 201);
    }

    public function update(StoreCategoryRequest $request, Category $category): JsonResponse
    {
        $category->update($request->validated());
        return response()->json($category);
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully.']);
    }
}

