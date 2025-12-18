# Minesweeper & Snake Games

A modern React + TypeScript web application featuring two classic games: Minesweeper and Snake, with a beautiful Google-style UI and smooth animations.

## 🎮 Games

- **Minesweeper**: Classic minesweeper game with modern UI, smooth animations, and intuitive controls
- **Snake**: Classic snake game with keyboard controls and on-screen buttons for mobile

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build
```

### Preview Production Build

```bash
# Preview the production build
npm run preview
```

## 📦 Pushing Code to GitHub Repository

**Repository URL:** `https://github.com/Changhyung2010/minesweeper.git`

### First Time Setup

1. **Check if remote is configured:**
   ```bash
   git remote -v
   ```

2. **If remote is not set, add it:**
   ```bash
   git remote add origin https://github.com/Changhyung2010/minesweeper.git
   ```

3. **If remote exists but points to wrong URL, update it:**
   ```bash
   git remote set-url origin https://github.com/Changhyung2010/minesweeper.git
   ```

### Pushing Your Code

1. **Stage all changes:**
   ```bash
   git add .
   ```

2. **Commit your changes:**
   ```bash
   git commit -m "Your commit message describing the changes"
   ```

3. **Push to GitHub:**
   ```bash
   git push -u origin main
   ```

   **Note:** You'll need to authenticate:
   - If using HTTPS: Use your GitHub username and a [Personal Access Token](https://github.com/settings/tokens) as the password
   - If using SSH: Make sure your SSH keys are set up with GitHub

### Alternative: Using SSH

If you prefer SSH (and have SSH keys configured):

```bash
# Change remote URL to SSH
git remote set-url origin git@github.com:Changhyung2010/minesweeper.git

# Push
git push -u origin main
```

### Using GitHub CLI

If you have GitHub CLI installed:

```bash
# Authenticate
gh auth login

# Push
git push -u origin main
```

## 🎯 Course Assignment: 3014-1483

**Instructions for pushing code:**

1. Make sure all your changes are committed locally
2. Push to the repository: `https://github.com/Changhyung2010/minesweeper.git`
3. Use the branch: `main`
4. Ensure your commit messages are clear and descriptive

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with animations

## 📁 Project Structure

```
src/
├── minesweeper/     # Minesweeper game
│   ├── game.ts              # Game logic
│   ├── useMinesweeper.ts    # React hook
│   ├── MinesweeperGame.tsx  # UI component
│   └── minesweeper.css      # Styles
├── snake/           # Snake game
│   ├── game.ts              # Game logic
│   ├── useSnake.ts          # React hook
│   ├── SnakeGame.tsx        # UI component
│   └── snake.css            # Styles
├── App.tsx          # Main app with game switcher
└── main.tsx         # Entry point
```

## 🎨 Features

- Modern, Google-inspired UI design
- Smooth animations and transitions
- Responsive design
- Keyboard controls for Snake game
- Game state management
- Score tracking

## 📝 License

This project is open source and available for educational purposes.
