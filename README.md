# Jejak Aksara - Blog Post CMS

A simple, fully functional Blog Post Content Management System (CMS) featuring a public-facing Homepage and a secure Admin Dashboard.

Built to fulfill the assignment requirements specified in `task.txt`:
- **Multi-User System:** Role-based access control for Administrators and Authors, plus public visitor access.
- **Post Management:** Full CRUD capabilities for blog posts with status control (Draft & Published) and featured image upload.
- **Post Category:** Category management and assignment to blog posts.
- **Admin Dashboard:** Backend interface to manage users, posts, and categories.
- **Public Homepage:** Responsive frontend displaying published posts with search and category filters.

---

## Tech Stack

- **Backend:** Laravel 13 (REST API) with PHP 8.5
- **Frontend:** React 19 + Vite (JavaScript) with Tailwind CSS
- **Authentication:** Laravel Sanctum SPA session authentication (HttpOnly cookies & CSRF protection)
- **Database:** MySQL / MariaDB (via XAMPP)

---

## Prerequisites

Before setting up the project locally, ensure you have the following installed:
- **PHP 8.2+** (PHP 8.5 recommended) with extensions: `pdo_mysql`, `mbstring`, `openssl`, `curl`, `fileinfo`
- **Composer 2.x**
- **Node.js 18+** & **npm**
- **XAMPP** (with MySQL service running on port 3306)

---

## Step-by-Step Local Setup Guide

Follow these steps in sequential order to install and run the project locally.

### Step 1: Database Setup
1. Open the **XAMPP Control Panel** and click **Start** next to **MySQL**.
2. Open your browser and navigate to **phpMyAdmin** at `http://localhost/phpmyadmin`.
3. Create a new database named `blog_cms`:
   ```sql
   CREATE DATABASE blog_cms;
   ```
   *(Or click **New** in phpMyAdmin, enter `blog_cms` as database name, and click **Create**)*.

---

### Step 2: Backend Setup (Laravel 13)

Open your terminal, navigate to the `backend` folder:
```bash
cd backend
```

1. **Copy the Environment File:**
   - On Windows Command Prompt (CMD):
     ```cmd
     copy .env.example .env
     ```
   - On Windows PowerShell:
     ```powershell
     Copy-Item .env.example .env
     ```
   - On Linux / macOS / Git Bash:
     ```bash
     cp .env.example .env
     ```

2. **Verify Database Configuration:**
   Open `.env` and verify that the database credentials match your local MySQL configuration:
   ```ini
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=blog_cms
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   *(Note: Default XAMPP has no password for `root`. If your MySQL installation uses a password, enter it in `DB_PASSWORD`)*.

3. **Install Backend Dependencies:**
   ```bash
   composer install
   ```

4. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

5. **Run Migrations & Seed Sample Data:**
   This creates all required database tables and populates sample users, categories, and articles:
   ```bash
   php artisan migrate:fresh --seed
   ```

6. **Create Storage Symbolic Link:**
   Ensures uploaded featured images are publicly accessible:
   ```bash
   php artisan storage:link
   ```
   *(Note: If the link already exists, you can safely skip this step)*.

7. **Start the Laravel Backend Server:**
   ```bash
   php artisan serve
   ```
   The API server will run at `http://localhost:8000`.
   > **Important:** Keep this terminal open and running. Do not close it.

---

### Step 3: Frontend Setup (React + Vite)

Open a **new / separate terminal window** and navigate to the `frontend` folder:
```bash
cd frontend
```

1. **Copy the Environment File:**
   - On Windows Command Prompt (CMD):
     ```cmd
     copy .env.example .env
     ```
   - On Windows PowerShell:
     ```powershell
     Copy-Item .env.example .env
     ```
   - On Linux / macOS / Git Bash:
     ```bash
     cp .env.example .env
     ```
   *(The file is pre-configured with `VITE_API_BASE_URL=http://localhost:8000`)*.

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Frontend Development Server:**
   ```bash
   npm run dev
   ```
   The React application is now running and can be accessed at:
   ```
   http://localhost:5173
   ```

---

## Demo Accounts

The database seeder provisions the following accounts for evaluation:

| Role | Email | Password | Access Rights |
|------|-------|----------|---------------|
| **Admin** | `admin@blog.com` | `password` | Full access: manage all posts, manage categories, manage users |
| **Author** | `author1@blog.com` | `password` | Manage own posts only (create, edit, delete, draft/publish) |
| **Author** | `author2@blog.com` | `password` | Manage own posts only |

> **Note:** Public visitors can also create an account using the **Register** page at `http://localhost:5173/register`. All newly registered users are automatically assigned the `Author` role.

---

## Application URLs

- **Public Homepage:** [http://localhost:5173](http://localhost:5173) (Browse published articles, search keywords, filter by category)
- **Login Page:** [http://localhost:5173/login](http://localhost:5173/login)
- **Dashboard:** [http://localhost:5173/dashboard](http://localhost:5173/dashboard) (Post, Category, and User management)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
