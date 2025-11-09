# Deployment Guide

## GitHub Pages Setup

### Prerequisites

- GitHub repository created
- Code pushed to repository
- Repository is public (or GitHub Pro for private repos)

### Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (in left sidebar)
3. Under **Source**, select:
   - Source: **GitHub Actions**
4. Save the settings

### First Deployment

The GitHub Actions workflow will automatically run when you push to `main` or `master` branch:

```bash
# Ensure you're on main/master branch
git checkout main

# Push your code
git push origin main
```

The workflow will:
1. ✅ Install dependencies
2. ✅ Run type checking
3. ✅ Build the project
4. ✅ Deploy to GitHub Pages

### View Your Game

After deployment completes (1-2 minutes), your game will be live at:

```
https://[your-username].github.io/foodrooguelike/
```

Example: `https://gzatravkin.github.io/foodrooguelike/`

### Check Deployment Status

1. Go to **Actions** tab in GitHub
2. Click on the latest workflow run
3. View build and deploy logs
4. Look for the deployment URL in the output

### Manual Deployment

You can trigger a manual deployment:

1. Go to **Actions** tab
2. Select "Deploy to GitHub Pages" workflow
3. Click **Run workflow**
4. Select branch and click **Run workflow**

## Local Testing

Test production build locally before deploying:

```bash
# Build with GitHub Pages base path
GITHUB_PAGES=true npm run build

# Preview the build
npm run preview

# Visit http://localhost:4173/foodrooguelike/
```

## Development vs Production

The `vite.config.ts` automatically handles the base path:

- **Development** (`npm run dev`): Base path is `/`
- **Production** (GitHub Pages): Base path is `/foodrooguelike/`

This is controlled by the `GITHUB_PAGES` environment variable.

## Continuous Integration

The repository has two workflows:

### 1. Deploy to GitHub Pages (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` or `master`
- Manual trigger via workflow_dispatch

**Steps:**
- Install dependencies
- Type check
- Build with GitHub Pages base path
- Deploy to GitHub Pages

### 2. Test Build (`.github/workflows/test.yml`)

**Triggers:**
- Pull requests to `main` or `master`
- Push to feature branches

**Steps:**
- Install dependencies
- Type check
- Build
- Verify output

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to `/public/` folder:
   ```
   yourdomain.com
   ```

2. Configure DNS at your domain provider:
   ```
   Type: CNAME
   Name: @
   Value: [your-username].github.io
   ```

3. In GitHub Settings → Pages → Custom domain:
   - Enter your domain
   - Check "Enforce HTTPS"

4. Update `vite.config.ts`:
   ```typescript
   base: process.env.GITHUB_PAGES === 'true' ? '/' : '/',
   ```

## Troubleshooting

### Blank Page After Deployment

**Issue**: Page loads but is blank

**Solution**: Check browser console for 404 errors. Likely cause:
- Base path not set correctly
- Forgot to set `GITHUB_PAGES=true` during build

**Fix**: Ensure workflow has:
```yaml
- name: Build
  run: npm run build
  env:
    GITHUB_PAGES: 'true'
```

### 404 on Assets

**Issue**: CSS/JS files return 404

**Solution**: Verify `base` in `vite.config.ts`:
```typescript
base: process.env.GITHUB_PAGES === 'true' ? '/foodrooguelike/' : '/'
```

Replace `foodrooguelike` with your repository name.

### Build Fails in GitHub Actions

**Issue**: Workflow fails during build

**Solution**:
1. Check **Actions** tab for error logs
2. Run locally: `npm run type-check && npm run build`
3. Fix TypeScript errors
4. Commit and push fixes

### Game Works Locally But Not on GitHub Pages

**Issue**: Works in dev mode but not in production

**Solution**:
1. Test production build locally:
   ```bash
   GITHUB_PAGES=true npm run build
   npm run preview
   ```
2. Visit `http://localhost:4173/foodrooguelike/`
3. Check browser console for errors
4. Fix issues and redeploy

## Alternative Deployment Options

### Netlify

1. Connect your GitHub repo to Netlify
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy!

No need for `GITHUB_PAGES` env var on Netlify.

### Vercel

1. Import your GitHub repo to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy!

### Self-Hosted

```bash
# Build
npm run build

# Upload dist/ folder to your web server
# Serve with any static file server (nginx, Apache, etc.)
```

## Environment Variables

You can add environment variables for different environments:

**Local Development:**
```bash
# .env.development
VITE_API_URL=http://localhost:3000
```

**Production:**
```bash
# .env.production
VITE_API_URL=https://api.yourdomain.com
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Build Optimization

For production builds, Vite automatically:
- ✅ Minifies code
- ✅ Tree-shakes unused code
- ✅ Code splits
- ✅ Optimizes assets
- ✅ Generates source maps

## Monitoring Deployments

GitHub Actions sends notifications:
- Email on workflow failure
- GitHub notifications tab

Configure in: **Settings → Notifications → Actions**

## Rolling Back

To rollback a deployment:

1. Find the commit before the issue
2. Reset to that commit:
   ```bash
   git reset --hard <commit-hash>
   git push --force
   ```

Or create a revert commit:
```bash
git revert <bad-commit-hash>
git push
```

The workflow will automatically redeploy.

## Production Checklist

Before deploying to production:

- [ ] Run `npm run type-check` - No TypeScript errors
- [ ] Run `npm run build` - Build succeeds
- [ ] Test locally with `npm run preview`
- [ ] Check all screens work (Base, Expedition, Cooking, Shop)
- [ ] Test on mobile (Chrome DevTools device mode)
- [ ] Verify game data loads correctly
- [ ] Check browser console for errors
- [ ] Test combat, cooking, shopping
- [ ] Verify GitHub Actions workflow is enabled
- [ ] Commit and push to main branch
- [ ] Monitor deployment in Actions tab
- [ ] Verify live site works
- [ ] Test on actual mobile device

## Support

If you encounter issues:

1. Check [Vite deployment docs](https://vitejs.dev/guide/static-deploy.html)
2. Check [GitHub Pages docs](https://docs.github.com/en/pages)
3. Review workflow logs in Actions tab
4. Open an issue in the repository

Happy deploying! 🚀
