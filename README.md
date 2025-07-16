# My Earth Ledger - Personal Carbon Footprint Tracker

A Next.js web application that helps users track their daily carbon footprint across multiple categories (transportation, energy, food, shopping) and provides AI-powered personalized recommendations for reducing environmental impact.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: Clerk
- **AI Integration**: OpenAI API
- **Deployment**: Vercel

## Project Structure

```
ecotrack/
├── app/                          # Next.js App Router directory
│   ├── (dashboard)/             # Dashboard route group (protected routes)
│   │   ├── activityformpage/    # Activity form page for logging
│   │   ├── activitylog/         # Activity log listing and management
│   │   │   └── [id]/            # Dynamic route for individual activity editing
│   │   ├── log-activity/        # Activity type selector page
│   │   └── layout.tsx           # Dashboard layout with sidebar navigation
│   ├── api/                     # API routes for backend operations
│   │   ├── activitylog/         # General activity log endpoints
│   │   │   └── [id]/            # Individual activity CRUD operations
│   │   ├── energylog/           # Energy-specific logging endpoints
│   │   │   └── [id]/            # Energy activity CRUD operations
│   │   ├── foodlog/             # Food-specific logging endpoints
│   │   │   └── [id]/            # Food activity CRUD operations
│   │   ├── shoppinglog/         # Shopping-specific logging endpoints
│   │   │   └── [id]/            # Shopping activity CRUD operations
│   │   └── translog/            # Transportation-specific logging endpoints
│   │       └── [id]/            # Transportation activity CRUD operations
│   ├── new-user/                # New user onboarding flow
│   ├── sign-in/                 # Authentication pages
│   │   └── [[...sign-in]]/      # Clerk sign-in catch-all routes
│   ├── sign-up/                 # User registration pages
│   │   └── [[...sign-up]]/      # Clerk sign-up catch-all routes
│   ├── globals.css              # Global CSS styles
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Landing/home page
├── components/                   # Reusable UI components
│   ├── ActivityFormPage.tsx     # Main activity form container
│   ├── ActivitySelector.tsx     # Activity type selector
│   ├── CreateTransLog.tsx       # Transportation logging form
│   ├── CreateEnergyLog.tsx      # Energy logging form
│   ├── CreateFoodLog.tsx        # Food logging form
│   ├── CreateShoppingLog.tsx    # Shopping logging form
│   ├── Editor.tsx               # Activity edit form component
│   ├── EntryCard.tsx            # Activity display card
│   ├── EntryOptions.tsx         # Activity category selector
│   └── EnvironmentalCharities.tsx # Environmental impact partners page
├── utils/                       # Utility functions and helpers
│   ├── ai.ts                    # AI integration utilities
│   ├── api.ts                   # API helper functions
│   ├── auth.ts                  # Authentication utilities (Clerk)
│   └── db.ts                    # Database connection (Prisma)
├── prisma/                      # Database schema and configuration
│   └── schema.prisma            # Database schema definitions
├── public/                      # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── node_modules/                # Dependencies (auto-generated)
├── .next/                       # Next.js build output (auto-generated)
├── middleware.ts                # Route protection middleware
├── next.config.mjs              # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies and scripts
├── package-lock.json            # Lock file for dependencies
└── README.md                    # Project documentation
```

## Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd ecotrack
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**
   Create `.env.local` file with:

   ```bash
   # Database
   DATABASE_URL="your-neon-postgres-url"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
   CLERK_SECRET_KEY="your-clerk-secret-key"

   # OpenAI (for AI recommendations)
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Set up database**

   ```bash
   npx prisma generate
   npx prisma db push

   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

## Architecture Overview

### Database Schema

The application uses four separate activity log models:

- `TransportationActivityLog` - Car, bike, public transit activities
- `EnergyActivityLog` - Electricity, gas, heating usage
- `FoodActivityLog` - Meal tracking with carbon impact
- `ShoppingActivityLog` - Purchase tracking with sustainability metrics

### Authentication

- **Clerk** handles user authentication and session management
- **Middleware** (`middleware.ts`) protects dashboard routes
- Catch-all routing system ensures unauthenticated users see sign-up first

### API Design

- RESTful API endpoints for each activity type
- Standardized CRUD operations (POST, PATCH, GET)
- Consistent error handling and data validation
- **Important**: All API routes require fallbacks for data points - entries won't save to database without proper fallback values

### Frontend Architecture

- **Dashboard Layout** (`layout.tsx`) wraps all dashboard components with consistent navigation
- **Route Groups** organize related pages (dashboard routes grouped together)
- **Client/Server Components** optimized for performance and user experience

## Key Features

### Activity Logging

- Multi-category tracking (Transportation, Energy, Food, Shopping)
- Type-specific forms with relevant fields
- Automatic carbon footprint calculations
- Date and note tracking for all activities

### Dashboard

- Unified view of all logged activities
- Quick activity category selection
- Recent activities display with edit capabilities
- Responsive design with mobile support

### Data Management

- Individual API routes for each activity type
- Unified data display with type-aware routing
- Edit functionality for all logged activities
- Proper data validation and type conversion

## Development Notes

### Environment Variables

- `NEXT_PUBLIC_*` prefix required for client-side access
- Server-only variables accessible in API routes and server components only

### Database Considerations

- Prisma generates type-safe database client
- Relations properly set up between User and all activity models
- Optional Analysis model for future AI integration

### API Route Patterns

```typescript
// Creating entries
await createNewEntry(entryData, 'transportation')

// Updating entries
await updateEntry(id, logData, 'energy')
```

### Component Organization

- Reusable forms for each activity type
- Shared styling patterns across components
- Type-safe props and state management

## Future Enhancements

- **AI Recommendations**: OpenAI integration for personalized carbon reduction tips
- **Data Visualization**: Advanced charts and analytics
- **Goal Setting**: Carbon reduction targets and progress tracking
- **Social Features**: Community comparisons and achievements
- **Microservices**: Planned integration with teammate-built community features

## Contributing

1. Follow the established folder structure
2. Maintain TypeScript typing throughout
3. Include proper error handling in API routes
4. Add fallback values for all database fields
5. Test on multiple screen sizes for responsive design

---

Built for environmental impact awareness
