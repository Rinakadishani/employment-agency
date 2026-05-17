# Employment Agency Management System

A full-stack web application for managing employment agency operations including candidates, companies, job positions, applications, interviews, and offers.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 12 (PHP 8.2) |
| Frontend | React 18 + Inertia.js |
| Database | MySQL 8+ |
| Auth | JWT (tymon/jwt-auth) |
| Styling | Tailwind CSS v4 |
| Build | Vite 8 |

## Features

- **Authentication & Authorization** — JWT with refresh token rotation, httpOnly cookies, role-based access (Admin, Manager, User)
- **Candidates** — full CRUD, skill management, CV upload
- **Companies** — full CRUD, job position management
- **Job Positions** — full CRUD with filters (location, contract type, salary range)
- **Applications** — apply for positions, track status, withdraw
- **Interviews** — schedule and manage interviews
- **Offers** — send and manage job offers
- **Agency Staff** — manage internal staff, activate/deactivate
- **Invoices** — billing management for companies
- **Admin Dashboard** — stats, charts, recent activity
- **Security** — httpOnly cookies, refresh token rotation, CSRF protection

## Requirements

- PHP 8.2+
- Composer 2+
- Node.js 18+
- MySQL 8+

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/Rinakadishani/employment-agency.git
cd employment-agency
```

### 2. Install PHP dependencies
```bash
composer install
```

### 3. Install JS dependencies
```bash
npm install
```

### 4. Configure environment
```bash
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

### 5. Configure database
Edit `.env`:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=employment_agency
DB_USERNAME=root
DB_PASSWORD=your_password

### 6. Run migrations and seed data
```bash
php artisan migrate:fresh --seed
```

### 7. Run the application
```bash
composer run dev
```

Open `http://localhost:8000`

## Default Admin Account
Email: admin@agency.com
Password: password

## Project Structure
employment-agency/
├── app/
│   ├── Http/Controllers/    # API controllers
│   ├── Http/Middleware/     # JWT + Role middleware
│   └── Models/              # Eloquent models
├── database/
│   ├── migrations/          # All 18+ table migrations
│   └── seeders/             # Database seeders with Faker
├── resources/
│   └── js/
│       ├── Pages/           # React page components
│       ├── Layouts/         # Shared layouts
│       ├── Components/      # Reusable components
│       ├── Contexts/        # React context (Auth)
│       └── utils/           # Axios interceptor
├── routes/
│   ├── api.php              # API routes
│   └── web.php              # Web/Inertia routes
└── docs/                    # API documentation (Postman)

## API Documentation

Import `docs/Employment-Agency-API.postman_collection.json` into Postman to see all available endpoints with example requests and responses.

## Team

- Rina Kadishani
- Trina Marevci

## University

UBT — Lab Course 1, 2025/2026
