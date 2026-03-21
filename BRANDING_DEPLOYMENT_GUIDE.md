# TraderOS Lite - Branding & Production Deployment Guide

## Logo File Placement & Configuration

### Required Logo Files
Place your logo files in the `public/logo/` directory with the following structure:

```
public/
├── logo/
│   ├── qovavo-traderos-logo.svg          # Main SVG logo (recommended)
│   ├── qovavo-traderos-logo.png          # PNG fallback
│   ├── apple-touch-icon.png              # Apple touch icon (180x180px)
│   ├── icon-192x192.png                  # PWA icon (192x192px)
│   ├── icon-512x512.png                  # PWA icon (512x512px)
│   └── favicon.ico                       # Standard favicon
├── favicon.ico                           # Root favicon fallback
```

### Recommended Logo Formats
1. **Primary Logo (SVG)**: `qovavo-traderos-logo.svg`
   - Vector format for perfect scaling
   - Recommended dimensions: 512x512px viewBox
   - Transparent background
   - Optimized for web (under 50KB)

2. **PNG Fallback**: `qovavo-traderos-logo.png`
   - 512x512px minimum resolution
   - Transparent background
   - Optimized for web (under 100KB)

3. **Favicon**: `favicon.ico`
   - Multiple sizes: 16x16, 32x32, 48x48, 64x64px
   - ICO format for maximum compatibility

4. **Apple Touch Icon**: `apple-touch-icon.png`
   - 180x180px square
   - PNG format with transparent background

5. **PWA Icons**: `icon-192x192.png` and `icon-512x512.png`
   - Square format
   - PNG with transparent background

## Branding Configuration

All branding is centralized in `src/lib/branding.ts`. Update these values:

```typescript
export const BRANDING = {
  companyName: 'Qovavo',
  appName: 'TraderOS',
  supportEmail: 'team@qovavo.com',
  domain: 'traderos.qovavo.com',
  // ... other settings
}
```

## Manual Configuration Steps

### 1. Vercel Configuration
- **Project Name**: `traderos-qovavo`
- **Environment Variables**:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```
- **Custom Domain**: Add `traderos.qovavo.com` in Vercel dashboard
- **Build Settings**: Use default Next.js settings

### 2. Supabase Configuration
- **Project Settings**:
  - Site URL: `https://traderos.qovavo.com`
  - Redirect URLs: 
    - `https://traderos.qovavo.com/auth/callback`
    - `https://traderos.qovavo.com/auth/reset-password`
- **Authentication Settings**:
  - Enable email/password authentication
  - Configure email templates with Qovavo branding
- **Database**: Ensure schema is deployed (use `supabase/schema.sql`)

### 3. Hostinger DNS Configuration
Add these DNS records for `traderos.qovavo.com`:

```
Type: CNAME
Name: traderos
Value: cname.vercel-dns.com
TTL: 3600
```

### 4. Email Configuration (Optional)
For transactional emails, configure Supabase with:
- Custom SMTP settings if needed
- Email templates with Qovavo branding
- Support email: `team@qovavo.com`

## Domain-Readiness Checklist

### ✅ Completed
- [x] Centralized branding configuration
- [x] Logo integration with fallback support
- [x] Support email added to appropriate locations
- [x] Terms/Privacy policy links updated
- [x] Metadata prepared for production domain
- [x] Auth redirect URLs configured for production

### 📋 Manual Steps Required

#### Logo Files to Create:
1. `public/logo/qovavo-traderos-logo.svg` - Main logo
2. `public/logo/qovavo-traderos-logo.png` - PNG fallback
3. `public/logo/apple-touch-icon.png` - Apple touch icon
4. `public/logo/icon-192x192.png` - PWA icon
5. `public/logo/icon-512x512.png` - PWA icon
6. `public/favicon.ico` - Standard favicon

#### Vercel Setup:
1. Create new project on Vercel
2. Connect GitHub repository
3. Add environment variables
4. Configure custom domain `traderos.qovavo.com`

#### Supabase Setup:
1. Update Site URL to production domain
2. Update Redirect URLs for auth callbacks
3. Configure email templates with Qovavo branding
4. Ensure database schema is deployed

#### DNS Setup:
1. Add CNAME record in Hostinger DNS
2. Wait for DNS propagation (up to 24 hours)
3. Verify SSL certificate is issued by Vercel

## Branding Locations Updated

The following locations now use the centralized branding:

1. **Landing Page** (`src/app/page.tsx`):
   - Logo in navigation
   - Company name in hero text
   - Support email in footer
   - Terms/Privacy links

2. **Auth Pages** (`src/app/auth/page.tsx`):
   - Logo display
   - Company name in title
   - Support email in help text
   - Terms/Privacy links

3. **Dashboard Layout** (`src/components/dashboard/DashboardLayout.tsx`):
   - Logo in sidebar
   - Company name in branding
   - Support email in user section

4. **Support Email References**:
   - Added to landing page footer
   - Added to auth page help text
   - Added to dashboard sidebar
   - Configured as `team@qovavo.com`

## Production Checklist

Before going live, ensure:

- [ ] All logo files are created and placed in correct directories
- [ ] Vercel project is created and configured
- [ ] Environment variables are set in Vercel
- [ ] Custom domain is added to Vercel
- [ ] DNS records are configured in Hostinger
- [ ] Supabase redirect URLs are updated
- [ ] Email templates are configured (if using custom SMTP)
- [ ] Terms and Privacy pages are created at qovavo.com
- [ ] SSL certificate is automatically issued by Vercel
- [ ] Test authentication flow on production domain
- [ ] Verify all branding displays correctly

## Post-Deployment

After deployment:
1. Test all functionality on `https://traderos.qovavo.com`
2. Verify logo displays correctly
3. Test authentication flows
4. Check that support email works
5. Monitor for any console errors
6. Set up analytics/monitoring if needed

The application is now ready for production deployment with Qovavo branding!