<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Home'))->name('home');
Route::get('/login', fn () => Inertia::render('Auth/Login'))->name('login');
Route::get('/register', fn () => Inertia::render('Auth/Register'))->name('register');

// Jobs
Route::get('/jobs', fn () => Inertia::render('Jobs/Index'))->name('jobs');
Route::get('/jobs/{id}', fn ($id) => Inertia::render('Jobs/Show', ['id' => $id]))->name('jobs.show');
Route::get('/jobs/{id}/apply', fn ($id) => Inertia::render('Aplikimet/Create', ['vendId' => $id]))->name('jobs.apply');

// Candidates
Route::get('/kandidatet', fn () => Inertia::render('Kandidatet/Index'))->name('kandidatet');
Route::get('/kandidatet/create', fn () => Inertia::render('Kandidatet/Create'))->name('kandidatet.create');
Route::get('/kandidatet/{id}', fn ($id) => Inertia::render('Kandidatet/Show', ['id' => $id]))->name('kandidatet.show');
Route::get('/kandidatet/{id}/edit', fn ($id) => Inertia::render('Kandidatet/Edit', ['id' => $id]))->name('kandidatet.edit');

// Companies
Route::get('/kompanitë', fn () => Inertia::render('Kompanitë/Index'))->name('kompanitë');
Route::get('/kompanitë/create', fn () => Inertia::render('Kompanitë/Create'))->name('kompanitë.create');
Route::get('/kompanitë/{id}', fn ($id) => Inertia::render('Kompanitë/Show', ['id' => $id]))->name('kompanitë.show');

// Applications
Route::get('/aplikimet', fn () => Inertia::render('Aplikimet/Index'))->name('aplikimet');

// Interviews
Route::get('/intervistat', fn () => Inertia::render('Intervistat/Index'))->name('intervistat');
Route::get('/intervistat/create', fn () => Inertia::render('Intervistat/Create'))->name('intervistat.create');
Route::get('/intervistat/{id}/edit', fn ($id) => Inertia::render('Intervistat/Edit', ['id' => $id]))->name('intervistat.edit');

// Offers
Route::get('/ofertat', fn () => Inertia::render('Ofertat/Index'))->name('ofertat');

// Dashboard
Route::get('/dashboard', fn () => Inertia::render('Dashboard/Index'))->name('dashboard');
