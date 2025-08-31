# Netlify Deployment Guide

This guide will help you deploy your Google Business Verification landing page to Netlify.

## Prerequisites

- A Netlify account (free tier is sufficient)
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Automatic Deployment via Git (Recommended)

1. **Connect Your Repository**
   - Log in to your Netlify account
   - Click "New site from Git"
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: `18.x` (set in Environment variables if needed)

3. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your site
   - You'll get a random subdomain like `amazing-cupcake-123456.netlify.app`

### Option 2: Manual Deployment

1. **Build Locally**
   ```bash
   npm install
   npm run build
   ```

2. **Deploy the `out` folder**
   - In Netlify dashboard, go to "Sites"
   - Drag and drop the `out` folder to the deployment area

## Custom Domain Setup

1. In your Netlify site dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain name
4. Follow the DNS configuration instructions

## Environment Variables

If you have any environment variables, add them in:
- Netlify Dashboard → Site Settings → Environment Variables

## Features Included

- ✅ Static site export optimized for Netlify
- ✅ Automatic redirects for client-side routing
- ✅ Security headers configured
- ✅ Cache optimization for static assets
- ✅ Image optimization disabled for static export
- ✅ SEO metadata configured

## Troubleshooting

### Build Fails
- Check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### Images Not Loading
- Ensure all images are in the `public` folder
- Use relative paths starting with `/`

### 404 Errors
- The `netlify.toml` file includes redirects to handle client-side routing
- If you're still getting 404s, check the file paths

## Performance Optimization

The site is already optimized for static deployment with:
- Image optimization disabled (required for static export)
- Trailing slashes configured
- Cache headers for static assets

## Support

For deployment issues, check:
1. Netlify build logs
2. Browser console for errors
3. Network tab for failed requests

## Next Steps

After deployment:
1. Test all functionality
2. Set up custom domain
3. Configure DNS
4. Set up form handling if needed
5. Add analytics tracking
