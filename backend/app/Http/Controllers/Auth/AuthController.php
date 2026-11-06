<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => $request->password,
            'role'     => 'author', // Enforce author role for public registration
        ]);

        return response()->json([
            'message' => 'Registration successful.',
            'user'    => $user,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'The provided credentials are incorrect.',
                'errors'  => ['email' => ['The provided credentials are incorrect.']],
            ], 422);
        }

        try {
            if ($request->hasSession()) {
                Auth::guard('web')->login($user);
                $request->session()->regenerate();
            }
        } catch (\Throwable $e) {
            // Fallback if session store is unavailable
        }

        $token = null;
        try {
            $token = $user->createToken('spa_token')->plainTextToken;
        } catch (\Throwable $e) {
            // Fallback if token table is unavailable
        }

        return response()->json([
            'message' => 'Login successful.',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            /** @var User|null $user */
            $user = $request->user();
            if ($user && method_exists($user, 'tokens')) {
                $user->tokens()->delete();
            }
        } catch (\Throwable $e) {
            // Ignore token cleanup errors
        }

        try {
            if ($request->hasSession()) {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }
        } catch (\Throwable $e) {
            // Ignore session cleanup errors
        }

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}
