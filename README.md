# How to Run

## Prerequisites
- Node.js
- pnpm

## Steps to Run the Project
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies using pnpm:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

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

### Example Commit Messages:
- `feat: add user authentication`
- `fix: resolve navbar rendering issue`
- `docs: update README with setup instructions`
