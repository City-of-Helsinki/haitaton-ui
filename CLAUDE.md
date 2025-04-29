# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Haitaton is a service owned by the city of Helsinki that supports the management and prediction of adverse effects of projects taking place within the urban area. This is a React-based frontend application built with TypeScript, using modern web technologies including Helsinki Design System (HDS) components, OpenLayers for mapping, and Redux Toolkit for state management.

## Development Commands

### Environment Setup
- `yarn install` - Install dependencies
- `yarn prepare` - Set up Husky git hooks (run once)
- `yarn update-runtime-env` - Generate environment configuration file

### Development
- `yarn start` - Start development server at http://localhost:3001
- `yarn start-msw` - Start with MSW (Mock Service Worker) API mocking
- `yarn build` - Build for production
- `yarn build-and-serve` - Build and serve locally

### Testing & Quality
- `yarn test` - Run unit tests in watch mode
- `yarn testCI` - Run tests for CI (with CI=TRUE)
- `yarn e2e` - Run Playwright E2E tests
- `yarn lint` - Run TypeScript check and ESLint
- `yarn ts-check` - TypeScript type checking only
- `yarn type-check` - Same as ts-check (alternative command)
- `yarn lint:css` - Run Stylelint for SCSS files
- `yarn format` - Format code with Prettier

### Localization
- `yarn locales:export` - Export translations to Excel file
- `yarn locales:import` - Import translations from Excel file

## Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router v6** for routing
- **Helsinki Design System (HDS)** for UI components
- **OpenLayers** for mapping functionality
- **React Hook Form** with Yup validation
- **React Query** for API state management
- **i18next** for internationalization (fi, sv, en)
- **Sass** for styling

### Project Structure
- `src/common/` - Shared components, hooks, utils, types
- `src/domain/` - Business logic organized by domain
  - `api/` - API configuration and endpoints
  - `auth/` - Authentication and authorization
  - `hanke/` - Project (hanke) management
  - `application/` - Application forms and workflows
  - `map/` - Map-related components and logic
  - `mocks/` - MSW mock definitions
- `src/pages/` - Page components and routing
- `src/locales/` - Translation files

### Key Architectural Patterns

#### State Management
- Redux Toolkit for global state
- React Query for server state
- Local component state with hooks
- Context API for specific domains (MapContext, DrawContext, etc.)

#### API Integration
- Axios instance with authentication interceptors
- Public endpoints bypass auth (defined in publicEndpoints.ts)
- Bearer token authentication via HDS getApiTokenFromStorage

#### Environment Configuration
- Runtime environment variables via `window._env_` object
- Environment files processed by `scripts/update-runtime-env.ts`
- Supports both development and production configurations

#### Authentication
- OIDC integration with Helsinki AD or Suomi.fi
- Controlled by `REACT_APP_OIDC_CLIENT_ID` environment variable
- Token-based API authentication

#### Mapping
- OpenLayers for map rendering
- Custom drawing interactions for geometry creation
- Support for multiple coordinate systems (EPSG:3879)
- Layer-based architecture for different map data

#### Form Handling
- React Hook Form with Yup validation schemas
- Multi-step form wizard pattern (MultipageForm)
- Form error handling and validation feedback

#### Testing
- Jest for unit testing
- React Testing Library for component testing
- Playwright for E2E testing
- MSW for API mocking in tests

## Feature Flags

The application uses feature flags controlled by environment variables:
- `REACT_APP_FEATURE_PUBLIC_HANKKEET` - Public projects visibility
- `REACT_APP_FEATURE_HANKE` - Project management features
- `REACT_APP_FEATURE_CABLE_REPORT_PAPER_DECISION` - Cable report paper decisions
- `REACT_APP_FEATURE_INFORMATION_REQUEST` - Information request functionality

## Important Notes

### Code Style
- ESLint and Prettier configured via lint-staged
- TypeScript strict mode enabled
- SCSS modules for component styling
- HDS design tokens for consistent theming

### API Endpoints
- Base URL: `/api`
- Authentication required except for public endpoints
- Error handling via axios interceptors

### Localization
- Three supported languages: Finnish (fi), Swedish (sv), English (en)
- Default language: Finnish
- Translation files in JSON format
- Excel export/import workflow for translators

### Testing Requirements
- Run `yarn lint` and `yarn type-check` before committing
- E2E tests require `.env.e2e` configuration
- MSW mocks available for development and testing

### Development Environment
- Node 20.x required
- Yarn package manager
- Development server runs on port 3001
- Hot reloading enabled