# 🚀 Deployment Guide

This repository is configured with a **CI/CD Pipeline** using GitHub Actions. This guide explains how to connect your repository to a hosting provider and enable automatic deployments.

---

## 1. Recommended Hosting: Render.com

We recommend **Render** because it supports Node.js, offers a free tier, and integrates easily with GitHub.

### Step 1: Create a Service

1.  Sign up at [render.com](https://render.com).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub account and select this repository (`Sammy_Portfolio-Netflix-Theme`).
4.  Configure the service:
    - **Name:** `sammy-portfolio` (or similar)
    - **Runtime:** `Node`
    - **Build Command:** `npm install && npm run build`
    - **Start Command:** `npm start`
5.  Click **Create Web Service**.

### Step 2: Configure Environment Variables

In the Render dashboard for your service, go to **Environment**:

1.  Add `NODE_ENV` = `production`
2.  Add `SMTP_USER` = `(your gmail)`
3.  Add `SMTP_PASS` = `(your app password)`
4.  Add `PORT` = `3000` (Render usually handles this, but good to be safe)

### Step 3: Enable CI/CD Deployment Hook

To let GitHub Actions trigger the deploy _only after tests pass_:

1.  In Render, go to **Settings** > **Deploy Hook**.
2.  Copy the **Deploy Hook URL** (it looks like `https://api.render.com/deploy/srv-xxxxx?key=yyyyy`).
3.  Go to your **GitHub Repository**.
4.  Navigate to **Settings** > **Secrets and variables** > **Actions**.
5.  Click **New repository secret**.
6.  **Name:** `RENDER_DEPLOY_HOOK_URL`
7.  **Value:** (Paste the URL from Render)
8.  Click **Add secret**.

---

## 2. Alternative: Railway.app

1.  Sign up at [railway.app](https://railway.app).
2.  Click **New Project** > **Deploy from GitHub repo**.
3.  Select your repository.
4.  Railway will automatically detect Node.js and deploy.
5.  Go to **Variables** to add your `SMTP_USER` and `SMTP_PASS`.

---

## 3. How the Pipeline Works

1.  **Push to Main:** When you push code, GitHub Actions starts.
2.  **QA Job:** Runs `npm install`, `npm run lint`, and `npm test`.
3.  **Build Job:** Runs `npm run build` and saves the artifacts.
4.  **Deploy Job:**
    - Checks if `RENDER_DEPLOY_HOOK_URL` secret exists.
    - If yes, it triggers Render to pull the latest code and deploy.
    - If no, it skips deployment (but the build is still verified).

---

## ✅ Verification

After setting up the secret:

1.  Make a small change to `README.md`.
2.  Push to GitHub.
3.  Go to the **Actions** tab in GitHub.
4.  Watch the pipeline run: **QA** -> **Build** -> **Deploy**.
