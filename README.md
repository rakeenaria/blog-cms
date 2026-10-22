# Jejak Aksara - Blog Post CMS

A simple, fully functional Blog Post Content Management System (CMS) featuring a public-facing Homepage and a secure Admin Dashboard.

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

> <img width="2560" height="1392" alt="Screenshot 2026-10-22 030814" src="https://github.com/user-attachments/assets/8eb53a3b-4e83-4ebe-9536-08bac6a838e9" />

---

#### Step 2: Author Dashboard Overview
- After logging in, the Author Dashboard displays personal statistics: **Total Posts**, **Published Posts**, and **Drafts**.
- Notice the navigation sidebar: Authors only have access to **Dashboard** and **Posts** (the **Users** menu is hidden for Author role).

> <img width="2560" height="1392" alt="Screenshot 2026-10-22 030823" src="https://github.com/user-attachments/assets/d717528f-eb98-45a4-9b3a-f245d18965a2" />

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

> <img width="2560" height="1392" alt="Screenshot 2026-10-22 030854" src="https://github.com/user-attachments/assets/3f294072-c8cb-44f5-bb7f-e571d5db1528" />

---

#### Step 4: Manage Own Posts (Edit & Delete)
- Go to the **Posts** list (`http://localhost:5173/dashboard/posts`).
- Authors can only view their own posts. Each post shows its title, category, status badge (`Draft` or `Published`), and date.
- **Edit:** Click the edit icon to update content, replace the featured image, or switch status between Draft and Published.
- **Delete:** Click the delete icon with confirmation to remove a post.
- *Authorization Check:* Authors cannot access, edit, or delete posts created by other authors.

> <img width="2560" height="1392" alt="Screenshot 2026-10-22 030912" src="https://github.com/user-attachments/assets/097aaf27-beac-465e-ace7-3e93008cb897" />

---

#### Step 5: Verify Published Post on Homepage
- Open the public homepage at `http://localhost:5173`.
- Verify that posts with status `Published` appear in the article list and can be clicked to read the full detail page.
- Verify that posts with status `Draft` remain hidden from public visitors.

> <img width="2560" height="1392" alt="Screenshot 2026-10-22 030944" src="https://github.com/user-attachments/assets/850d09af-fa6b-44e3-b4d1-ab372f85b8cf" />

---

### 2. Admin Workflow & Capabilities

Administrators hold full administrative privileges: managing all posts across all authors, managing categories, and managing user accounts.

#### Step 1: Sign In as Administrator
- Open `http://localhost:5173/login`.
- Input Administrator credentials: `admin@blog.com` with password `password`.
- Click **Sign In**.

> <img width="2560" height="1392" alt="Screenshot 2026-10-22 031045" src="https://github.com/user-attachments/assets/685d9183-2454-468f-9696-3b3c3262120f" />

---

#### Step 2: Admin Dashboard Overview
- The Admin Dashboard displays overall system statistics across all authors.
- The sidebar shows the full administrative menu: **Dashboard**, **Posts**, **Categories**, and **Users**.

> <img width="2560" height="1392" alt="Screenshot 2026-10-22 031059" src="https://github.com/user-attachments/assets/19b0d94f-86ff-4f03-a2b5-277aaedd82b0" />

---

#### Step 3: Manage All Posts Across All Authors
- Navigate to **Posts** (`http://localhost:5173/dashboard/posts`).
- The Admin posts table displays posts from **all authors** and includes an **Author** column.
- Administrators have permission to edit, change status, or delete any post on the platform.

> <img width="2560" height="1392" alt="Screenshot 2026-10-22 031134" src="https://github.com/user-attachments/assets/28b418e8-0569-45bc-bed6-389377bcee76" />

---

#### Step 4: Manage Categories (Admin Only)
- Navigate to **Categories** (`http://localhost:5173/dashboard/categories`).
- View all categories along with live post counts.
- **Create Category:** Click **+ New Category**, fill in Name and Description, and save.
- **Edit Category:** Update category name or description.
- **Delete Category:** Remove a category.

> <img width="2560" height="1392" alt="Screenshot 2026-10-22 031148" src="https://github.com/user-attachments/assets/effd3b51-6c0e-4fec-9782-eaafee26457a" />

---

#### Step 5: Manage Users (Admin Only)
- Navigate to **Users** (`http://localhost:5173/dashboard/users`).
- View all registered accounts with their names, emails, roles (`Admin` or `Author`), and joined dates.
- **Add User:** Click **+ New User**, enter user information, and choose their role.
- **Edit User:** Update user details or elevate/demote roles.
- **Delete User:** Delete an account with confirmation.
- *Safety Safeguard:* Administrators cannot delete their own active account, preventing accidental system lockout.

> <img width="2560" height="1392" alt="Screenshot 2026-10-22 031159" src="https://github.com/user-attachments/assets/89434aa3-e336-4ec2-b075-d1f2a29c4c1e" />
