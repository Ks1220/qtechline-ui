# Stock UI

A React + TypeScript + Vite application for managing stock levels and inventory items.

## Overview

Stock UI is a web-based dashboard that allows users to view, search, and manage stock levels across different equipment and containers. It provides a paginated table interface to browse inventory items and a modal-based editor to adjust stock quantities.

## Features

- **Stock Level Dashboard**: View all stock items in a paginated table format
- **Equipment Groups**: Supports multiple equipment categories including:

  - Air Compressors (AC)
  - Containers (10FT, 20FT Offshore)
  - Hydraulic Hose & Fittings (HF, HYD)
  - Fabrication of Sling (FB)
  - GENSET units
  - Inspection items (ISP)
  - And more via configurable mappings

- **Stock Item Editor**: Click the action menu (⋯) on any item to:

  - View stock details (fetched from SQL backend)
  - Update stock levels
  - Save changes back to the system

- **Pagination**: Navigate through large inventory datasets with:
  - Page numbers
  - Previous/Next controls
  - Jump by 10 pages controls

## Tech Stack

- **React 19**: UI framework with hooks
- **TypeScript**: Type-safe development
- **Vite 7**: Fast build tool with HMR
- **CSS**: Custom styling with dark theme

## Project Structure

```
src/
├── App.tsx              # Main application component
├── App.css              # Application styling
├── api.ts               # API integration (Cloudflare Workers)
├── types.ts             # TypeScript type definitions
├── main.tsx             # Entry point
├── index.css            # Global styles
└── utils/
    ├── index.ts         # Utility functions (extractDocKey)
    └── stockGroupMappings.json  # Equipment group codes
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

## API Integration

The application connects to a Cloudflare Workers backend at `http://localhost:8787`:

- **GET `/assetStock`**: Fetch all stock items
- **GET `/stockitem/{docKey}`**: Fetch specific stock item details from SQL
- **POST `/stockLevels/{stockNo}/adjust`**: Update stock levels

Authentication uses Cloudflare Access credentials configured in [src/api.ts](src/api.ts).

## Stock Group Mappings

Equipment types are defined in [src/utils/stockGroupMappings.json](src/utils/stockGroupMappings.json) and used to:

- Extract document keys from stock numbers
- Categorize equipment for display and management

Common codes:

- `AC`: Air Compressor
- `FB`: Fabrication of Sling
- `HF`: Hydraulic Hose & Fitting
- `HYD`: Hydraulic Hose Fitting
- `ISP`: Inspection
- `GENSET`: Generator Set
- `DEFAULT`: Default category

## License

Private project
