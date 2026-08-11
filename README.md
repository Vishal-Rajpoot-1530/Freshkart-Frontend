# 🛒 FreshKart — Frontend

FreshKart is a modern quick-commerce grocery storefront designed to provide a fast, simple, and responsive shopping experience.

This repository contains the **FreshKart frontend**, built with **React, TypeScript, Vite, TanStack Start, TanStack Router, Tailwind CSS, and Radix UI components**.

> **Project status:** Under active development.

---

## ✨ Features

### 🛍️ Shopping
- Grocery storefront/home page
- Product listing and product details
- Category-based browsing
- Product search
- Recently viewed products
- Wishlist
- Shopping cart
- Quantity management
- Automatic subtotal, savings, delivery fee, tax, and total calculation
- Checkout flow
- Order success page

### 👤 Account
- User registration
- Login
- OTP page
- Profile
- Saved addresses
- Notifications
- Order history
- Individual order details

### 📄 Informational Pages
- About
- Contact
- Help

### 📱 Responsive UI
- Desktop-friendly storefront
- Mobile navigation
- Responsive product grids
- Reusable UI components

### 💾 Local State
The current frontend stores cart, wishlist, location, and recently viewed product state in browser `localStorage`.

The storage key used by the application is:

```text
freshkart-state-v1
```

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI development |
| TypeScript 5 | Type-safe development |
| Vite 8 | Development server and build tooling |
| TanStack Start | React application framework / SSR |
| TanStack Router | Type-safe routing |
| TanStack Query | Server-state/query infrastructure |
| Tailwind CSS 4 | Styling |
| Radix UI | Accessible UI primitives |
| React Hook Form | Form handling |
| Zod | Validation |
| Recharts | Charts |
| Framer Motion | Animations |
| Lucide React | Icons |
| Sonner | Toast notifications |
| ESLint | Code linting |
| Prettier | Code formatting |

---

## 📁 Project Structure

```text
freshkart-frontend/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── product/
│   │   └── ui/
│   │
│   ├── context/
│   │   └── AppContext.tsx
│   │
│   ├── data/
│   │   ├── categories.ts
│   │   └── products.ts
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │
│   ├── routes/
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── cart.tsx
│   │   ├── checkout.tsx
│   │   ├── orders.tsx
│   │   ├── wishlist.tsx
│   │   └── ...
│   │
│   ├── types/
│   │
│   ├── router.tsx
│   ├── routeTree.gen.ts
│   ├── server.ts
│   ├── start.ts
│   └── styles.css
│
├── public/
├── .gitignore
├── components.json
├── eslint.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

# ⚙️ Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git

Check your versions:

```bash
node --version
npm --version
git --version
```

Using a current **Node.js LTS** release is recommended.

---

# 🚀 Getting Started

## 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Example:

```bash
git clone https://github.com/YOUR_USERNAME/freshkart-frontend.git
```

## 2. Enter the project directory

```bash
cd freshkart-frontend
```

## 3. Install dependencies

The repository contains a `package-lock.json`, so npm is the recommended package manager.

```bash
npm install
```

## 4. Start the development server

```bash
npm run dev
```

Vite will display the local URL in the terminal. Open that URL in your browser.

---

# 📜 Available Scripts

The current `package.json` defines these scripts:

### Development

```bash
npm run dev
```

Starts the Vite development server.

### Production build

```bash
npm run build
```

Creates a production build.

### Development-mode build

```bash
npm run build:dev
```

Creates a build using development mode.

### Preview production build

```bash
npm run preview
```

Serves the generated production build locally.

### Lint

```bash
npm run lint
```

Runs ESLint across the project.

### Format

```bash
npm run format
```

Formats the project using Prettier.

---

# 🧭 Application Routes

The current application contains routes for:

| Route | Purpose |
|---|---|
| `/` | Home/storefront |
| `/login` | Login |
| `/register` | Registration |
| `/otp` | OTP |
| `/search` | Product search |
| `/category/:slug` | Category products |
| `/product/:id` | Product details |
| `/cart` | Shopping cart |
| `/checkout` | Checkout |
| `/order-success` | Successful order |
| `/orders` | Order history |
| `/order/:id` | Order details |
| `/wishlist` | Wishlist |
| `/profile` | User profile |
| `/addresses` | Saved addresses |
| `/notifications` | Notifications |
| `/about` | About FreshKart |
| `/contact` | Contact |
| `/help` | Help |

TanStack Router generates the route tree used by the application.

---

# 🧠 State Management

FreshKart currently uses a React Context-based application state.

The main provider is:

```text
src/context/AppContext.tsx
```

It manages:

```text
Cart
Wishlist
Location
Recently viewed products
```

The application uses `useReducer` for state updates.

Main actions include:

```text
ADD
REMOVE
INC
DEC
CLEAR
TOGGLE_WISH
SET_LOCATION
VIEW
HYDRATE
```

---

# 💾 Browser Persistence

FreshKart persists application state in `localStorage`.

The storage key is:

```text
freshkart-state-v1
```

To reset the stored application state, open the browser developer console and run:

```javascript
localStorage.removeItem("freshkart-state-v1");
```

Then refresh the page.

---

# 💰 Cart Calculation

The frontend currently calculates:

```text
Subtotal
Savings
Delivery fee
Tax
Total
```

The current delivery rule implemented in `AppContext.tsx` is:

```text
Subtotal >= ₹199  → Free delivery
Subtotal < ₹199   → ₹25 delivery
Empty cart         → ₹0 delivery
```

Tax is currently calculated as approximately:

```text
5% of subtotal
```

These are frontend calculations and should be synchronized with backend/order calculations when production checkout APIs are integrated.

---

# 🗂️ Product Data

The current project includes local product and category data:

```text
src/data/products.ts
src/data/categories.ts
```

This allows the storefront to operate with sample data.

When backend integration is enabled, these local data sources can be replaced or supplemented with API responses.

---

# 🎨 UI Architecture

Reusable UI components are located under:

```text
src/components/ui/
```

The project includes components for:

- Buttons
- Cards
- Dialogs
- Dropdowns
- Forms
- Inputs
- Selects
- Tables
- Tabs
- Tooltips
- Toasts
- Navigation
- Sidebar
- Calendar
- Carousel
- Pagination
- Progress indicators

Layout components are located under:

```text
src/components/layout/
```

Product-specific components are located under:

```text
src/components/product/
```

---

# 🔄 Frontend Architecture

```text
                    ┌──────────────────────┐
                    │       Browser        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Application  │
                    │   TypeScript + Vite  │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      TanStack Router    AppContext        TanStack Query
             │                 │                 │
             ▼                 ▼                 ▼
          Routes          Local State       API / Server
                               │
                               ▼
                         localStorage
```

---

# 🔌 Backend Integration

The uploaded frontend currently contains local product/category data and client-side application state.

When connected to the FreshKart backend, the recommended architecture is:

```text
FreshKart Frontend
       │
       │ HTTP / REST API
       ▼
FreshKart Backend
       │
       ├── Authentication
       ├── Products
       ├── Categories
       ├── Orders
       ├── Users
       ├── Payments
       └── Delivery
              │
              ├── MongoDB
              └── Redis
```

API configuration should be supplied through environment variables when backend integration is enabled.

---

# 🔐 Environment Variables

The uploaded frontend does not currently require a committed `.env` file for its local product/state functionality.

For API integration, create:

```text
.env
```

For Vite, frontend-exposed variables normally use the `VITE_` prefix.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

Never commit private secrets or credentials to GitHub.

---

# 🧪 Code Quality

Run ESLint:

```bash
npm run lint
```

Format the project:

```bash
npm run format
```

Build the application:

```bash
npm run build
```

A successful production build is a useful check before pushing changes.

---

# 🐛 Troubleshooting

## Dependencies are broken

### Windows PowerShell

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

Then:

```bash
npm run dev
```

## Stale localStorage data

Reset FreshKart's stored state:

```javascript
localStorage.removeItem("freshkart-state-v1");
```

Refresh the browser.

## Build fails

Run:

```bash
npm run lint
npm run build
```

Check the first meaningful error reported by the terminal.

---

# 🌿 Git Workflow

Create a feature branch:

```bash
git checkout -b feature/product-search
```

Check changed files:

```bash
git status
```

Stage changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Add product search"
```

Push:

```bash
git push origin feature/product-search
```

Then create a Pull Request on GitHub.

---

# 🔒 Security

Do not commit:

```text
.env
.env.local
API keys
JWT secrets
Private credentials
Access tokens
Database credentials
```

Use environment variables and keep secrets on the backend whenever possible.

---

# 🚧 Roadmap

- [ ] Connect product listing to backend API
- [ ] Implement real authentication
- [ ] Connect user profile APIs
- [ ] Connect address APIs
- [ ] Connect cart APIs
- [ ] Implement real checkout API
- [ ] Integrate payment gateway
- [ ] Connect order APIs
- [ ] Implement real-time order tracking
- [ ] Add rider workflow
- [ ] Add admin dashboard integration
- [ ] Add API error/loading states
- [ ] Add automated tests
- [ ] Add production deployment configuration

---

# 👨‍💻 Author

**Vishal Rajpoot**

Full-Stack Developer

### Main Technologies

```text
React.js
TypeScript
Node.js
Express.js
MongoDB
PostgreSQL
Flutter
Firebase
```

---

# 🛒 FreshKart

**Fresh groceries. Fast delivery. Simple shopping.**

Built with modern web technologies.

