# Hostel Dudes 🏠

> Find the perfect PG near your college — India's modern PG discovery platform.

![Hostel Dudes](https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80)

## ✨ Features

- 🔍 **Search PGs** by city, area, college, gender, budget & amenities
- 🏠 **Owner Dashboard** — list & manage PG properties instantly
- 👨‍💼 **Super Admin Panel** — manage owners, students & approvals
- 📱 **Fully Mobile Responsive** — works on all screen sizes
- 🔐 **Secure Auth** — NextAuth with role-based access
- 💾 **Dual Storage** — MySQL (Prisma) + JSON fallback
- ⚡ **Real-time listings** — owner adds PG → students see instantly

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Database | MySQL via Prisma ORM |
| Auth | NextAuth v5 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Deployment | Vercel |

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/rajkumarchaudhari123/hostelsDudes.git
cd hostelsDudes

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your MySQL credentials and secrets

# 4. Setup database
npx prisma generate
npx prisma db push

# 5. Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌐 Vercel Deployment

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables from `.env.example`
4. Use a cloud MySQL (PlanetScale / Railway / TiDB Cloud)
5. Deploy!

## 👥 User Roles

| Role | Access | Path |
|------|--------|------|
| Super Admin | Full control | `/admin` |
| PG Owner | List & manage properties | `/owner` |
| Student | Browse & search PGs | `/search` |

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/          # Super Admin Dashboard
│   ├── owner/          # PG Owner Dashboard  
│   ├── search/         # Student Search Page
│   ├── pg/[slug]/      # PG Detail Page
│   ├── api/            # REST API routes
│   └── login/          # Auth pages
├── components/         # Reusable UI components
├── utils/              # Helper functions
├── types/              # TypeScript types
└── constants/          # App constants

prisma/
└── schema.prisma       # Database schema
```

## 📄 License

MIT © Hostel Dudes 2026
