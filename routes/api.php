<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VendiPunesController;
use App\Http\Controllers\KandidatiController;
use App\Http\Controllers\KompaniaController;

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

// Public routes
Route::get('vendet-punes',               [VendiPunesController::class, 'index']);
Route::get('vendet-punes/{vendiPunes}',  [VendiPunesController::class, 'show']);
Route::get('kompanitë',                  [KompaniaController::class, 'index']);
Route::get('kompanitë/{kompania}',       [KompaniaController::class, 'show']);
Route::get('kandidatet',                 [KandidatiController::class, 'index']);
Route::get('kandidatet/{kandidati}',     [KandidatiController::class, 'show']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Job positions
    Route::post('vendet-punes',                    [VendiPunesController::class, 'store']);
    Route::put('vendet-punes/{vendiPunes}',         [VendiPunesController::class, 'update']);
    Route::delete('vendet-punes/{vendiPunes}',      [VendiPunesController::class, 'destroy']);

    // Companies
    Route::get('my-company',                        [KompaniaController::class, 'myCompany']);
    Route::post('kompanitë',                        [KompaniaController::class, 'store']);
    Route::put('kompanitë/{kompania}',              [KompaniaController::class, 'update']);
    Route::delete('kompanitë/{kompania}',           [KompaniaController::class, 'destroy']);

    // Candidates
    Route::get('my-profile',                        [KandidatiController::class, 'myProfile']);
    Route::post('kandidatet',                       [KandidatiController::class, 'store']);
    Route::put('kandidatet/{kandidati}',            [KandidatiController::class, 'update']);
    Route::delete('kandidatet/{kandidati}',         [KandidatiController::class, 'destroy']);
});