
# How to Run

For the Vercel + Render + Supabase production setup, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Prerequisites

- Docker
- Docker Compose

## Steps to Run the Project

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

   
3. Add envs to each folder
   ```bash
   touch AdminDashboard/.env
   touch Backend/.env
   touch Ecommerce/.env
   ```

3. Just run docker:

   ```bash
   docker compose --profile=dev up --build
   ```

4. Open your browser and navigate to
   - `http://localhost:3001` for the Ecommerce
   - `http://localhost:3000` for the Admin Panel

## Google sign-in setup

1. In Google Cloud Console, configure the OAuth consent screen and create an
   OAuth client with application type **Web application**.
2. Add these **Authorized JavaScript origins** for local development:
   - `http://localhost`
   - `http://localhost:3001`
3. Add the deployed storefront origin as well, for example
   `https://shop.example.com`. Enter origins only—do not include a path.
4. Set the same Web client ID in both environment files:

   ```env
   # Ecommerce/.env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=1234567890-example.apps.googleusercontent.com

   # Backend/.env
   GOOGLE_OAUTH_CLIENT_ID=1234567890-example.apps.googleusercontent.com
   ```

5. Rebuild the frontend after changing `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, then
   restart the backend so its database migration and environment change apply:

   ```bash
   docker compose --profile dev up -d --build backend web-ecommerce-dev
   ```

The popup implementation uses a JavaScript callback, so an Authorized Redirect
URI is not required for this flow.

---

# Docker Commands

## 🚀 Start Services

### Development Mode

**First time or after changing a `Dockerfile`, `package.json`, or `requirements.txt`:**
```bash
docker compose --profile dev up -d --build
```
> Or use the helper script: `./develop.sh`

**Normal startup (uses cached layers — much faster):**
```bash
docker compose --profile dev up -d
```

### Production Mode

**First time or after dependency/Dockerfile changes:**
```bash
docker compose --profile prod up -d --build
```
> Or use the helper script: `./deploy.sh`

**Normal startup:**
```bash
docker compose --profile prod up -d
```

> [!TIP]
> Avoid using `--build` on every run — it forces a full image rebuild and bypasses Docker's layer cache, which is the most common cause of slow build times.

---

## 👀 Live Watch Mode (Recommended for Development)
After the initial build, use `watch` mode instead of `--build`. File changes are automatically synced into containers in real time — **no rebuild needed**.

```bash
# Step 1: Build once
docker compose --profile dev up -d --build

# Step 2: Start watching for changes
docker compose --profile dev watch
```

---

## 🛑 Stop Services

### Stop without removing containers
```bash
docker compose --profile dev stop
docker compose --profile prod stop
```

### Stop and remove containers
```bash
docker compose --profile dev down
docker compose --profile prod down
```
> Or use the helper script to stop both profiles at once: `./down.sh`

---

## 🔨 Rebuild a Specific Service
Rebuild a single service image without restarting everything else.

```bash
# Examples
docker compose --profile dev build backend
docker compose --profile dev build web-ecommerce-dev
docker compose --profile dev build web-admin-dev
```

---

## 📋 View Logs
Stream logs for all services or a specific one.

```bash
# All services
docker compose --profile dev logs -f

# Specific service
docker compose --profile dev logs -f backend
docker compose --profile dev logs -f db
```

---

## 🖥️ Open a Shell Inside a Container
Run an interactive shell inside a running container.

```bash
# Backend container
docker compose --profile dev exec backend bash

# Database (PostgreSQL)
docker compose --profile dev exec db psql -U <db-user> -d <db-name>
```

---

## 🔍 List Running Containers
```bash
docker compose --profile dev ps
docker compose --profile prod ps
```

---

## 🧹 Clean Up (Remove Volumes & Orphans)
> [!CAUTION]
> Using `--volumes` will permanently delete the PostgreSQL database data.

```bash
# Remove containers, networks, and volumes
docker compose --profile dev down --volumes --remove-orphans
docker compose --profile prod down --volumes --remove-orphans
```

---

# Branch Naming Guide

Use the following format for branch names:

- **Feature**: `feature/<short-description>` (e.g., `feature/add-login-page`)
- **Bugfix**: `bugfix/<short-description>` (e.g., `bugfix/fix-header-alignment`)
- **Hotfix**: `hotfix/<short-description>` (e.g., `hotfix/critical-deployment-issue`)
- **Chore**: `chore/<short-description>` (e.g., `chore/update-dependencies`)

---

# Commit Message Guidelines

Follow this structure for commit messages:

1. **Type**: Use one of the following prefixes:
   - `feat`: For new features
   - `fix`: For bug fixes
   - `docs`: For documentation updates
   - `style`: For code style changes (non-functional)
   - `refactor`: For code refactoring
   - `test`: For adding or updating tests
   - `chore`: For maintenance tasks

2. **Message**: Write a concise description of the change.

### Example Commit Messages

- `feat: add user authentication`
- `fix: resolve navbar rendering issue`
- `docs: update README with setup instructions`

# Workflow Guide

## 1. Create a New Branch

Before starting work, create a new branch based on the task:

```bash
git checkout -b <branch-type>/<short-description>
```

Example:

```bash
git checkout -b feature/add-login-page
```

## 2. Make Changes and Commit

1. Stage your changes:

   ```bash
   git add <file-name>  # Or use `git add .` to stage all changes
   ```

2. Commit with a descriptive message:

   ```bash
   git commit -m "type: short description"
   ```

   Example:

   ```bash
   git commit -m "feat: add login functionality"
   ```

## 3. Push the Branch

Push your branch to the remote repository:

```bash
git push origin <branch-name>
```

## 4. Create a Pull Request (PR)

1. Go to your repository on GitHub (or your Git hosting platform).
2. Open the "Pull Requests" tab.
3. Click "New Pull Request."
4. Select your branch and compare it with the `main` branch.
5. Add a title and description, then submit the PR for review.
