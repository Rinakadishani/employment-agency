<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VendiPunesController;

// Public auth routes
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
    Route::post('refresh',  [AuthController::class, 'refresh']);
});

// Protected auth routes
Route::prefix('auth')->middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me',      [AuthController::class, 'me']);
});

// Public job routes
Route::get('vendet-punes',          [VendiPunesController::class, 'index']);
Route::get('vendet-punes/{vendiPunes}', [VendiPunesController::class, 'show']);

// Protected job routes
Route::middleware('auth:api')->group(function () {
    Route::post('vendet-punes',             [VendiPunesController::class, 'store']);
    Route::put('vendet-punes/{vendiPunes}',  [VendiPunesController::class, 'update']);
    Route::delete('vendet-punes/{vendiPunes}', [VendiPunesController::class, 'destroy']);
});