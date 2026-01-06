# DSA Visualizer

A Laravel + Inertia + Vue 3 TypeScript project for visualizing common data structures and algorithms (sorting algorithms, BFS/DFS, etc.). This repository combines a Laravel backend with an Inertia-powered Vue 3 frontend, Vite, and Tailwind CSS.

## Key Technologies

- Backend: Laravel (PHP 8.2+, Laravel 12)
- Frontend: Vue 3, TypeScript, Inertia.js
- Build: Vite
- Styling: Tailwind CSS
- Testing: Pest / PHPUnit

## Features

- Inertia-driven single-page navigation
- Visualizations for algorithms: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, BFS, DFS
- Vue + TypeScript pages under `resources/js/pages`
- Fast dev workflow with Vite and Laravel dev server

## Requirements

- PHP 8.2 or newer
- Composer
- Node.js 18+ and npm (or yarn)
- SQLite, MySQL, or other supported database (SQLite is configured in some scripts)

## Quick Start (Unix)

1. Install PHP dependencies and Node modules, copy env, and generate app key:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run dev
```

## Quick Start (Windows PowerShell)

```powershell
composer install
Copy-Item .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run dev
```

## Building for Production

```bash
npm run build
php artisan migrate --force
```

## Tests

- Run the test suite (Pest/PHPUnit):

```bash
composer test
# or
php artisan test
```

## Project Structure (high level)

- `app/` — Laravel backend code (models, controllers, providers)
- `routes/` — route definitions (see `routes/web.php` for algorithm pages)
- `resources/js/` — front-end entrypoints, pages, components, composables
- `resources/css/` — Tailwind styles
- `database/` — migrations and seeders
- `tests/` — Pest / PHPUnit tests

## Routes / Pages

Primary pages are registered in `routes/web.php`. Example visualizer routes live under `/visualize/*`, e.g. `/visualize/bubble-sort` which renders the `visualize/BubbleSort` Inertia page.

## Contributing

1. Fork and create a feature branch
2. Add tests for new behavior where applicable
3. Open a pull request describing the change
