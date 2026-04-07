# 🏢 Full-Stack Employee Management System with DevOps Driven lifecycle 

<p align="center">
  <img src="public/favicon.png" alt="OnkarNova EMS Logo" width="120" height="120" style="border-radius: 50%;" />
</p>

<p align="center">
  <strong>A modern, full-stack Employee Management System built with React, TypeScript & PostgreSQL</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Jenkins-CI/CD-D24939?logo=jenkins&logoColor=white" alt="Jenkins" />
</p>

---

## 📋 Table of Contents

- [🔍 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🐳 Docker Deployment](#-docker-deployment)
- [⚙️ Jenkins CI/CD Pipeline](#️-jenkins-cicd-pipeline)
- [📁 Project Structure](#-project-structure)
- [🔐 Security](#-security)
- [📄 PDF Export](#-pdf-export)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## 🔍 Overview

**OnkarNova EMS** is a production-ready Employee Management System designed for organizations to efficiently manage their workforce data. Built with a modern JAMstack approach — a blazing-fast React frontend powered by a PostgreSQL backend — it delivers real-time CRUD operations, interactive dashboards, and enterprise-grade PDF reporting.

> **Problem Solved:** Traditional employee management involves scattered spreadsheets, manual tracking, and zero visibility into workforce metrics. This system centralizes everything into a single, beautiful, real-time dashboard.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Interactive Dashboard** | Real-time stats — total employees, active count, departments, avg. salary |
| 📈 **Department Analytics** | Visual bar charts powered by Recharts showing department distribution |
| ➕ **Full CRUD Operations** | Add, edit, delete employees with form validation |
| 🔍 **Advanced Search & Filter** | Search by name/email, filter by department & status, multi-column sorting |
| 📄 **PDF Export** | Export full employee list or individual profiles as professionally formatted PDFs |
| ☑️ **Bulk Actions** | Select multiple employees for bulk delete or bulk PDF export |
| 📑 **Pagination** | Server-friendly pagination with configurable page sizes |
| 🎨 **Professional UI** | Custom design system with Plus Jakarta Sans + Inter typography |
| 📱 **Responsive Design** | Fully responsive across desktop, tablet, and mobile |
| 🐳 **Docker Ready** | Multi-stage Dockerfile with Nginx for production serving |
| 🔄 **CI/CD Pipeline** | Jenkinsfile for automated build, test, and deployment |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client (Browser)                  │
│  React 18 + TypeScript + TailwindCSS + TanStack Q.  │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS / REST
                       ▼
┌─────────────────────────────────────────────────────┐
│              Backend                                │
│         PostgreSQL + Row Level Security             │
│         Edge Functions + Auth + Storage             │
└─────────────────────────────────────────────────────┘
```

**Key Design Decisions:**

- **TanStack Query** for server state management — automatic caching, refetching, and optimistic updates
- **Row Level Security (RLS)** on all database tables for zero-trust data access
- **Component-driven architecture** — small, focused, reusable UI components
- **Multi-stage Docker builds** — optimized image size (~25MB final image)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| ⚛️ React 18 | UI library with hooks & concurrent features |
| 🔷 TypeScript 5 | Type safety across the entire codebase |
| ⚡ Vite 5 | Lightning-fast HMR & optimized production builds |
| 🎨 Tailwind CSS 3 | Utility-first styling with custom design tokens |
| 📊 Recharts | Composable charting for dashboard analytics |
| 📝 React Hook Form + Zod | Form management with schema-based validation |
| 🔄 TanStack Query | Async state management & caching |
| 🧩 shadcn/ui | Accessible, customizable component primitives |

### Backend & Database
| Technology | Purpose |
|---|---|
| 🐘 PostgreSQL 16 | Relational database for employee data |
| 🔐 Row Level Security | Database-level access control policies |
| 🌐 RESTful API | Auto-generated REST endpoints |

### DevOps & Infrastructure
| Technology | Purpose |
|---|---|
| 🐳 Docker | Containerized multi-stage builds |
| 🌐 Nginx | Production-grade static file serving with SPA routing |
| 🔄 Jenkins | CI/CD pipeline automation |
| 📦 GitHub Pages | Static site deployment option |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x (or **bun** ≥ 1.x)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/onkarnova-ems.git
cd onkarnova-ems

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=<your-backend-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

> These are automatically configured when using Lovable Cloud.

---

## 🐳 Docker Deployment

### Build & Run

```bash
# Build the Docker image
docker build -t onkarnova-ems:latest .

# Run the container
docker run -d \
  --name ems-app \
  -p 80:80 \
  onkarnova-ems:latest
```

### Dockerfile Breakdown

```dockerfile
# Stage 1: Build (Node 20 Alpine)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci              # Deterministic install
COPY . .
RUN npm run build       # Vite production build

# Stage 2: Serve (Nginx Alpine ~25MB)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

**Why multi-stage?** The build stage includes `node_modules` (~500MB). The final image only ships the compiled `dist/` folder (~5MB) on top of Nginx Alpine (~20MB).

---

## ⚙️ Jenkins CI/CD Pipeline

The included `Jenkinsfile` automates the full delivery pipeline:

```
Checkout → Install → Build & Lint → Docker Build → Deploy
```

| Stage | What it does |
|---|---|
| **Checkout** | Pulls latest code from SCM |
| **Install** | Runs `npm ci` for reproducible installs |
| **Lint & Test** | Executes `npm run build` (includes type checking) |
| **Docker Build** | Builds & tags image with `BUILD_NUMBER` + `latest` |
| **Deploy** | Stops old container, starts new one on port 80 |

### Pipeline Setup

1. Create a new **Pipeline** job in Jenkins
2. Point **Pipeline script from SCM** to your repo
3. Jenkins will auto-detect the `Jenkinsfile`

---

## 🔐 Security

- **Row Level Security (RLS)** enabled on all database tables
- **No secrets in code** — environment variables for all sensitive config
- **Input validation** — Zod schemas validate all form inputs before submission
- **HTTPS enforced** in production deployments
- **Content Security Policy** via Nginx headers

---

## 📄 PDF Export

The system supports two types of PDF exports:

### 📋 Full Employee List
- Landscape A4 format with company branding
- Auto-generated table with all employee fields
- Pagination support for large datasets

### 👤 Individual Employee Profile
- Portrait A4 format with detailed employee information
- Includes: personal details, department, position, salary, contact info
---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Usage |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | Formatting, no code change |
| `refactor:` | Code restructuring |
| `test:` | Adding tests |
| `chore:` | Maintenance tasks |

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <strong>OnkarNova Technologies</strong> — Solving workforce management, one commit at a time.
</p>
