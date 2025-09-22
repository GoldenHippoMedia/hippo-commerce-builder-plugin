# Hippo Builder Plugin

A custom Builder.io plugin for auditing and managing Hippo Commerce website content. This plugin provides comprehensive auditing tools for SEO, configuration validation, and content management within the Builder.io environment.

## Overview

The Hippo Builder Plugin extends Builder.io's capabilities to provide specialized auditing and management tools for Hippo Commerce websites. Rather than creating new content (which is handled by Builder.io's standard tools), this plugin focuses on auditing existing content, completing missing details, and ensuring proper configuration. It's designed to work seamlessly within Builder.io's React 18 environment and uses DaisyUI + Tailwind CSS for consistent, modern styling.

## Features

### Content Auditing & Management
- **SEO Auditing**: Comprehensive SEO analysis and validation for all pages
- **Configuration Auditing**: Validate and complete product configurations, categories, and relationships
- **Blog Comment Moderation**: Manage and moderate blog comments
- **Content Completion**: Identify and help complete missing content details
- **Relationship Management**: Audit and manage product-category relationships and other content links

### Auditing Capabilities

#### Page Auditing
- **SEO Analysis**: Comprehensive SEO validation including meta titles, descriptions, and image optimization
- **Configuration Validation**: Check for missing or incomplete page configurations
- **Content Completeness**: Identify pages with missing content or incomplete details
- **URL Structure**: Validate URL patterns and routing

#### Product Auditing
- **Configuration Validation**: Audit product configurations for completeness
- **Category Relationships**: Verify and manage product-category associations
- **Ingredient Mapping**: Validate product-ingredient relationships
- **Tag Management**: Audit and organize product tagging
- **Use Case Validation**: Ensure proper use case assignments
- **Product Group Integrity**: Validate product bundle configurations

#### Blog Management
- **Comment Moderation**: Comprehensive comment management and moderation tools
- **Category Auditing**: Validate blog post categorization
- **SEO Validation**: Check blog post SEO optimization
- **Content Quality**: Identify incomplete or problematic blog content

## Installation

### Prerequisites
- Node.js (compatible with React 18)
- Builder.io account with plugin installation permissions
- Hippo Commerce API access

### Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Development**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Configuration

The plugin requires several configuration settings to connect with your Hippo Commerce instance:

### Required Settings

- **Brand**: Select from "Gundry MD", "Dr. Marty", or "Other"
- **Development Site URL**: URL to your development site
- **API URL**: URL to your Hippo Commerce API instance
- **API User**: Your Hippo Commerce API username
- **API Password**: Your Hippo Commerce API password

### Advanced Settings

- **Custom Brand**: If "Other" is selected, specify your brand name exactly as configured in your Hippo Commerce API

## Usage

### Getting Started

1. **Install the Plugin**: Add the plugin to your Builder.io account
2. **Configure Settings**: Enter your Hippo Commerce API credentials and site information
3. **Access Audit Tools**: Use the plugin interface to audit and manage your existing content

### Auditing Workflow

1. **Access Audit Tools**: Use the main navigation to access different auditing interfaces
2. **Run Audits**: Execute comprehensive audits on pages, products, or blog content
3. **Review Results**: Analyze audit findings and identify areas needing attention
4. **Complete Missing Details**: Use the interface to fill in missing configurations or relationships
5. **Validate Changes**: Re-run audits to ensure all issues have been resolved

### Page Auditing

- **SEO Validation**: Check meta titles, descriptions, image alt text, and other SEO elements
- **Configuration Review**: Identify pages with missing or incomplete configurations
- **Content Completeness**: Find pages that need additional content or details
- **URL Validation**: Ensure proper URL structure and routing

### Product Auditing

- **Configuration Validation**: Audit product setups for completeness and accuracy
- **Relationship Management**: Verify and manage product-category, product-ingredient, and product-tag relationships
- **Product Group Validation**: Ensure product bundles are properly configured
- **Data Integrity**: Check for missing product information or broken relationships

### Blog Comment Management

- **Comment Review**: Moderate and manage blog comments
- **Spam Detection**: Identify and handle spam comments
- **Comment Approval**: Review and approve pending comments
- **User Management**: Handle commenter accounts and permissions

## Technical Details

### Architecture

- **Framework**: React 18
- **Styling**: DaisyUI + Tailwind CSS
- **State Management**: MobX
- **Build Tool**: Webpack
- **TypeScript**: Full TypeScript support

### Key Components

- **AppCore**: Main application component
- **HippoCMSManager**: Core CMS management interface
- **Models**: Comprehensive data models for all content types
- **Services**: API integration services for Builder.io and Hippo Commerce

### File Structure

```
src/
├── application/          # Main application pages and components
├── components/           # Reusable UI components
├── core/               # Core models and business logic
├── services/           # API services and integrations
├── utils/              # Utility functions and helpers
└── plugin.ts          # Main plugin entry point
```

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint (TypeScript + React)
- `npm run format` - Run Prettier formatting
- `npm test` - Run Jest tests with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run test:prod` - Lint and run tests (CI-friendly)

### Code Quality

- **Linting**: ESLint (flat config via `eslint.config.mjs`) with `@typescript-eslint` and `eslint-plugin-react`
- **Formatting**: Prettier 3 configured via `.prettierrc`
- **Type Checking**: Full TypeScript support
- **Testing**: Jest test framework
- **Commit Standards**: Conventional Commits enforced by Commitlint


## Tooling

- **ESLint (Flat Config)**: Modern ESLint v9 setup using `typescript-eslint` and React rules. Run with `npm run lint`.
- **Prettier 3**: Opinionated formatting applied with `npm run format` and integrated into pre-commit.
- **Husky + lint-staged**: Pre-commit hook runs ESLint and Prettier on staged files; commit-msg hook runs Commitlint.
  - Hooks are installed when dependencies are installed. If hooks are missing locally, run:
    ```bash
    npm run prepare
    ```
- **Commitlint**: Enforces Conventional Commits. Examples: `feat: add product audit`, `fix: correct SEO validation`.
- **Jest**: Unit testing with coverage. See `npm test` and `npm run test:watch`.

## API Integration

The plugin integrates with two main APIs:

1. **Builder.io API**: For content management and model definitions
2. **Hippo Commerce API**: For product data and commerce functionality

### Authentication

The plugin uses API credentials configured in the plugin settings to authenticate with the Hippo Commerce API.

## Troubleshooting

### Common Issues

1. **API Connection Issues**: Verify your API credentials and URL settings
2. **Content Not Loading**: Check your development site URL configuration
3. **Build Errors**: Ensure all dependencies are installed and up to date

## Contributing

1. Follow the existing code style and conventions
2. Write tests for new functionality
3. Use conventional commits for commit messages
4. Ensure all linting and tests pass before submitting changes

---

Built for Hippo Commerce by the Golden Hippo development team.
