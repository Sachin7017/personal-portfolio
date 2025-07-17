# Advanced Voice Assistant & Smart Home Control Platform

## Overview

This is an advanced personal voice assistant application built with React, TypeScript, and Node.js. The application combines a professional portfolio showcase with a fully functional voice-controlled smart home management system. Users can control all their devices through natural voice commands using speech recognition technology.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI components via shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: In-memory storage with MemStorage class
- **API**: RESTful endpoints for contact form and resume download

### Key Components

#### Frontend Components
- **Navigation**: Fixed navigation bar with smooth scrolling to all sections
- **Hero Section**: Introduction with voice assistant call-to-action
- **Voice Assistant**: Advanced speech recognition interface with natural language processing
- **Device Control**: Smart home device management dashboard with real-time controls
- **About Section**: Personal information and journey
- **Skills Section**: Technical skills categorized by type
- **Projects Section**: Featured projects with descriptions
- **Education Section**: Academic background and interests
- **Contact Section**: Contact form and social links
- **Footer**: Social media links and copyright

#### Backend Components
- **Routes**: API endpoints for contact form, resume download, device management, and voice command processing
- **Storage**: In-memory storage implementation for users, contacts, devices, and voice commands
- **Database Schema**: Users, contacts, devices, and voice commands tables with Drizzle ORM
- **Voice Processing**: Natural language understanding for device control commands
- **Device Management**: CRUD operations for smart home devices
- **Command History**: Voice command logging and retrieval system
- **Middleware**: Request logging and error handling

## Data Flow

1. **Voice Commands**: User speaks → speech recognition → natural language processing → device action → voice feedback
2. **Device Control**: User adjusts device → API call → storage update → real-time UI update
3. **Smart Home Management**: Device status changes → property updates → command logging → response generation
4. **Contact Form**: User submits contact form → validated with Zod → stored in database → success response
5. **Resume Download**: User clicks download → server streams PDF file → client downloads file
6. **Navigation**: User clicks nav item → smooth scroll to section (no page reload)
7. **Form Validation**: Real-time validation using React Hook Form with Zod resolvers

## External Dependencies

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI components
- **Lucide React**: Icon library
- **class-variance-authority**: For component variants
- **clsx**: Conditional class names

### Data Management
- **React Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema validation
- **date-fns**: Date manipulation library

### Database and Backend
- **Drizzle ORM**: Type-safe database queries
- **Neon Database**: Serverless PostgreSQL provider
- **Express.js**: Web application framework
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **Vite**: Build tool and development server
- **ESBuild**: JavaScript bundler for production
- **TypeScript**: Static type checking
- **Replit Plugins**: Development environment integration

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: Uses `tsx` for TypeScript execution with hot reload
- **Production**: Compiled JavaScript with `NODE_ENV=production`
- **Database**: Configured via `DATABASE_URL` environment variable

### File Structure
- `client/`: React frontend application
- `server/`: Express backend application
- `shared/`: Shared schemas and types
- `migrations/`: Database migration files
- `attached_assets/`: Static files (resume PDF)

### Security Considerations
- Input validation with Zod schemas
- CORS configuration for API endpoints
- File download security with existence checks
- Session management (placeholder implementation)

The application follows a monorepo structure with clear separation between frontend and backend concerns, utilizing modern web development practices and tools for optimal performance and maintainability.