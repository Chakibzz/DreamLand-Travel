# DreamLand Travel - Fullstack SaaS

Application fullstack professionnelle pour agence de voyage, basee sur Next.js App Router + Prisma + PostgreSQL + NextAuth.

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth (Credentials)
- Zod validation

## Fonctionnalites
- Frontend existant conserve visuellement
- Dashboard admin securise (`/admin`)
- Auth admin
- CRUD annonces
- Gestion categories
- Gestion demandes contact et reservations
- Upload image local (`/public/uploads`)
- Nouvelles pages services:
  - `/sejour-a-la-carte`
  - `/omra`
  - `/billetterie`
  - `/transfert`

## Setup
1. Installer les dependances
```bash
npm install
```

2. Copier les variables d'environnement
```bash
cp .env.example .env
```
Puis adapter `DATABASE_URL`, `NEXTAUTH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

3. Generer Prisma client
```bash
npx prisma generate
```

4. Executer les migrations
```bash
npx prisma migrate dev --name init
```

5. Seeder admin initial + categories
```bash
npm run db:seed
```

6. Lancer le projet
```bash
npm run dev
```

## Scripts utiles
- `npm run dev`: lancement local
- `npm run build`: build production
- `npm run lint`: lint
- `npm run db:generate`: generation client Prisma
- `npm run db:migrate`: migration Prisma
- `npm run db:seed`: seed admin/categories

## Auth admin
- URL login: `/admin-login`
- URL dashboard: `/admin`

## API principales
- `POST /api/contact-requests`
- `POST /api/booking-requests`
- `GET|POST /api/admin/categories`
- `GET|POST /api/admin/announcements`
- `PUT|DELETE /api/admin/announcements/:id`
- `GET /api/admin/contact-requests`
- `GET /api/admin/booking-requests`
- `PATCH /api/admin/booking-requests/:id`
- `POST|DELETE /api/upload`

## Notes de securite
- Hash password admin avec bcrypt
- Routes admin protegees via middleware NextAuth
- Validation Zod sur toutes les routes de creation/modification

## Architecture
- `app/api/*`: routes backend
- `app/admin*`: interface admin
- `lib/server/*`: auth, prisma, utilitaires backend
- `lib/validators/*`: schemas Zod
- `prisma/*`: schema + seed
