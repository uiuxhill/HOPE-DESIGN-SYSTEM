#!/bin/bash

# ============================================================
# Push HOPE DESIGN SYSTEM to GitHub
# Repository: uiuxhill/HOPE-DESIGN-SYSTEM
# ============================================================

set -e

REPO_NAME="HOPE-DESIGN-SYSTEM"
GITHUB_USER="uiuxhill"
REMOTE_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "🚀 Setting up HOPE DESIGN SYSTEM for GitHub..."

# Step 1: Configure git user (if not set)
if [ -z "$(git config --global user.name)" ]; then
    git config --global user.name "${GITHUB_USER}"
    echo "✅ Set git user.name to ${GITHUB_USER}"
fi

if [ -z "$(git config --global user.email)" ]; then
    read -p "Enter your GitHub email: " GIT_EMAIL
    git config --global user.email "${GIT_EMAIL}"
    echo "✅ Set git user.email to ${GIT_EMAIL}"
fi

# Step 2: Initialize git repository
if [ ! -d ".git" ]; then
    git init
    echo "✅ Initialized git repository"
else
    echo "ℹ️  Git repository already initialized"
fi

# Step 3: Add all files
git add .
echo "✅ Staged all files"

# Step 4: Create initial commit
git commit -m "🎉 Initial commit - HOPE DESIGN SYSTEM

- Design tokens (colors, spacing, dimensions, typography)
- Figma token exports (light & dark themes)
- Build scripts for token generation
- Tailwind CSS configuration
- Token rules & documentation
- Button demo component"
echo "✅ Created initial commit"

# Step 5: Rename branch to main
git branch -M main
echo "✅ Set branch to main"

# Step 6: Prompt user to create repo on GitHub
echo ""
echo "============================================================"
echo "⚠️  IMPORTANT: Before continuing, create the repository on GitHub:"
echo ""
echo "   1. Go to: https://github.com/new"
echo "   2. Repository name: ${REPO_NAME}"
echo "   3. Description: HOPE Design System - Design tokens & guidelines"
echo "   4. Set to Public or Private (your choice)"
echo "   5. Do NOT initialize with README, .gitignore, or license"
echo "   6. Click 'Create repository'"
echo ""
echo "============================================================"
read -p "Press Enter after creating the repo on GitHub..."

# Step 7: Add remote and push
git remote add origin "${REMOTE_URL}" 2>/dev/null || git remote set-url origin "${REMOTE_URL}"
echo "✅ Set remote origin to ${REMOTE_URL}"

git push -u origin main
echo ""
echo "============================================================"
echo "🎉 Successfully pushed to GitHub!"
echo "   https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo "============================================================"
