-- 20260412_fix_rls_policies.sql

-- ลบ policy เก่าที่อ่อนแอ
DROP POLICY IF EXISTS "Anyone can insert flowers" ON public.flowers;
DROP POLICY IF EXISTS "Anyone can update flowers" ON public.flowers;
DROP POLICY IF EXISTS "Anyone can delete flowers" ON public.flowers;

DROP POLICY IF EXISTS "Anyone can upload flower images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update flower images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete flower images" ON storage.objects;

-- สร้าง policy ใหม่ที่เช็ค auth
CREATE POLICY "Only authenticated can insert flowers"
  ON public.flowers FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated can update flowers"
  ON public.flowers FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated can delete flowers"
  ON public.flowers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated can upload flower images"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'flower-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Only authenticated can update flower images"
  ON storage.objects FOR UPDATE USING (
    bucket_id = 'flower-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Only authenticated can delete flower images"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'flower-images' AND auth.role() = 'authenticated'
  );