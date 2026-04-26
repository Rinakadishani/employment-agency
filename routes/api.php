<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VendiPunesController;
use App\Http\Controllers\KandidatiController;
use App\Http\Controllers\KompaniaController;
use App\Http\Controllers\AplimiController;
use App\Http\Controllers\IntervistController;
use App\Http\Controllers\OfertaController;
use App\Http\Controllers\PunonjesiAgjenciseController;
use App\Http\Controllers\FaturaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;

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
Route::get('vendet-punes',              [VendiPunesController::class, 'index']);
Route::get('vendet-punes/{vendiPunes}', [VendiPunesController::class, 'show']);
Route::get('kompanitë',                 [KompaniaController::class, 'index']);
Route::get('kompanitë/{kompania}',      [KompaniaController::class, 'show']);
Route::get('kandidatet',                [KandidatiController::class, 'index']);
Route::get('kandidatet/{kandidati}',    [KandidatiController::class, 'show']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Job positions
    Route::post('vendet-punes',                [VendiPunesController::class, 'store']);
    Route::put('vendet-punes/{vendiPunes}',    [VendiPunesController::class, 'update']);
    Route::delete('vendet-punes/{vendiPunes}', [VendiPunesController::class, 'destroy']);

    // Companies
    Route::get('my-company',                   [KompaniaController::class, 'myCompany']);
    Route::post('kompanitë',                   [KompaniaController::class, 'store']);
    Route::put('kompanitë/{kompania}',         [KompaniaController::class, 'update']);
    Route::delete('kompanitë/{kompania}',      [KompaniaController::class, 'destroy']);

    // Candidates
    Route::get('my-profile',                   [KandidatiController::class, 'myProfile']);
    Route::post('kandidatet',                  [KandidatiController::class, 'store']);
    Route::put('kandidatet/{kandidati}',       [KandidatiController::class, 'update']);
    Route::delete('kandidatet/{kandidati}',    [KandidatiController::class, 'destroy']);

    // Applications
    Route::get('aplikimet',                    [AplimiController::class, 'index']);
    Route::get('aplikimet/all',                [AplimiController::class, 'allApplications']);
    Route::post('aplikimet',                   [AplimiController::class, 'store']);
    Route::get('aplikimet/{aplikimi}',         [AplimiController::class, 'show']);
    Route::put('aplikimet/{aplikimi}',         [AplimiController::class, 'update']);
    Route::delete('aplikimet/{aplikimi}',      [AplimiController::class, 'destroy']);

    // Interviews
    Route::get('intervistat',                  [IntervistController::class, 'index']);
    Route::post('intervistat',                 [IntervistController::class, 'store']);
    Route::get('intervistat/{intervista}',     [IntervistController::class, 'show']);
    Route::put('intervistat/{intervista}',     [IntervistController::class, 'update']);
    Route::delete('intervistat/{intervista}',  [IntervistController::class, 'destroy']);

    // Offers
    Route::get('ofertat',                      [OfertaController::class, 'index']);
    Route::post('ofertat',                     [OfertaController::class, 'store']);
    Route::get('ofertat/{oferta}',             [OfertaController::class, 'show']);
    Route::put('ofertat/{oferta}',             [OfertaController::class, 'update']);
    Route::delete('ofertat/{oferta}',          [OfertaController::class, 'destroy']);

    // Staff — admin only
    Route::get('punonjesit',                            [PunonjesiAgjenciseController::class, 'index']);
    Route::post('punonjesit',                           [PunonjesiAgjenciseController::class, 'store']);
    Route::get('punonjesit/{punonjesiAgjencise}',       [PunonjesiAgjenciseController::class, 'show']);
    Route::put('punonjesit/{punonjesiAgjencise}',       [PunonjesiAgjenciseController::class, 'update']);
    Route::delete('punonjesit/{punonjesiAgjencise}',    [PunonjesiAgjenciseController::class, 'destroy']);
    Route::patch('punonjesit/{punonjesiAgjencise}/toggle', [PunonjesiAgjenciseController::class, 'toggleActive']);

    // Invoices — admin only
    Route::get('faturat',              [FaturaController::class, 'index']);
    Route::post('faturat',             [FaturaController::class, 'store']);
    Route::get('faturat/{fatura}',     [FaturaController::class, 'show']);
    Route::put('faturat/{fatura}',     [FaturaController::class, 'update']);
    Route::delete('faturat/{fatura}',  [FaturaController::class, 'destroy']);

    // Users — admin only
    Route::get('users',                        [UserController::class, 'index']);
    Route::post('users',                       [UserController::class, 'store']);
    Route::get('users/{user}',                 [UserController::class, 'show']);
    Route::put('users/{user}',                 [UserController::class, 'update']);
    Route::delete('users/{user}',              [UserController::class, 'destroy']);
    Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus']);
    Route::post('users/{user}/assign-role',    [UserController::class, 'assignRole']);
    Route::post('users/{user}/remove-role',    [UserController::class, 'removeRole']);

    // Roles — admin only
    Route::get('roles',          [RoleController::class, 'index']);
    Route::post('roles',         [RoleController::class, 'store']);
    Route::put('roles/{role}',   [RoleController::class, 'update']);
    Route::delete('roles/{role}',[RoleController::class, 'destroy']);
});