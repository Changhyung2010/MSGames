# How to Push Code to GitHub Repository

## Repository Information
- **Repository URL:** `https://github.com/Changhyung2010/minesweeper.git`
- **Branch:** `main`
- **Course/Assignment:** 3014-1483

## Quick Steps

### 1. Make sure you're in the project directory
```bash
cd react-minesweeper
```

### 2. Check git status
```bash
git status
```

### 3. Add all changes
```bash
git add .
```

### 4. Commit your changes
```bash
git commit -m "Description of your changes"
```

### 5. Set up remote (if not already done)
```bash
git remote add origin https://github.com/Changhyung2010/minesweeper.git
```

Or if remote already exists:
```bash
git remote set-url origin https://github.com/Changhyung2010/minesweeper.git
```

### 6. Push to GitHub
```bash
git push -u origin main
```

## Authentication

When pushing, you'll need to authenticate:

**Option A: Personal Access Token (Recommended)**
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a new token with `repo` permissions
3. Use your GitHub username and the token as password when prompted

**Option B: SSH**
```bash
git remote set-url origin git@github.com:Changhyung2010/minesweeper.git
git push -u origin main
```

**Option C: GitHub CLI**
```bash
gh auth login
git push -u origin main
```

## Troubleshooting

- **"Repository not found"**: Make sure you have access to the repository
- **"Authentication failed"**: Check your credentials or use a Personal Access Token
- **"Branch not found"**: Make sure you're pushing to `main` branch

## Need Help?

Check the main README.md file for more detailed instructions.

