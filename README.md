# Jejak Aksara - Blog Post CMS

A modern, fully functional Blog Post Content Management System (CMS) featuring a public-facing Homepage and a secure Admin Dashboard.

- **Backend:** Laravel 13 (REST API) with PHP 8.5
- **Frontend:** React 19 + Vite (JavaScript) with Tailwind CSS
- **Authentication:** Laravel Sanctum SPA authentication using secure `HttpOnly` session cookies and automatic CSRF (`XSRF-TOKEN`) protection
- **Database:** MySQL / MariaDB (via XAMPP)

---

## Table of Contents
1. [Project Overview & Architecture](#project-overview--architecture)
2. [Folder Structure](#folder-structure)
3. [Roles & Permissions](#roles--permissions)
4. [Prerequisites](#prerequisites)
5. [Step-by-Step Local Setup](#step-by-step-local-setup)
   - [Database Setup](#1-database-setup)
   - [Backend Setup (Laravel 13)](#2-backend-setup-laravel-13)
   - [Frontend Setup (React + Vite)](#3-frontend-setup-react--vite)
6. [Demo Accounts](#demo-accounts)
7. [API Endpoints Reference](#api-endpoints-reference)
8. [Testing & Verification Guide](#testing--verification-guide)
9. [Security Highlights](#security-highlights)

---

## Project Overview & Architecture

The application is structured into two completely independent directories:
- `backend/`: Headless Laravel REST API responsible for database persistence, server-side validation, Sanctum session management, and authorization policies.
- `frontend/`: Client-side Single Page Application (SPA) built with React and styled with Tailwind CSS, utilizing Axios for seamless credentials-based communication with the API.

```
                      ┌────────────────────────────────┐
                      │    React SPA (Vite :5173)      │
                      │  Public Pages & Admin Panel    │
                      └──────────────┬─────────────────┘
                                     │
           Session Cookies (HttpOnly) & XSRF-TOKEN Headers
                                     │
                      ┌──────────────▼─────────────────┐
                      │    Laravel 13 API (:8000)      │
                      │ Sanctum Guard, Policies & CORS │
                      └──────────────┬─────────────────┘
                                     │
                                     │ PDO MySQL
                                     ▼
                      ┌────────────────────────────────┐
                      │    MySQL / MariaDB (:3306)     │
                      │  Users, Posts, Categories, etc │
                      └────────────────────────────────┘
```

---

## Folder Structure

```
blog-cms/
├── backend/                               # Laravel 13 REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Auth/
│   │   │   │   │   └── AuthController.php # Login, Logout, Register, Me
│   │   │   │   ├── CategoryController.php # Category CRUD
│   │   │   │   ├── PostController.php     # Post CRUD & Public queries
│   │   │   │   └── UserController.php     # Admin User Management
│   │   │   ├── Middleware/
│   │   │   │   └── RoleMiddleware.php     # Admin role verification
│   │   │   └── Requests/                  # Form request validation classes
│   │   ├── Models/
│   │   │   ├── Category.php
│   │   │   ├── Post.php
│   │   │   └── User.php
│   │   └── Policies/
│   │       └── PostPolicy.php             # Author vs Admin post authorization
│   ├── bootstrap/
│   │   └── app.php                        # Middleware & Exception handlers
│   ├── config/
│   │   ├── cors.php                       # SPA CORS with credentials enabled
│   │   └── sanctum.php
│   ├── database/
│   │   ├── migrations/                    # Users, Categories, Posts, Pivots
│   │   └── seeders/                       # Seeders for Users, Categories, Posts
│   ├── routes/
│   │   ├── api.php                        # Resource routes & auth:sanctum
│   │   └── web.php                        # SPA cookie auth (/login, /logout)
│   ├── .env.example
│   └── .gitignore
│
├── frontend/                              # React + Vite Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js                   # Axios client with withCredentials: true
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx             # Public & auth header
│   │   │   │   └── DashboardLayout.jsx    # Sidebar & Dashboard container
│   │   │   ├── PostCard.jsx               # Article preview card
│   │   │   └── ProtectedRoute.jsx         # Client-side route guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx            # Authentication state manager
│   │   ├── pages/
│   │   │   ├── auth/                      # Login & Registration pages
│   │   │   ├── dashboard/                 # Admin/Author Dashboard pages
│   │   │   │   ├── categories/            # Category management
│   │   │   │   ├── posts/                 # Post CRUD
│   │   │   │   └── users/                 # User management (Admin only)
│   │   │   └── public/                    # Homepage & Article Detail
│   │   ├── App.jsx                        # React Router configuration
│   │   ├── index.css                      # Tailwind directives
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── task.txt                               # Assignment brief
└── README.md                              # Setup instructions & documentation
```

---

## Roles & Permissions

| Role | Access Level | Capabilities |
|------|--------------|--------------|
| **Guest / Public** | Unauthenticated | View published posts, read articles, filter by category, search by keywords. |
| **Author** | Authenticated (`author`) | Manage own posts (create, edit, delete, publish/draft), view dashboard stats, view categories. |
| **Admin** | Authenticated (`admin`) | Full control: manage all posts (any author), create/update/delete categories, manage users (create, edit, change roles, delete). Cannot self-delete. |

> **Security Note:** Public registration automatically forces `role = 'author'`. The `role` field cannot be elevated via registration payload. Admin accounts are seeded or created internally by existing Admins.

---

## Prerequisites

Before starting, ensure the following are installed and accessible on your system:
- **PHP 8.5** (or PHP 8.3+) with extensions enabled: `pdo_mysql`, `curl`, `mbstring`, `openssl`, `fileinfo`, `zip`, `xml`, `bcmath`, `exif`.
- **Composer 2.x**
- **Node.js 18+** & **npm**
- **XAMPP** (or MySQL / MariaDB Server running on port 3306)

---

## Step-by-Step Local Setup

### 1. Database Setup
1. Open **XAMPP Control Panel** and click **Start** next to **MySQL**.
2. Open your browser and navigate to phpMyAdmin:
   ```
   http://localhost/phpmyadmin
   ```
3. Create a new database named:
   ```sql
   CREATE DATABASE blog_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
   *(Or click "New" in phpMyAdmin and type `blog_cms` as the database name).*

---

### 2. Backend Setup (Laravel 13)

Open a terminal and navigate to the `backend` directory:

```bash
cd backend
```

1. **Verify Environment File:**
   Copy the example environment configuration:
   ```bash
   cp .env.example .env
   ```
   *If on Windows PowerShell:*
   ```powershell
   Copy-Item .env.example .env
   ```

2. **Configure Database Credentials:**
   Check `.env` to verify your database settings match your local MySQL:
   ```ini
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=blog_cms
   DB_USERNAME=root
   DB_PASSWORD=

   SESSION_DRIVER=file
   SESSION_DOMAIN=null
   SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173,localhost,127.0.0.1
   FRONTEND_URL=http://localhost:5173
   ```

3. **Install Composer Dependencies:**
   ```bash
   composer install
   ```

4. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```

5. **Run Migrations & Seeders:**
   Run migrations and populate sample users, categories, and articles:
   ```bash
   php artisan migrate:fresh --seed
   ```

6. **Create Storage Symbolic Link:**
   Ensures uploaded featured images are accessible publicly:
   ```bash
   php artisan storage:link
   ```

7. **Start the Laravel Development Server:**
   ```bash
   php artisan serve
   ```
   The API will be running at `http://localhost:8000`.

---

### 3. Frontend Setup (React + Vite)

Open a **second terminal** and navigate to the `frontend` directory:

```bash
cd frontend
```

1. **Verify Environment File:**
   ```bash
   cp .env.example .env
   ```
   *If on Windows PowerShell:*
   ```powershell
   Copy-Item .env.example .env
   ```
   Ensure `.env` contains:
   ```ini
   VITE_API_BASE_URL=http://localhost:8000
   ```

2. **Install Node Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Vite Development Server:**
   ```bash
   npm run dev
   ```
   The React SPA will be accessible at:
   ```
   http://localhost:5173
   ```

---

## Demo Accounts

The database seeder automatically provisions demo accounts for testing:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@blog.com` | `password` |
| **Author 1** | `author1@blog.com` | `password` |
| **Author 2** | `author2@blog.com` | `password` |

You can also use the **Register** page on the frontend to create your own author account.

---

## API Endpoints Reference

### Authentication & Session (Web Routes)
| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| `GET` | `/sanctum/csrf-cookie` | Initializes CSRF protection cookie | No |
| `POST` | `/login` | Authenticates user and initiates session | No |
| `POST` | `/logout` | Invalidates current session | Yes |

### Public Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/register` | Register new user (forced `author` role) |
| `GET` | `/api/posts` | Paginated list of published posts (supports `search`, `category`, `page`) |
| `GET` | `/api/posts/{slug}` | View a published article by its slug |
| `GET` | `/api/categories` | List all categories with post counts |
| `GET` | `/api/categories/{id}` | View category details |

### Authenticated Author & Admin Endpoints (`auth:sanctum`)
| Method | Route | Description | Access |
|--------|-------|-------------|--------|
| `GET` | `/api/user` | Current authenticated user profile | Author / Admin |
| `GET` | `/api/admin/posts` | List posts (Author sees own, Admin sees all) | Author / Admin |
| `POST` | `/api/admin/posts` | Create new post (supports image upload) | Author / Admin |
| `GET` | `/api/admin/posts/{id}` | View single post by ID | Author (own) / Admin |
| `POST` / `PUT` | `/api/admin/posts/{id}` | Update post | Author (own) / Admin |
| `DELETE` | `/api/admin/posts/{id}` | Delete post | Author (own) / Admin |

### Admin-Only Endpoints (`role:admin`)
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/admin/categories` | Create new category |
| `PUT` | `/api/admin/categories/{id}` | Update category |
| `DELETE` | `/api/admin/categories/{id}` | Delete category |
| `GET` | `/api/admin/users` | List all users |
| `POST` | `/api/admin/users` | Create new user (can assign role) |
| `GET` | `/api/admin/users/{id}` | View user details |
| `PUT` | `/api/admin/users/{id}` | Update user details & role |
| `DELETE` | `/api/admin/users/{id}` | Delete user (prevents self-delete) |

---

## Testing & Verification Guide

### 1. Public Visitor Flow
1. Open `http://localhost:5173/` without logging in.
2. Confirm only **published** articles appear (drafts are not shown).
3. Test search filter: type a keyword (e.g. "Laravel") and press Search.
4. Test category filter: click any category on the left sidebar to filter posts.
5. Click an article title to open the article detail view. Confirm HTML formatting renders cleanly.

### 2. Author Flow
1. Click **Login** and sign in with `author1@blog.com` / `password`.
2. Notice the dashboard loads showing stats for total, published, and draft posts.
3. Check the sidebar: note that the **Users** menu is hidden for Authors.
4. Go to **Posts** -> click **+ New Post**.
5. Fill in title, body, select category, upload an image, set status to `draft`, and save.
6. Return to homepage `http://localhost:5173/` -> verify that the new draft post is NOT visible to public visitors.
7. Return to Dashboard -> edit the post to `published` -> verify it now displays on the homepage.
8. Verify that Author 1 cannot edit Author 2's posts (server returns 403 Forbidden).

### 3. Admin Flow
1. Sign out and sign in with `admin@blog.com` / `password`.
2. Notice the **Users** link appears in the sidebar.
3. Go to **Posts**: verify you can see posts from all authors with an "Author" column.
4. Go to **Categories**: create a new category (e.g., "Design"), edit, or delete one.
5. Go to **Users**: create a new author, edit user details/roles, or delete accounts (confirm self-delete is prevented).

---

## Security Highlights

1. **HttpOnly Cookie Authentication:** Sessions are stored in browser cookies with `HttpOnly` and `SameSite=Lax` flags, preventing JavaScript access and token theft via XSS.
2. **CSRF Mitigation:** Laravel Sanctum generates an `XSRF-TOKEN` cookie validated on every state-changing HTTP request (`POST`, `PUT`, `DELETE`).
3. **Role Elevation Prevention:** The public registration endpoint discards any `role` parameter sent by the client, hardcoding `role = 'author'`.
4. **Policy-Based Authorization:** Server-side `PostPolicy` inspects ownership before granting write/delete permissions.
5. **XSS Sanitization:** Rendered article content in React is sanitized with `DOMPurify` before insertion into the DOM.
6. **Defense Against Self-Deletion:** Administrators are blocked from deleting their own active account.
7. **Protected Secrets:** All database credentials, APP_KEYs, and sensitive values are excluded from version control via `.gitignore`.

