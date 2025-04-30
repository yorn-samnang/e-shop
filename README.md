
# How to Run

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
