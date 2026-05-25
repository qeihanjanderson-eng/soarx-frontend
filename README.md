# SoarX Intelligence Frontend

A modern Next.js + React + TailwindCSS application for AI-powered Excel reasoning and analysis.

## Features

- **Chat Interface**: Multi-turn conversation with AI reasoning engine
- **File Upload**: Drag-and-drop support for Excel (.xlsx) and PDF files
- **Workbook Management**: Select and manage Excel workbooks and sheets
- **Automated Filling**: Automatically populate Excel sheets with extracted data
- **Word Report Generation**: Export analysis results as formatted Word documents
- **Results Tracking**: View updated fields, extracted values, and generated reports

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks
- **API Client**: Fetch API
- **Backend**: FastAPI (configured via `NEXT_PUBLIC_API_URL`)

## Project Structure

```
soarx-frontend/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main interface
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Chat.tsx          # Chat UI
│   ├── FileUpload.tsx    # File upload panel
│   ├── WorkbookSelector.tsx
│   ├── SheetSelector.tsx
│   ├── ActionButtons.tsx
│   └── ResultsPanel.tsx
├── utils/                # Utility functions
│   └── api.ts           # API client functions
├── styles/              # Stylesheets
│   └── globals.css      # Tailwind + custom styles
├── public/              # Static assets
│   └── soarx-logo.png   # Logo placeholder
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── .eslintrc.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- FastAPI backend running on the configured backend URL

### Installation

1. **Clone and navigate to the frontend directory**:
   ```bash
   cd soarx-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` if your backend runs on a different URL.

### Running Locally

**Development mode**:
```bash
npm run dev
```

Open the local development URL shown by Next.js in your browser.

**Production build**:
```bash
npm run build
npm start
```

### Usage

1. **Upload Files**: Drag and drop Excel or PDF files in the right panel
2. **Select Workbook**: Choose a workbook from the dropdown
3. **Select Sheet**: Choose a sheet within the workbook
4. **Chat**: Ask questions or request actions in the chat interface
5. **Actions**:
   - "Fill Excel Automatically" → Auto-fill selected sheet
   - "Analyze Client Data" → Extract and analyze uploaded files
   - "Generate Word Report" → Create a formatted report

### API Integration

The frontend communicates with the FastAPI backend via REST API:

- `POST /reason` - Send chat messages and reasoning requests
- `POST /upload_file` - Upload Excel/PDF files
- `POST /export_word` - Generate Word reports
- `GET /` - Test backend connectivity

All API calls are handled in `/utils/api.ts`.

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://api.soarxtax.com  # Backend API URL
```

### Customization

**Branding**:
- Colors defined in `tailwind.config.js`
- Navy: `#0A1B2A`
- Silver: `#C7CED6`
- Dark Orange: `#E67E22`

**Styling**:
- Global styles in `styles/globals.css`
- TailwindCSS classes used throughout components

**API Base URL**:
- Change `NEXT_PUBLIC_API_URL` in `.env.local`

## Troubleshooting

**Backend connection errors**:
- Ensure FastAPI backend is running on the configured URL
- Check `NEXT_PUBLIC_API_URL` in `.env.local`

**Upload fails**:
- Verify file format (.xlsx or .pdf)
- Check backend logs for detailed errors

**Styling issues**:
- Run `npm run dev` to rebuild Tailwind CSS
- Clear `.next/` folder and rebuild if needed

## Development

**Linting**:
```bash
npm run lint
```

**Building**:
```bash
npm run build
```

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. Set `NEXT_PUBLIC_API_URL` to your production backend URL

## License

Proprietary - SoarX Intelligence
