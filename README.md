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

---

## User Guide & Workflows (Author & Admin)

This section provides a clear step-by-step walkthrough of actions available for Authors and Administrators, with designated placeholders for screenshots.

---

### 1. Author Workflow & Capabilities

Authors are content creators with permission to create and manage their own blog posts.

#### Step 1: Sign In as Author
- Open `http://localhost:5173/login`.
- Input Author credentials: `author1@blog.com` with password `password`.
- Click **Sign In** to authenticate and access the dashboard.

<!-- SCREENSHOT PLACEHOLDER: Author Login -->
> 📸 **Screenshot Placeholder:** *Halaman Login (Login sebagai Author)*  
> `![Author Login](path/ke/screenshot-author-login.png)`

---

#### Step 2: Author Dashboard Overview
- After logging in, the Author Dashboard displays personal statistics: **Total Posts**, **Published Posts**, and **Drafts**.
- Notice the navigation sidebar: Authors only have access to **Dashboard** and **Posts** (the **Users** menu is hidden for Author role).

<!-- SCREENSHOT PLACEHOLDER: Author Dashboard Overview -->
> 📸 **Screenshot Placeholder:** *Tampilan Dashboard Author & Menu Navigasi*  
> `![Author Dashboard](path/ke/screenshot-author-dashboard.png)`

---

#### Step 3: Create a New Blog Post
- Click **Posts** in the sidebar, then click the **+ New Post** button (or go to `http://localhost:5173/dashboard/posts/create`).
- Fill out the form fields:
  - **Title:** Headline of your article.
  - **Category:** Choose the appropriate category for the post.
  - **Featured Image:** Upload an image file (PNG, JPG, WebP).
  - **Content:** Write your article content.
  - **Status:** Select `Draft` (saved privately) or `Published` (immediately visible publicly).
- Click **Save Post** to save.

<!-- SCREENSHOT PLACEHOLDER: Create Post Form -->
> 📸 **Screenshot Placeholder:** *Form Pembuatan Post Baru (Input Judul, Kategori, Gambar, dan Status)*  
> `![Create Post Form](path/ke/screenshot-post-create.png)`

---

#### Step 4: Manage Own Posts (Edit & Delete)
- Go to the **Posts** list (`http://localhost:5173/dashboard/posts`).
- Authors can only view their own posts. Each post shows its title, category, status badge (`Draft` or `Published`), and date.
- **Edit:** Click the edit icon to update content, replace the featured image, or switch status between Draft and Published.
- **Delete:** Click the delete icon with confirmation to remove a post.
- *Authorization Check:* Authors cannot access, edit, or delete posts created by other authors.

<!-- SCREENSHOT PLACEHOLDER: Author Post List -->
> 📸 **Screenshot Placeholder:** *Daftar Post Milik Author beserta Aksi Edit dan Hapus*  
> `![Author Posts List](path/ke/screenshot-author-posts.png)`

---

#### Step 5: Verify Published Post on Homepage
- Open the public homepage at `http://localhost:5173`.
- Verify that posts with status `Published` appear in the article list and can be clicked to read the full detail page.
- Verify that posts with status `Draft` remain hidden from public visitors.

<!-- SCREENSHOT PLACEHOLDER: Public Homepage Verification -->
> 📸 **Screenshot Placeholder:** *Tampilan Homepage Publik (Post yang Terbit Muncul, Draft Tersembunyi)*  
> `![Homepage Articles](path/ke/screenshot-homepage-article.png)`

---

### 2. Admin Workflow & Capabilities

Administrators hold full administrative privileges: managing all posts across all authors, managing categories, and managing user accounts.

#### Step 1: Sign In as Administrator
- Open `http://localhost:5173/login`.
- Input Administrator credentials: `admin@blog.com` with password `password`.
- Click **Sign In**.

<!-- SCREENSHOT PLACEHOLDER: Admin Login -->
> 📸 **Screenshot Placeholder:** *Halaman Login (Login sebagai Admin)*  
> `![Admin Login](path/ke/screenshot-admin-login.png)`

---

#### Step 2: Admin Dashboard Overview
- The Admin Dashboard displays overall system statistics across all authors.
- The sidebar shows the full administrative menu: **Dashboard**, **Posts**, **Categories**, and **Users**.

<!-- SCREENSHOT PLACEHOLDER: Admin Dashboard Overview -->
> 📸 **Screenshot Placeholder:** *Tampilan Dashboard Admin (Statistik Keseluruhan & Menu Lengkap)*  
> `![Admin Dashboard](path/ke/screenshot-admin-dashboard.png)`

---

#### Step 3: Manage All Posts Across All Authors
- Navigate to **Posts** (`http://localhost:5173/dashboard/posts`).
- The Admin posts table displays posts from **all authors** and includes an **Author** column.
- Administrators have permission to edit, change status, or delete any post on the platform.

<!-- SCREENSHOT PLACEHOLDER: Admin All Posts Management -->
> 📸 **Screenshot Placeholder:** *Tabel Semua Post dari Seluruh Author dengan Kolom Penulis*  
> `![Admin All Posts Table](path/ke/screenshot-admin-posts.png)`

---

#### Step 4: Manage Categories (Admin Only)
- Navigate to **Categories** (`http://localhost:5173/dashboard/categories`).
- View all categories along with live post counts.
- **Create Category:** Click **+ New Category**, fill in Name and Description, and save.
- **Edit Category:** Update category name or description.
- **Delete Category:** Remove a category.

<!-- SCREENSHOT PLACEHOLDER: Category Management -->
> 📸 **Screenshot Placeholder:** *Halaman Manajemen Kategori & Form Tambah/Edit Kategori*  
> `![Category Management](path/ke/screenshot-categories.png)`

---

#### Step 5: Manage Users (Admin Only)
- Navigate to **Users** (`http://localhost:5173/dashboard/users`).
- View all registered accounts with their names, emails, roles (`Admin` or `Author`), and joined dates.
- **Add User:** Click **+ New User**, enter user information, and choose their role.
- **Edit User:** Update user details or elevate/demote roles.
- **Delete User:** Delete an account with confirmation.
- *Safety Safeguard:* Administrators cannot delete their own active account, preventing accidental system lockout.

<!-- SCREENSHOT PLACEHOLDER: User Management -->
> 📸 **Screenshot Placeholder:** *Halaman Manajemen Pengguna (Daftar User & Form Tambah/Edit User)*  
> `![User Management](path/ke/screenshot-user-management.png)`
