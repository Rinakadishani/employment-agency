<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => Inertia::render('Home'))->name('home');
Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Auth/Register'))->name('register');

// Jobs
Route::get('/jobs', fn() => Inertia::render('Jobs/Index'))->name('jobs');
Route::get('/jobs/{id}', fn($id) => Inertia::render('Jobs/Show', ['id' => $id]))->name('jobs.show');
Route::get('/jobs/{id}/apply', fn($id) => Inertia::render('Aplikimet/Create', ['vendId' => $id]))->name('jobs.apply');

// Candidates
Route::get('/kandidatet', fn() => Inertia::render('Kandidatet/Index'))->name('kandidatet');
Route::get('/kandidatet/create', fn() => Inertia::render('Kandidatet/Create'))->name('kandidatet.create');
Route::get('/kandidatet/{id}', fn($id) => Inertia::render('Kandidatet/Show', ['id' => $id]))->name('kandidatet.show');
Route::get('/kandidatet/{id}/edit', fn($id) => Inertia::render('Kandidatet/Edit', ['id' => $id]))->name('kandidatet.edit');

// Companies
Route::get('/kompanitë', fn() => Inertia::render('Kompanitë/Index'))->name('kompanitë');
Route::get('/kompanitë/create', fn() => Inertia::render('Kompanitë/Create'))->name('kompanitë.create');
Route::get('/kompanitë/{id}', fn($id) => Inertia::render('Kompanitë/Show', ['id' => $id]))->name('kompanitë.show');
Route::get('/kompanitë/{id}/edit', fn($id) => Inertia::render('Kompanitë/Edit', ['id' => $id]))->name('kompanitë.edit');

// Applications
Route::get('/aplikimet', fn() => Inertia::render('Aplikimet/Index'))->name('aplikimet');

// Interviews
Route::get('/intervistat', fn() => Inertia::render('Intervistat/Index'))->name('intervistat');
Route::get('/intervistat/create', fn() => Inertia::render('Intervistat/Create'))->name('intervistat.create');
Route::get('/intervistat/{id}/edit', fn($id) => Inertia::render('Intervistat/Edit', ['id' => $id]))->name('intervistat.edit');

// Offers
Route::get('/ofertat', fn() => Inertia::render('Ofertat/Index'))->name('ofertat');

// Admin
Route::get('/admin/users', fn() => Inertia::render('Admin/Users/Index'))->name('admin.users');
Route::get('/admin/users/create', fn() => Inertia::render('Admin/Users/Create'))->name('admin.users.create');
Route::get('/admin/users/{id}/edit', fn($id) => Inertia::render('Admin/Users/Edit', ['id' => $id]))->name('admin.users.edit');
Route::get('/admin/faturat', fn() => Inertia::render('Admin/Faturat/Index'))->name('admin.faturat');
Route::get('/admin/faturat/create', fn() => Inertia::render('Admin/Faturat/Create'))->name('admin.faturat.create');
Route::get('/admin/faturat/{id}/edit', fn($id) => Inertia::render('Admin/Faturat/Edit', ['id' => $id]))->name('admin.faturat.edit');
Route::get('/admin/punonjesit', fn() => Inertia::render('Admin/Punonjesit/Index'))->name('admin.punonjesit');
Route::get('/admin/punonjesit/create', fn() => Inertia::render('Admin/Punonjesit/Create'))->name('admin.punonjesit.create');
Route::get('/admin/punonjesit/{id}/edit', fn($id) => Inertia::render('Admin/Punonjesit/Edit', ['id' => $id]))->name('admin.punonjesit.edit');

// Dashboard
Route::get('/dashboard', fn() => Inertia::render('Dashboard/Index'))->name('dashboard');
Route::get('/aftesite', fn() => Inertia::render('Aftesite/Index'))->name('aftesite');
Route::get('/cvt', fn() => Inertia::render('CV/Index'))->name('cvt');
