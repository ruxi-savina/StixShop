Role: Act as a Senior Full-Stack Engineer and Architect. 
Task: Build a full-stack equipment rental catalog application with a psychedelic-modern aesthetic.
Name of the app: StixShop
1. Technical Stack
    * Frontend: Angular 18+ using Signals for reactive state management.
    * Backend: NestJS (Node.js) using a modular architecture (Services, Controllers, Modules).
    * ORM: Prisma with a PostgreSQL database (hosted on Supabase).
    * Storage: Supabase Storage for product images.
    * Styling: SCSS for custom styling.
    * Auth: JWT-based authentication for a single-admin mode.
2. Admin Authentication Logic (Environment Variable Driven)
    * Use a single-admin identity (no user registration table).
    * The admin password hash is stored in a Render environment variable named ADMIN_PASSWORD_HASH.
    * Create a NestJS AuthController with a /login endpoint that uses Bcrypt to compare the incoming password against the environment variable.
    * Upon successful login, the backend issues a JWT (JSON Web Token) signed with a JWT_SECRET environment variable.
    * Implement a NestJS JwtAuthGuard to protect all POST, PUT, PATCH, and DELETE routes.
    * The Angular frontend must store the JWT in localStorage and use an HttpInterceptor to attach the 'Authorization: Bearer' header to all API requests.
3. Features and Domain Model
    * Public Catalog: A grid layout where users can browse, search by keyword, filter by category, availability status and label, and open a product details view.
    * Product Details: Name, short description, long description, price, rental units, availability status, label and one or multiple images
    * Hidden Admin Access: A discreet, low-opacity button in the footer triggers a password modal. The admin is able to logout afterwards to see the normal view.
    * Admin Functionality: Once authenticated, the UI reveals buttons to add, edit, or delete products, and a toggle to make products hidden/visible. Also, he is able to add or remove the product categories. Categories can’t be removed if there are still products under that category.
    * Image Handling: NestJS should provide an upload endpoint that proxies files to Supabase Storage and returns the public URL to be saved in the database.
4. Data Schema (Prisma)
    * Product: id, name, shortDescription, longDescription, price, rentalUnits (int), availabilityStatus (enum), label (enum), isVisible (boolean), categoryId (Foreign Key to Category).
    * Enums:
        * AvailabilityStatus: AVAILABLE, RENTED, SOLD.
        * Label: RENT, SELL
    * ProductImage: id, url, productId (One-to-Many relationship).
5. Design Requirements
    * Aesthetic: Artistic, modern, and psychedelic.
    * Visuals: Use Glassmorphism (blur effects), gradients (cyan, magenta, purple), and subtle floating animations.
    * Accessibility: Ensure high contrast for text so the artistic background does not interfere with readability.
    * Layout: Fully responsive for mobile and desktop.
    * Keep the interface readable, accessible, and not chaotic
    * The design should feel modern and memorable
6. Local Development & Environment Setup
    * Environment Isolation: Ensure all database and storage connections are strictly pulled from environment variables to allow switching between a Dev Supabase project and a Production Supabase project.
    * Generate a .env.example file for the backend including: DATABASE_URL, DIRECT_URL, JWT_SECRET, ADMIN_PASSWORD_HASH, SUPABASE_URL, and SUPABASE_KEY.
    * Configure an Angular proxy.conf.json to handle CORS during local development (mapping /api to http://localhost:3000).
    * Ensure the Angular environment.ts files are set up to toggle between local API and production Render API.
    * Generate a standalone utility script named hash-password.js that uses the bcrypt library to take a string argument and output a hashed version for use in the .env file.
7. Output Requirements
    * Provide a clean folder structure separating /frontend and /backend.
    * Generate all necessary NestJS modules, controllers, and services.
    * Generate Angular components for the Catalog, Product Details, and Admin Modal.
    * Prefer clean and simple patterns over unnecessary complexity.
    * Generate the code step by step with clear sections.
    * Make the code easily readable, reusable, clean, and easy to modify.
    * Include a README.md with:
        * Local setup steps (npm install, npx prisma generate).
        * Instructions for running Prisma migrations against the database.
        * Render deployment notes: Specific instructions on adding DATABASE_URL, JWT_SECRET, and ADMIN_PASSWORD_HASH to the Render Dashboard.
        * Build commands (ng build --configuration production) and Rewrite rules for Angular routing on Render.

