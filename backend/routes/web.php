<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Support\Facades\Route;

// Default API health & welcome endpoint
Route::get('/', function () {
    return response()->json([
        'name'     => 'Jejak Aksara - Backend REST API',
        'status'   => 'Server is running',
        'version'  => app()->version(),
        'frontend' => env('FRONTEND_URL', 'http://localhost:5173'),
        'message'  => 'This backend provides REST APIs for the React frontend application.',
    ]);
});

// SPA Authentication routes (session-based, web middleware)
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
