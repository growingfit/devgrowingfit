# Growing Fit — School of Health & Physical Education
### Complete Production-Ready Website & Admin CMS

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase PostgreSQL & Auth**, and **Cloudinary**.

---

## 🚀 Key Features

1. **Pixel-Accurate Design Reproduction**:
   - Official **Growing Fit** brand logo with concentric colored rings, joyful child silhouette, and ribbon banner.
   - Header with active purple indicator, navigation, and rounded "Enquire Now ->" button.
   - **Hero Banner**: "Stronger Kids. Brighter **Futures.**" with asymmetric geometric clipping and red backing border contour.
   - **Exact Minimal Category Row**: Clean 3-column athlete silhouette icon row with thin horizontal red underline bars for **Badminton**, **Football**, and **Roller Skating**.
   - **About Section**: "More Than Just **Sports.**" with 3-column layout, photographic arch with red backing shape, and 4 core value features.
   - **Vision Section**: Wide banner with dark crimson angled badge, academy background, and controlled red duotone overlay.
   - **Statistics**: 500+ Happy Students, 10+ Sports Programs, 5+ Training Centres, 95% Parent Satisfaction.
   - **Gallery ("Moments That Inspire")**: 8-photo grid matching authentic academy training moments with accessible lightbox popup.
   - **Testimonials ("What Parents Say")**: Authentic parent quotes (Fazilulla M, Azhar Ali) with purple quotes and navigation.
   - **Final CTA**: "Take the First Step Towards a Healthier You" on soft lavender background with framed academy photo.
   - **Footer**: 5-column layout with official contact details (`+91 702 581 0722`, `growingfitofficial@gmail.com`), centre locations (Calicut, Kochi, Bangalore, Mumbai), and social links.

2. **Full Admin CMS (`/admin`)**:
   - Protected behind Supabase Auth and server-side SSR cookie verification.
   - Complete CRUD modules for:
     - Hero banner & benefit indicators (`/admin/hero`)
     - Sports categories with icon picker & live frontend row preview (`/admin/categories`)
     - Sports programs (`/admin/programs`)
     - About section & features (`/admin/about`)
     - Vision banner & overlay strength (`/admin/vision`)
     - Statistics (`/admin/statistics`)
     - Gallery with direct Cloudinary uploads and orphaned-media cleanup (`/admin/gallery`)
     - Testimonials (`/admin/testimonials`)
     - Training centres (`/admin/centres`)
     - Contact details & social media links (`/admin/contact`)
     - Footer copy & legal pages (`/admin/footer`)
     - Site settings & administrator bootstrap (`/admin/settings`)

3. **Supabase Database Architecture**:
   - Normalized PostgreSQL schema with UUIDs, singleton constraints, foreign keys, and indexes.
   - Strict Row Level Security (RLS) policies: public can only read published content; authenticated admins have full CRUD.
   - Directly executable `supabase/migrations/20240101000000_initial_schema.sql` and `supabase/seed.sql`.

4. **Cloudinary Integration**:
   - Secure server-side signed uploads via `/api/uploads`.
   - MIME type and file size validation (up to 10MB).
   - Safe deletion endpoint `/api/media/delete` to prevent orphaned media.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14+ (App Router, Server Components & Server Actions)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase PostgreSQL & Supabase Auth
- **Media Storage**: Cloudinary SDK
- **Icons**: Lucide React & Custom SVG Athlete Silhouettes
- **Validation**: Zod & React Hook Form

---

## 📦 Setup & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your project credentials:
```bash
cp .env.example .env.local
```

Fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Supabase Database Migration & Seed
1. Open your **Supabase Dashboard &rarr; SQL Editor**.
2. Run `supabase/migrations/20240101000000_initial_schema.sql` to create all tables and RLS security policies.
3. Run `supabase/seed.sql` to populate default categories, programs, stats, features, and settings.

### 4. Bootstrap Administrator Account
1. In Supabase Dashboard, go to **Authentication &rarr; Users &rarr; Add user &rarr; Create user**.
2. Enter your administrator email and password. Copy the user **UUID**.
3. In SQL Editor, execute:
   ```sql
   INSERT INTO public.admin_users (id, email, full_name, role)
   VALUES ('<USER-UUID>', 'admin@growingfit.com', 'Academy Director', 'super_admin');
   ```

### 5. Start Development Server
```bash
npm run dev
```
- Public website: `http://localhost:3000`
- Admin portal: `http://localhost:3000/admin`

---

## 🚢 Vercel Deployment

1. Push your repository to GitHub / GitLab.
2. Import the project in [Vercel](https://vercel.com).
3. Add the environment variables from `.env.local`.
4. Deploy!
