# SoarX Frontend - Setup & Deployment Guide

## Quick Start

### 1. Install Dependencies

```bash
cd c:\Users\Qeiha\soarx-frontend
npm install
```

### 2. Configure Environment

Create `.env.local`:
```bash
copy .env.local.example .env.local
```

Edit `.env.local` if needed:
```
NEXT_PUBLIC_API_URL=https://api.soarxtax.com
```

### 3. Run Development Server

```bash
npm run dev
```

Visit the local development URL shown by the terminal.

## Architecture Overview

### Frontend Technology Stack
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Hooks**: State management

### Component Hierarchy

```
App (page.tsx)
├── Navigation Bar
├── Layout (3-panel)
│   ├── Left Sidebar (Chat History)
│   ├── Center (Chat Interface)
│   │   ├── Chat Component
│   │   └── Results Panel
│   └── Right Sidebar (Tools)
│       ├── File Upload
│       ├── Workbook Selector
│       ├── Sheet Selector
│       └── Action Buttons
```

### API Integration

All backend calls go through `/utils/api.ts`:

```typescript
// Send message to reasoning engine
sendMessageToReason(text)

// Upload files
uploadFile(file)

// Generate Word reports
generateWordReport(clientId, sections)

// Test connection
testConnection()
```

## Color Scheme

- **Navy**: `#0A1B2A` (Primary, backgrounds)
- **Silver**: `#C7CED6` (Secondary, text/borders)
- **White**: `#FFFFFF` (Base)
- **Dark Orange**: `#E67E22` (Accent, CTAs)

## File Structure

```
soarx-frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout wrapper
│   ├── page.tsx                 # Main page component (3-panel layout)
│   └── globals.css              # Global Tailwind styles
│
├── components/                   # Reusable React components
│   ├── Chat.tsx                 # Chat message display & input
│   ├── ChatMessage.tsx          # Individual message (not used, in Chat)
│   ├── FileUpload.tsx           # Drag-drop file upload panel
│   ├── WorkbookSelector.tsx     # Workbook dropdown
│   ├── SheetSelector.tsx        # Sheet dropdown
│   ├── ActionButtons.tsx        # Fill Excel, Analyze, Report buttons
│   └── ResultsPanel.tsx         # Results display (fields, values, reports)
│
├── utils/                        # Utility functions & helpers
│   └── api.ts                   # Backend API client functions
│
├── styles/                       # CSS files
│   └── globals.css              # Global styles + Tailwind
│
├── public/                       # Static assets
│   └── soarx-logo.svg           # Logo placeholder (SVG)
│
├── Configuration Files
│   ├── package.json             # Dependencies & scripts
│   ├── tsconfig.json            # TypeScript config
│   ├── tsconfig.node.json       # Node TypeScript config
│   ├── tailwind.config.js       # Tailwind CSS config
│   ├── postcss.config.js        # PostCSS config
│   ├── next.config.js           # Next.js config
│   ├── .eslintrc.json           # ESLint rules
│   └── .gitignore               # Git ignore rules
│
└── Documentation
    ├── README.md                # Project README
    └── SETUP.md                 # This file
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run linting
npm run lint
```

## Backend Requirements

**Ensure FastAPI backend is running:**

```bash
cd c:\Users\Qeiha\soarx-fastapi
python -m uvicorn main:app --reload
```

Backend should be available at the configured backend URL.

### Required Backend Endpoints

1. `POST /reason` - Reasoning engine
   ```json
   Request: { "text": "message" }
   Response: { "answer": "...", "fields_updated": [...], ... }
   ```

2. `POST /upload_file` - File upload
   ```
   Request: multipart/form-data with file
   Response: { "status": "uploaded", "chunks_added": N, ... }
   ```

3. `POST /export_word` - Word report
   ```json
   Request: { "client_id": "...", "sections": [...] }
   Response: { "status": "exported", "path": "..." }
   ```

4. `GET /` - Health check
   ```
   Response: { "status": "SoarX backend running", "version": "1.0" }
   ```

## Troubleshooting

### "Cannot reach backend" error
- Check if FastAPI is running at the configured backend URL
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for network errors

### Styles not loading
- Clear `.next/` folder: `rm -r .next`
- Restart dev server: `npm run dev`
- Rebuild Tailwind: `npm run build`

### TypeScript errors
- Delete `node_modules/`: `rm -r node_modules`
- Reinstall: `npm install`

### File upload not working
- Ensure file is `.xlsx` or `.pdf`
- Check backend `/upload_file` endpoint
- Check browser console for errors

## Production Deployment

### Build

```bash
npm run build
```

### Run

```bash
npm start
```

### Environment Variables

Set `NEXT_PUBLIC_API_URL` to your production backend URL:
```bash
NEXT_PUBLIC_API_URL=https://api.soarx.com
```

### Hosting Options

- **Vercel** (recommended for Next.js)
- **AWS Amplify**
- **Docker** (create Dockerfile)
- **Self-hosted VPS**

## Performance Optimization

- Images optimized with Next.js Image component
- Code splitting automatic with App Router
- CSS handled by Tailwind (tree-shaking)
- API calls are client-side (reduce server load)

## Security Notes

- API URL is exposed in client code (use appropriate CORS headers)
- Consider API rate limiting on backend
- Implement authentication for production
- Use HTTPS in production

## Next Steps

1. Customize the SoarX logo in `public/soarx-logo.svg`
2. Update color scheme in `tailwind.config.js` if needed
3. Add authentication flow if required
4. Deploy to Vercel or your hosting platform
5. Configure domain and SSL certificate
