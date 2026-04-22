# 🗄️ Supabase Setup Guide

## Step 1: สร้าง Project

1. ไปที่ **https://supabase.com** → Sign in ด้วย GitHub
2. คลิก **"New project"**
   - Name: `FlowerDex`
   - Database Password: ตั้งรหัสผ่านที่แข็งแกร่ง (จดไว้)
   - Region: **Southeast Asia (Singapore)**
3. รอประมาณ 2 นาที

---

## Step 2: สร้าง Database Schema

ไปที่ **SQL Editor** → วาง SQL ต่อไปนี้แล้วกด **Run**:

```sql
-- ── Table: flowers ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.flowers (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug             text UNIQUE NOT NULL,
  name_en          text NOT NULL,
  name_th          text NOT NULL,
  description      text NOT NULL DEFAULT '',
  colors           text[] NOT NULL DEFAULT '{}',
  season           text NOT NULL DEFAULT '',
  meaning          text NOT NULL DEFAULT '',
  image_url        text,
  image_color      text,
  care_watering    text,
  care_sunlight    text,
  care_soil        text,
  care_temperature text,
  created_at       timestamptz DEFAULT now() NOT NULL,
  updated_at       timestamptz DEFAULT now() NOT NULL
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER flowers_updated_at
  BEFORE UPDATE ON public.flowers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────────
ALTER TABLE public.flowers ENABLE ROW LEVEL SECURITY;

-- ทุกคนอ่านได้
CREATE POLICY "Public can read flowers"
  ON public.flowers FOR SELECT
  USING (true);

-- เฉพาะ authenticated users แก้ไขได้
CREATE POLICY "Authenticated can insert"
  ON public.flowers FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update"
  ON public.flowers FOR UPDATE
  TO authenticated USING (true);

CREATE POLICY "Authenticated can delete"
  ON public.flowers FOR DELETE
  TO authenticated USING (true);
```

---

## Step 3: สร้าง Storage Bucket

ไปที่ **Storage** → คลิก **"New bucket"**:
- Name: `flower-images`
- ✅ Public bucket

จากนั้นไปที่ **SQL Editor** อีกครั้ง รัน:

```sql
CREATE POLICY "Public read flower images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'flower-images');

CREATE POLICY "Authenticated upload flower images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'flower-images');

CREATE POLICY "Authenticated delete flower images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'flower-images');
```

---

## Step 4: Seed ข้อมูลดอกไม้เริ่มต้น (15 ชนิด)

รัน SQL นี้ใน **SQL Editor**:

```sql
INSERT INTO public.flowers
  (slug, name_en, name_th, description, colors, season, meaning, image_color,
   care_watering, care_sunlight, care_soil, care_temperature)
VALUES
('golden-shower','Golden Shower','ดอกราชพฤกษ์',
 'ราชพฤกษ์เป็นดอกไม้ประจำชาติไทย มีช่อดอกสีเหลืองทองห้อยระย้าสวยงาม บานในช่วงฤดูร้อน',
 ARRAY['เหลือง','ทอง'],'ดอกไม้ฤดูร้อน','ความรุ่งเรือง, ความสง่างาม','เหลือง',
 'รดน้ำปานกลาง สัปดาห์ละ 2-3 ครั้ง','แดดจัด 6-8 ชม./วัน','ดินร่วนระบายน้ำดี','25-35°C'),

('peony','Peony','ดอกพีโอนี',
 'พีโอนีเป็นดอกไม้ที่มีกลีบซ้อนหลายชั้นสวยงาม นิยมใช้ในงานแต่งงานและการตกแต่ง',
 ARRAY['ชมพู','แดง','ขาว'],'ดอกไม้ฤดูหนาว','ความรัก, ความมั่งคั่ง, เกียรติยศ','ชมพู',
 'รดน้ำสม่ำเสมอ อย่าให้ดินแฉะ','แดดรำไร 4-6 ชม./วัน','ดินร่วนผสมปุ๋ยหมัก','15-25°C'),

('gazania','Gazania','ดอกกาซาเนีย',
 'กาซาเนียมีดอกที่มีลวดลายสีสันสวยงาม ดอกจะปิดในตอนกลางคืนและเปิดในตอนกลางวัน',
 ARRAY['เหลือง','ส้ม','แดง'],'ดอกไม้ฤดูร้อน','ความสดใส, ความร่าเริง','เหลือง',
 'รดน้ำน้อย ทนแล้ง','แดดจัดเต็มวัน','ดินทรายระบายน้ำดี','15-25°C'),

('lily','Lily','ดอกลิลลี่',
 'ลิลลี่มีดอกขนาดใหญ่และหลากหลายสีสัน มักใช้ในงานแต่งงานและพิธีการต่างๆ',
 ARRAY['ขาว','ชมพู','ส้ม','เหลือง'],'ดอกไม้ฤดูหนาว','ความบริสุทธิ์, ความมั่งคั่ง, ความสง่างาม','ขาว',
 'รดน้ำสม่ำเสมอ ดินชื้นพอดี','แดดรำไร 4-6 ชม./วัน','ดินร่วนผสมปุ๋ย','15-25°C'),

('hydrangea','Hydrangea','ดอกไฮเดรนเยีย',
 'ไฮเดรนเยียมีช่อดอกขนาดใหญ่ สีสันเปลี่ยนไปตาม pH ของดิน เป็นดอกไม้ที่นิยมในปัจจุบัน',
 ARRAY['ชมพู','น้ำเงิน','ม่วง','ขาว'],'ดอกไม้ฤดูหนาว','ความรู้สึก, การขอบคุณ, ความจริงใจ','ชมพู',
 'รดน้ำบ่อย ดินชื้นอยู่เสมอ','แดดรำไร 3-5 ชม./วัน','ดินร่วนผสมกรด pH 5.5-6.5','15-22°C'),

('gerbera','Gerbera','ดอกเยอบีร่า',
 'เยอบีร่ามีดอกขนาดใหญ่สีสันสดใส เป็นดอกไม้ยอดนิยมในการตัดดอก',
 ARRAY['แดง','ชมพู','ส้ม','เหลือง','ขาว'],'ดอกไม้ฤดูใบไม้ผลิ','ความสุข, ความร่าเริง, ความบริสุทธิ์','แดง',
 'รดน้ำพอดี ไม่ให้ดินแฉะ','แดดจัด 6+ ชม./วัน','ดินร่วนระบายน้ำดี','18-28°C'),

('bird-of-paradise','Bird of Paradise','ดอกสเตรลิตเซีย',
 'สเตรลิตเซียหรือดอกนกสวรรค์มีรูปทรงคล้ายนกบิน สีส้มและน้ำเงินตัดกันอย่างสวยงาม',
 ARRAY['ส้ม','น้ำเงิน'],'ดอกไม้ฤดูร้อน','อิสระ, ความสนุกสนาน, ความหรูหรา','ส้ม',
 'รดน้ำสม่ำเสมอ ดินชื้นพอดี','แดดจัด 6+ ชม./วัน','ดินร่วนระบายน้ำดี','18-30°C'),

('jasmine','Jasmine','ดอกมะลิ',
 'มะลิเป็นดอกไม้ที่มีกลิ่นหอมเป็นเอกลักษณ์ ใช้ในพิธีกรรมและเป็นสัญลักษณ์ของแม่',
 ARRAY['ขาว'],'ดอกไม้ฤดูร้อน','ความรัก, ความบริสุทธิ์, มิตรภาพ','ขาว',
 'รดน้ำสม่ำเสมอ','แดดรำไร 4-6 ชม./วัน','ดินร่วนระบายน้ำดี','25-35°C'),

('sunflower','Sunflower','ดอกทานตะวัน',
 'ทานตะวันเป็นดอกไม้ขนาดใหญ่ที่หันหน้าตามดวงอาทิตย์ สีเหลืองสดใสเป็นสัญลักษณ์แห่งความสุข',
 ARRAY['เหลือง'],'ดอกไม้ฤดูหนาว','ความซื่อสัตย์, ความชื่นชม','เหลือง',
 'รดน้ำปานกลาง 2-3 ครั้ง/สัปดาห์','แดดจัดเต็มวัน 8+ ชม.','ดินร่วนทุกชนิด','20-30°C'),

('siam-tulip','Siam Tulip','ดอกกระเจียว',
 'กระเจียวเป็นดอกไม้พื้นเมืองของไทย บานในฤดูฝน มีสีชมพูม่วงสวยงาม พบมากที่ทุ่งดอกกระเจียว จ.ชัยภูมิ',
 ARRAY['ชมพู','ม่วง'],'ดอกไม้ฤดูฝน','ความงดงาม, ความอ่อนโยน','ชมพู',
 'รดน้ำบ่อย ชอบความชื้นสูง','แดดรำไร 3-5 ชม./วัน','ดินร่วนชื้น','22-30°C'),

('rose','Rose','ดอกกุหลาบ',
 'กุหลาบเป็นราชินีแห่งดอกไม้ มีหลากหลายสีและพันธุ์ เป็นสัญลักษณ์แห่งความรัก',
 ARRAY['แดง','ชมพู','ขาว','เหลือง','ส้ม','ม่วง','น้ำเงิน'],'ตลอดปี','ความรัก, ความงาม, ความหลงใหล','น้ำเงิน',
 'รดน้ำทุกวัน เช้าหรือเย็น','แดด 6+ ชม./วัน','ดินร่วนผสมปุ๋ยหมัก pH 6-6.5','18-28°C'),

('orchid','Orchid','ดอกกล้วยไม้',
 'กล้วยไม้เป็นดอกไม้ที่มีความหลากหลายมากที่สุดในโลก ไทยมีกล้วยไม้พื้นเมืองมากมาย',
 ARRAY['ม่วง','ขาว','ชมพู','เหลือง'],'ตลอดปี','ความสวยงาม, ความหรูหรา, ความรัก','ม่วง',
 'รดน้ำวันเว้นวัน ให้แห้งก่อนรดใหม่','แสงสว่างรำไร ไม่โดนแดดตรง','เครื่องปลูกกล้วยไม้ (ถ่าน, กาบมะพร้าว)','20-30°C'),

('lotus','Lotus','ดอกบัว',
 'บัวเป็นดอกไม้ศักดิ์สิทธิ์ในศาสนาพุทธ ผุดพ้นจากโคลนตมแต่สะอาดบริสุทธิ์',
 ARRAY['ชมพู','ขาว'],'ดอกไม้ฤดูฝน','ความบริสุทธิ์, การตื่นรู้, ศรัทธา','ชมพู',
 'ปลูกในน้ำ ระดับน้ำ 15-30 ซม.','แดดจัด 6+ ชม./วัน','ดินเหนียวก้นบ่อ','25-35°C'),

('plumeria','Plumeria','ดอกลีลาวดี',
 'ลีลาวดี (ลั่นทม) มีกลิ่นหอม กลีบดอกหนาเป็นมัน สีสันหลากหลาย นิยมปลูกเป็นไม้ประดับ',
 ARRAY['ขาว','เหลือง','ชมพู','แดง'],'ดอกไม้ฤดูร้อน','ความงดงาม, การเริ่มต้นใหม่','ขาว',
 'รดน้ำน้อย ทนแล้งได้ดี','แดดจัด 6-8 ชม./วัน','ดินร่วนทรายระบายน้ำดี','25-35°C'),

('marigold','Marigold','ดอกดาวเรือง',
 'ดาวเรืองเป็นดอกไม้มงคลของไทย สีเหลืองทองสดใส นิยมใช้ในพิธีไหว้และงานมงคล',
 ARRAY['เหลือง','ส้ม'],'ดอกไม้ฤดูหนาว','ความรุ่งเรือง, ความเจริญ','เหลือง',
 'รดน้ำปานกลาง วันละ 1 ครั้ง','แดดจัด 6+ ชม./วัน','ดินร่วนทั่วไป','20-30°C')

ON CONFLICT (slug) DO NOTHING;
```

---

## Step 5: คัดลอก API Keys

ไปที่ **Project Settings** (ไอคอนเฟืองล่างสุด) → **API**:

| ค่า | นำไปใส่ใน |
|-----|-----------|
| Project URL | `VITE_SUPABASE_URL` |
| anon/public key | `VITE_SUPABASE_PUBLISHABLE_KEY` |

---

## Step 6: สร้าง Admin User

**Authentication** → **Users** → **"Add user"** → **"Create new user"**:
- Email: `admin@yourdomain.com`
- Password: อย่างน้อย 8 ตัวอักษร
- ✅ Auto Confirm User

---

## Step 7: (Optional) Perenual API สำหรับข้อมูลการดูแลดอกไม้

1. สมัครฟรีที่ https://perenual.com/api
2. นำ API key ไปใส่ใน `VITE_PERENUAL_API_KEY`
3. ระบบจะดึงข้อมูล care เฉพาะดอกที่ยังไม่มีใน Supabase และ cache ใน sessionStorage

> **หมายเหตุ:** ถ้าไม่ใส่ key ระบบยังทำงานได้ปกติ จะใช้ข้อมูล care จาก Supabase แทน

---

## Security Architecture

```
Browser
  ├── Public routes (/, /favorites)  → ทุกคนเข้าได้
  ├── /login                          → หน้า login
  └── /admin → ProtectedRoute         → redirect /login ถ้าไม่ได้ login
                      │
                      ▼
               Supabase Auth (JWT)
                      │
                      ▼
               Database RLS
               ├── SELECT  → ทุกคน
               ├── INSERT  → authenticated only
               ├── UPDATE  → authenticated only
               └── DELETE  → authenticated only
```

**Double protection:** Frontend guard (ProtectedRoute) + Database RLS
ถึงแม้จะ bypass frontend ได้ ก็ยังแก้ไขข้อมูลใน DB ไม่ได้
