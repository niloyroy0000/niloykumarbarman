# Niloy Kumar Barman - Portfolio Website

A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS, featuring glassmorphism design, smooth animations, and comprehensive image optimization.

## 🚀 Features

- **Modern Design**: Clean, professional layout with glassmorphism effects
- **Responsive**: Optimized for all device sizes
- **Performance**: Optimized animations, lazy loading, and image optimization
- **Dynamic Content**: Centralized data management
- **Search & Filter**: Advanced search and filtering capabilities (configurable)
- **Contact Form**: Functional form with validation and email notifications
- **Accessibility**: ARIA compliant and keyboard navigation
- **SEO Optimized**: Meta tags and structured data
- **Image Optimization**: Unified workflow for WebP conversion, thumbnails, and profile optimization
- **AI Chatbot Assistant**: 24/7 recruiter support powered by Google Gemini AI ✨
  - Interactive chat UI with suggested questions
  - Answers questions about projects, skills, and experience
  - Conversation analytics with feedback system
  - Deployed on Vercel serverless functions
- **Medium Blog Integration**: Real-time blog posts from Medium ✨ NEW
  - API-first architecture (no rebuild required for new posts)
  - Automatic daily sync from Medium RSS feed
  - Displays 3 most recent articles on homepage
  - Fallback to static JSON on API failure
  - Managed via portfolio-admin panel
- **Analytics & Insights**:
  - **Heatmap Analytics**: Track user interactions, clicks, hovers, scroll depth, and section engagement
  - **Skills Heat Map**: Interactive color-coded visualization with proficiency level filtering ✨ ENHANCED
  - **Activity Graph**: GitHub-style contribution graph showing portfolio development activity
  - **Performance Metrics**: Real-time Core Web Vitals and Lighthouse scores dashboard
  - **Resume Analytics**: Track resume downloads with context (time on page, referrer)

## 🔧 Available Scripts

```bash
npm run dev       # Development server
npm run build     # Production build (auto-generates sitemap)
npm run start     # Production server
npm run lint      # Code linting
npm run analyze   # Bundle analysis
npm run optimize  # Complete image optimization (profile, WebP, thumbnails)
npm run sitemap   # Generate sitemap.xml for SEO
```

## 🖼️ Image Optimization

### Unified Optimization Workflow

Run the complete image optimization process:

```bash
npm run optimize
```

This command performs the following operations in sequence:

1. **Profile Image Optimization**
   - Automatically detects profile images in `/public/assets/`
   - Creates multiple optimized sizes (large, medium, small, thumbnail)
   - Generates both WebP and PNG versions for compatibility

2. **WebP Conversion**
   - Converts all PNG/JPG images to WebP format across all directories
   - Uses dynamic quality settings based on file size
   - Skips already optimized files to save time

3. **Thumbnail Generation**
   - Automatically detects directories with `thumbnails` folders
   - Creates WebP thumbnails (400px width) for all images
   - Maintains aspect ratio and prevents upscaling

4. **Interactive Source File Cleanup**
   - Lists all original source files that can be deleted
   - Shows file sizes and potential space savings
   - **Asks for user permission before deletion (Y/N prompt)**
   - Only deletes files if user confirms

### Optimization Benefits
- **40-95% smaller image files** through WebP conversion
- **Comprehensive optimization** in a single command
- **Safe deletion** with user confirmation
- **Smart skipping** of already optimized files

### Example Output
```
🚀 === IMAGE OPTIMIZATION STARTED ===
🖼️  === STEP 1: Optimizing Profile Images ===
📸 Found profile image: photo.png
✅ Created large (600px): WebP: 25KB, PNG: 79KB

🔄 === STEP 2: Converting Images to WebP ===
✅ SpireWiz.png → SpireWiz.webp (47% smaller)

🖼️  === STEP 3: Generating Thumbnails ===
✅ Created thumbnail: SpireWiz.webp

🗑️  === STEP 4: Source File Cleanup ===
❓ Do you want to delete these source files? (Y/N): Y

🎉 === OPTIMIZATION COMPLETE ===
📊 Summary: 25 files optimized, 1.2MB saved
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Form Validation**: Zod schema validation
- **Icons**: React Icons
- **Deployment**: GitHub Pages
- **Image Optimization**: Sharp, WebP conversion

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (pages)/           # Page routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
├── data/                  # Centralized data files
├── constants/             # App constants
├── scripts/               # Utility scripts
│   └── optimize-images.js # Unified image optimization
├── utils/                 # Utility functions
└── public/                # Static assets
    └── assets/            # Images and other media
        ├── certificates/  # Certificate images
        │   ├── thumbnails/# Certificate thumbnails (WebP)
        │   └── webp/      # WebP versions of certificates
        ├── portfolio/     # Projects images
        │   ├── thumbnails/# Project thumbnails (WebP)
        │   └── webp/      # WebP versions of projects
        └── profile/       # Profile images in various sizes/formats
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/biswajitpanday/biswajitpanday.github.io.git
cd biswajitpanday.github.io

# 2. Install dependencies
npm install

# 3. Set up environment variables (optional)
echo "NEXT_PUBLIC_ENABLE_SEARCH=true" > .env.local
echo "NEXT_PUBLIC_ENABLE_FILTER=true" >> .env.local
echo "NEXT_PUBLIC_PAGECLIP_API_KEY=your-api-key" >> .env.local

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000 in your browser
```

### Production Build

```bash
# Build for production
npm run build

# Start production server (optional)
npm run start
```

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_ENABLE_SEARCH` | Enable global search functionality | No | `true` |
| `NEXT_PUBLIC_ENABLE_FILTER` | Enable filter functionality | No | `true` |
| `NEXT_PUBLIC_PAGECLIP_API_KEY` | Contact form service key | No | - |
| `NEXT_PUBLIC_API_BASE_URL` | Portfolio admin API URL for blog posts | No | `https://portfolio-admin-blue.vercel.app` |
| `NEXT_PUBLIC_CHATBOT_API_URL` | AI chatbot API endpoint | No | - |

## 📦 Deployment

### GitHub Pages (Recommended)

1. **Repository Settings**
   - Go to Settings → Pages
   - Source: GitHub Actions

2. **Environment Variables** (if using contact form)
   - Settings → Secrets and Variables → Actions
   - Add `NEXT_PUBLIC_PAGECLIP_API_KEY` if needed

3. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy updates"
   git push origin main
   ```

### Alternative Platforms

**Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Netlify:**
1. Connect repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `out`

## 🎨 Key Features & Pages

### Pages
- **Home**: Hero section with animated elements and statistics
- **Projects**: Project showcase with search and filtering
- **Skills**: Technical skills with proficiency indicators
- **Career**: Professional timeline with company details
- **Certifications**: Professional certifications showcase
- **Performance**: Real-time Core Web Vitals and Lighthouse scores
- **Analytics**: Interactive heatmap showing user engagement patterns
- **Skills HeatMap**: Color-coded visualization of technical proficiency
- **Activity**: GitHub-style contribution graph of portfolio development
- **Contact**: Functional form with validation and email notifications

### Design Features
- **Glassmorphism**: Modern glass-like UI elements
- **Gradient Animations**: Smooth color transitions
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Dark Theme**: Professional dark color scheme
- **Micro-interactions**: Subtle hover and focus effects

### Performance Optimizations
- **Image Optimization**: Automatic thumbnail generation and WebP conversion
- **Synchronized Animations**: Reduced animation times from 0.8s to 0.4s
- **Debounced Search**: 300ms debounce for search inputs
- **Memoized Calculations**: useMemo for expensive filter operations
- **Bundle Optimization**: Dynamic imports and code splitting
- **Hardware Acceleration**: CSS transforms for smooth animations
- **Static Export**: Fast loading static sites

### Feature Control Performance Impact
- **Disabling Search**: Saves ~70KB runtime memory, ~300ms faster TTI
- **Disabling Filters**: 15-20% faster initial render on projects page
- **Both Disabled**: Optimal performance for static projects viewing

### Analytics Console Utilities
The portfolio includes global browser console functions for analytics:

**Heatmap Analytics:**
```javascript
getHeatmapStats()      // View detailed interaction analytics
exportHeatmapData()    // Download analytics as JSON
clearHeatmapData()     // Clear all heatmap data
```

**Resume Download Analytics:**
```javascript
getResumeDownloadStats()  // View resume download statistics
exportResumeDownloads()   // Export download data as JSON
clearResumeDownloads()    // Clear resume download data
```

These functions are automatically available in the browser console on all pages.

## 🐛 Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear cache and rebuild
rm -rf .next
npm install
npm run build
```

**Form Issues:**
- Verify environment variables are set
- Check browser console for errors
- Test in production environment

**Image Optimization Issues:**
```bash
# Ensure Sharp is installed
npm install sharp

# Run optimization
npm run optimize
```

**Console Warnings:**
- **Preload warnings**: Removed unnecessary image preloads from layout.tsx
- **Image aspect ratio**: Added proper width/height styles to Image components
- **Resume 404**: Changed from Next.js Link to native anchor tag for PDF downloads

**Deployment Issues:**
- Check GitHub Actions logs
- Verify environment variables in repository secrets
- Ensure proper repository permissions

## 🔍 SEO Setup

### 1. Google Search Console
1. Go to [Google Search Console](https://search.google.com)
2. Add your property (https://biswajitpanday.github.io)
3. Verify ownership using HTML tag method
4. Update `app/layout.tsx` with verification code:
   ```typescript
   verification: {
     google: "YOUR_VERIFICATION_CODE",
   },
   ```

### 2. Submit Sitemap
- In Google Search Console, go to Sitemaps
- Submit `sitemap.xml`
- Monitor indexing status

### 3. Bing Webmaster Tools
- Add site to [Bing Webmaster Tools](https://www.bing.com/webmasters)
- Use same verification method
- Submit sitemap

## 📊 Performance Metrics

- **Build Time**: Optimized for fast compilation
- **Bundle Size**: Minimized with tree shaking
- **Loading Speed**: Static export for instant loading
- **Animation Performance**: 60fps on modern devices
- **Image Optimization**: 40-95% size reduction with WebP

## 🚀 Production Checklist

### Before Deployment:
- [ ] Environment variables configured (if needed)
- [ ] Build runs successfully (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] Images optimized (`npm run optimize`)
- [ ] Contact form tested (if API key provided)
- [ ] All pages load correctly

### After Deployment:
- [ ] Live site loads properly
- [ ] Contact form submissions work (if configured)
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable
- [ ] SEO setup completed

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

- **Email**: biswajitmailid@gmail.com
- **LinkedIn**: [Niloy Kumar Barman Panday](https://linkedin.com/in/biswajitpanday)
- **GitHub**: [biswajitpanday](https://github.com/biswajitpanday)

---

Built with ❤️ by Niloy Kumar Barman Panday
