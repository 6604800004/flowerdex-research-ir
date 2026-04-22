# 🌸 FlowerDex
Flowerdex คือเว็บแอปพลิเคชันสารานุกรมดอกไม้ไทย สำหรับค้นหา สำรวจ และเรียนรู้เกี่ยวกับดอกไม้พื้นถิ่นและดอกไม้นิยมในประเทศไทย ครอบคลุมข้อมูลชื่อไทย/อังกฤษ ความหมายเชิงสัญลักษณ์ ฤดูกาลออกดอก การจำแนกสี และข้อมูลการดูแล โดยใช้ข้อมูลจาก Perenual Plant API

=>

Flowerdex is a Thai flower encyclopedia web application that allows users to search, explore, and learn about native and cultivated flowers found in 
Thailand — including Thai/English names, symbolic meanings, seasonal availability, color classification, and care information, powered by the Perenual Plant API.

## Features

- 🔍 ค้นหาดอกไม้ภาษาไทย/อังกฤษ (Red = แดง, Rose = กุหลาบ)
- ✏️ แก้คำผิดอัตโนมัติ (Levenshtein fuzzy search)
- 🌱 ข้อมูลการดูแลจาก Perenual API (cached)
- 💖 รายการโปรด (localStorage)
- 🔐 ระบบ Admin Login (Supabase Auth)
- 🛡️ RLS — เฉพาะ Admin เพิ่ม/ลบดอกไม้ได้

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd flower-dex
npm install
```

### 2. Setup Supabase

ดูคู่มือละเอียดใน **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

สรุปย่อ:
1. สร้าง project ที่ https://supabase.com
2. รัน SQL schema จากไฟล์ `SUPABASE_SETUP.md`
3. สร้าง storage bucket `flower-images` (public)
4. สร้าง admin user ใน Authentication → Users

### 3. Environment Variables

```bash
cp .env.example .env.local
```

แก้ไขค่าใน `.env.local`:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
VITE_PERENUAL_API_KEY=sk-...   # optional
```

### 4. Run

```bash
npm run dev
# เปิด http://localhost:8080
```

---

## Project Structure

```
src/
├── App.tsx                    # Root: QueryClient + AuthProvider + Routes
├── context/
│   └── AuthContext.tsx        # Supabase auth state (user, signIn, signOut)
├── components/
│   ├── FlowerCard.tsx         # การ์ดดอกไม้
│   ├── FlowerModal.tsx        # Modal รายละเอียด + care info
│   ├── Navbar.tsx             # Nav (แสดง logout เมื่อ login แล้ว)
│   ├── NavLink.tsx            # Router NavLink wrapper
│   ├── ProtectedRoute.tsx     # Guard /admin → redirect /login
│   └── ui/                   # shadcn/ui components
├── data/
│   └── flowers.ts             # Type definitions + static fallback data
├── hooks/
│   ├── useFlowers.ts          # Supabase fetch + Perenual API enrichment
│   ├── useFavorites.ts        # localStorage favorites
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── integrations/
│   ├── client.ts              # Supabase client
│   └── types.ts               # Generated DB types
├── lib/
│   └── utils.ts               # cn() helper
├── pages/
│   ├── Index.tsx              # หน้าหลัก + search
│   ├── Favorites.tsx          # รายการโปรด
│   ├── Admin.tsx              # จัดการดอกไม้ (Protected)
│   ├── Login.tsx              # หน้า login admin
│   └── NotFound.tsx
└── utils/
    └── search.ts              # Fuzzy search + EN→TH translation
```

---

## Admin Access

1. ไปที่ `/login` หรือคลิก **"เข้าสู่ระบบ"** ใน Navbar
2. Login ด้วย email/password ที่สร้างใน Supabase
3. หลัง login → เมนู **"จัดการ"** จะปรากฏใน Navbar
4. Logout ผ่านปุ่ม ออกจากระบบ ที่มุมขวา

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (port 8080) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint check |
| `npm test` | Run tests (Vitest) |
"# flowerdex-research-ir" 
