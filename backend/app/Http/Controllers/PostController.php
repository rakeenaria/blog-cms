<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    // Public: list published posts
    public function index(Request $request): JsonResponse
    {
        $query = Post::published()->with(['user:id,name', 'categories:id,name,slug']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('body', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category')) {
            $query->whereHas('categories', fn($q) => $q->where('slug', $request->category));
        }

        $posts = $query->latest('published_at')->paginate(9);

        return response()->json($posts);
    }

    // Public: single published post by slug
    public function show(string $slug): JsonResponse
    {
        $post = Post::published()
            ->with(['user:id,name', 'categories:id,name,slug'])
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($post);
    }

    // Admin/Author: list all (admin) or own (author)
    public function adminIndex(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Post::with(['user:id,name', 'categories:id,name,slug']);

        if (! $user->isAdmin()) {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $posts = $query->latest()->paginate(15);

        return response()->json($posts);
    }

    // Admin/Author: view single post
    public function adminShow(Post $post): JsonResponse
    {
        Gate::authorize('view', $post);
        $post->load(['user:id,name', 'categories:id,name,slug']);
        return response()->json($post);
    }

    // Admin/Author: create post
    public function store(StorePostRequest $request): JsonResponse
    {
        $data = $request->validated();
        $categories = $data['categories'];
        unset($data['categories']);

        $data['user_id'] = $request->user()->id;

        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('posts', 'public');
        }

        if (($data['status'] ?? 'draft') === 'published') {
            $data['published_at'] = Carbon::now();
        }

        $post = Post::create($data);
        $post->categories()->sync($categories);
        $post->load(['user:id,name', 'categories:id,name,slug']);

        return response()->json($post, 201);
    }

    // Admin/Author: update post
    public function update(UpdatePostRequest $request, Post $post): JsonResponse
    {
        Gate::authorize('update', $post);

        $data = $request->validated();
        $categories = $data['categories'] ?? null;
        unset($data['categories']);

        if ($request->hasFile('featured_image')) {
            if ($post->featured_image) {
                Storage::disk('public')->delete($post->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')->store('posts', 'public');
        }

        if (isset($data['status']) && $data['status'] === 'published' && $post->status !== 'published') {
            $data['published_at'] = Carbon::now();
        } elseif (isset($data['status']) && $data['status'] === 'draft') {
            $data['published_at'] = null;
        }

        $post->update($data);

        if ($categories !== null) {
            $post->categories()->sync($categories);
        }

        $post->load(['user:id,name', 'categories:id,name,slug']);

        return response()->json($post);
    }

    // Admin/Author: delete post
    public function destroy(Post $post): JsonResponse
    {
        Gate::authorize('delete', $post);

        if ($post->featured_image) {
            Storage::disk('public')->delete($post->featured_image);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully.']);
    }
}

