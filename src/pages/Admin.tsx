import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useFlowers } from "@/hooks/useFlowers";
import { CATEGORIES, COLOR_LIST } from "@/data/flowers";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Loader2, Pencil, X, Check, Sparkles } from "lucide-react";
import AutofillInput from "@/components/admin/AutofillInput";
import { autofillFromSpecies, isApiKeySet, type PerenualSpecies } from "@/lib/perenual";

const emptyForm = {
  slug: "", name_en: "", name_th: "", description: "",
  colors: [] as string[], season: "", meaning: "", image_color: "",
  care_watering: "", care_sunlight: "", care_soil: "", care_temperature: "",
};
type FormState = typeof emptyForm;

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground font-sarabun text-sm focus:ring-2 focus:ring-ring focus:outline-none";

const Admin = () => {
  const { data: flowers = [], isLoading } = useFlowers();
  const queryClient = useQueryClient();

  // Add form
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [autofillImageUrl, setAutofillImageUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [autofilling, setAutofilling] = useState(false);

  // Edit state
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleting, setDeleting] = useState<string | null>(null);

  const seasons = CATEGORIES.filter(
    (c) => c !== "ดอกไม้ประจำชาติ" && c !== "ดอกไม้ประจำจังหวัด"
  );

  // ── Autofill ─────────────────────────────────────────────────────────────
  const handleAutofill = useCallback(async (species: PerenualSpecies) => {
    setAutofilling(true);
    try {
      const result = await autofillFromSpecies(species);
      setForm((prev) => ({
        ...prev,
        slug: result.slug,
        name_en: result.name_en,
        name_th: result.name_th || prev.name_th,
        description: result.description || prev.description,
        colors: result.colors.length > 0 ? result.colors : prev.colors,
        image_color: result.image_color || prev.image_color,
        season: result.season || prev.season,
        meaning: result.meaning || prev.meaning,
        care_watering: result.care_watering || prev.care_watering,
        care_sunlight: result.care_sunlight || prev.care_sunlight,
        care_soil: result.care_soil || prev.care_soil,
        care_temperature: result.care_temperature || prev.care_temperature,
      }));
      if (result.imageUrl) {
        setAutofillImageUrl(result.imageUrl);
        setImageFile(null);
      }
      toast.success("✨ Autofill สำเร็จ — ข้อมูลทั้งหมดถูกเติมให้อัตโนมัติ");
    } catch {
      toast.error("Autofill ล้มเหลว");
    } finally {
      setAutofilling(false);
    }
  }, []);

  // ── Color toggle ─────────────────────────────────────────────────────────
  const toggleColor = (color: string, setter: React.Dispatch<React.SetStateAction<FormState>>) =>
    setter((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug || !form.name_en || !form.name_th || !form.description || !form.season || !form.meaning) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบ");
      return;
    }
    setSubmitting(true);
    try {
      let image_url: string | null = null;

      if (imageFile) {
        // Manual upload takes priority
        const ext = imageFile.name.split(".").pop();
        const path = `${form.slug}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("flower-images")
          .upload(path, imageFile, { upsert: true });
        if (uploadError) throw uploadError;
        image_url = supabase.storage.from("flower-images").getPublicUrl(path).data.publicUrl;
      } else if (autofillImageUrl) {
        // Use Perenual image URL directly
        image_url = autofillImageUrl;
      }

      const { error } = await supabase.from("flowers").insert({
        slug: form.slug, name_en: form.name_en, name_th: form.name_th,
        description: form.description, colors: form.colors, season: form.season,
        meaning: form.meaning, image_url, image_color: form.image_color || null,
        care_watering: form.care_watering || null, care_sunlight: form.care_sunlight || null,
        care_soil: form.care_soil || null, care_temperature: form.care_temperature || null,
      });
      if (error) throw error;

      toast.success(`เพิ่ม "${form.name_th}" สำเร็จ!`);
      setForm(emptyForm);
      setImageFile(null);
      setAutofillImageUrl("");
      queryClient.invalidateQueries({ queryKey: ["flowers"] });
    } catch (err: any) {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async (slug: string) => {
    if (!confirm("ต้องการลบดอกไม้นี้จริงหรือไม่?")) return;
    setDeleting(slug);
    try {
      const { error } = await supabase.from("flowers").delete().eq("slug", slug);
      if (error) throw error;
      toast.success("ลบสำเร็จ");
      queryClient.invalidateQueries({ queryKey: ["flowers"] });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(null);
    }
  };

  // ── Edit ─────────────────────────────────────────────────────────────────
  const handleStartEdit = (f: typeof flowers[0]) => {
    setEditingSlug(f.id);
    setEditForm({
      slug: f.id, name_en: f.nameEn, name_th: f.nameTh,
      description: f.description, colors: [...f.colors],
      season: f.season, meaning: f.meaning, image_color: f.imageColor ?? "",
      care_watering: f.care?.watering ?? "", care_sunlight: f.care?.sunlight ?? "",
      care_soil: f.care?.soil ?? "", care_temperature: f.care?.temperature ?? "",
    });
    setEditImageFile(null);
  };

  const handleSaveEdit = async (slug: string) => {
    if (!editForm.name_en || !editForm.name_th || !editForm.description || !editForm.season || !editForm.meaning) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบ"); return;
    }
    setSaving(true);
    try {
      let image_url: string | undefined;
      if (editImageFile) {
        const ext = editImageFile.name.split(".").pop();
        const path = `${slug}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("flower-images").upload(path, editImageFile, { upsert: true });
        if (uploadError) throw uploadError;
        image_url = supabase.storage.from("flower-images").getPublicUrl(path).data.publicUrl;
      }
      const { error } = await supabase.from("flowers").update({
        name_en: editForm.name_en, name_th: editForm.name_th,
        description: editForm.description, colors: editForm.colors,
        season: editForm.season, meaning: editForm.meaning,
        image_color: editForm.image_color || null,
        care_watering: editForm.care_watering || null, care_sunlight: editForm.care_sunlight || null,
        care_soil: editForm.care_soil || null, care_temperature: editForm.care_temperature || null,
        ...(image_url ? { image_url } : {}),
      }).eq("slug", slug);
      if (error) throw error;
      toast.success(`แก้ไข "${editForm.name_th}" สำเร็จ!`);
      setEditingSlug(null);
      queryClient.invalidateQueries({ queryKey: ["flowers"] });
    } catch (err: any) {
      toast.error(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  // ── Render helpers ───────────────────────────────────────────────────────
  const ColorPicker = ({ colors, onToggle }: { colors: string[]; onToggle: (c: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {COLOR_LIST.map((color) => (
        <button key={color} type="button" onClick={() => onToggle(color)}
          className={`font-sarabun text-xs px-3 py-1 rounded-full border transition-colors ${
            colors.includes(color)
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:bg-muted"
          }`}>
          {color}
        </button>
      ))}
    </div>
  );

  const AutofillBadge = ({ text }: { text: string }) =>
    text ? <span className="text-xs text-primary ml-1">✓ {text}</span> : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-center font-kanit font-bold text-2xl text-foreground mb-8">
          🛠️ จัดการข้อมูลดอกไม้
        </h2>

        {/* ── Add form ─────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 mb-10 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-kanit font-semibold text-lg text-foreground">เพิ่มดอกไม้ใหม่</h3>
            <span className="flex items-center gap-1.5 text-xs text-primary font-sarabun bg-primary/10 px-3 py-1 rounded-full">
              <Sparkles size={12} /> Autofill จาก Perenual API
            </span>
          </div>

          {!isApiKeySet() && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <span className="text-sm">⚠️</span>
              <span className="font-sarabun text-sm text-destructive">
                ยังไม่ได้ตั้ง VITE_PERENUAL_API_KEY — Autofill จะไม่ทำงาน
              </span>
            </div>
          )}

          {autofilling && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <Loader2 size={14} className="animate-spin text-primary" />
              <span className="font-sarabun text-sm text-primary">กำลังดึงข้อมูลจาก Perenual...</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-sarabun text-sm text-foreground block mb-1">Slug *</label>
              <input type="text" value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s/g, "-") })}
                className={inputCls} placeholder="auto-generated from autofill" />
            </div>

            {/* Autofill input — supports Thai & English */}
            <AutofillInput
              value={form.name_en}
              onChange={(val) => setForm({ ...form, name_en: val })}
              onSelect={handleAutofill}
              className={inputCls}
              placeholder="e.g. Rose หรือ กุหลาบ"
              label="ชื่อดอกไม้ (ไทย/อังกฤษ) *"
            />

            <div>
              <label className="font-sarabun text-sm text-foreground block mb-1">
                ชื่อไทย * <AutofillBadge text={form.name_th ? "Autofill" : ""} />
              </label>
              <input type="text" value={form.name_th}
                onChange={(e) => setForm({ ...form, name_th: e.target.value })}
                className={inputCls} placeholder="e.g. ดอกกุหลาบ" />
            </div>
            <div>
              <label className="font-sarabun text-sm text-foreground block mb-1">ฤดูกาล *</label>
              <select value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} className={inputCls}>
                <option value="">เลือกฤดูกาล</option>
                {seasons.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="font-sarabun text-sm text-foreground block mb-1">
              คำอธิบาย * <AutofillBadge text={form.description ? "Autofill" : ""} />
            </label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} className={inputCls + " resize-none"} placeholder="คำอธิบายดอกไม้..." />
          </div>

          <div>
            <label className="font-sarabun text-sm text-foreground block mb-1">ความหมาย *</label>
            <input type="text" value={form.meaning} onChange={(e) => setForm({ ...form, meaning: e.target.value })}
              className={inputCls} placeholder="e.g. ความรัก, ความหวัง" />
          </div>

          <div>
            <label className="font-sarabun text-sm text-foreground block mb-2">
              สีของดอกไม้ <AutofillBadge text={form.colors.length > 0 ? "Autofill" : ""} />
            </label>
            <ColorPicker colors={form.colors} onToggle={(c) => toggleColor(c, setForm)} />
          </div>

          <div>
            <label className="font-sarabun text-sm text-foreground block mb-1">สีหลักของรูป</label>
            <select value={form.image_color} onChange={(e) => setForm({ ...form, image_color: e.target.value })} className={inputCls}>
              <option value="">เลือกสีหลักของรูป</option>
              {COLOR_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Image: autofill preview or manual upload */}
          <div>
            <label className="font-sarabun text-sm text-foreground block mb-1">
              รูปภาพดอกไม้ <AutofillBadge text={autofillImageUrl ? "Autofill" : ""} />
            </label>
            {autofillImageUrl && !imageFile && (
              <div className="mb-2 flex items-center gap-3">
                <img src={autofillImageUrl} alt="autofill preview" className="w-20 h-20 rounded-lg object-cover border border-border" />
                <div>
                  <p className="font-sarabun text-xs text-muted-foreground">รูปจาก Perenual API</p>
                  <button type="button" onClick={() => setAutofillImageUrl("")}
                    className="font-sarabun text-xs text-destructive hover:underline mt-1">ลบรูป Autofill</button>
                </div>
              </div>
            )}
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border bg-muted cursor-pointer hover:bg-secondary transition-colors w-fit">
              <Upload size={16} className="text-muted-foreground" />
              <span className="font-sarabun text-sm text-muted-foreground">
                {imageFile ? imageFile.name : "อัปโหลดรูปเอง (จะแทนที่รูป Autofill)"}
              </span>
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>

          <details className="border border-border rounded-lg p-4">
            <summary className="font-kanit text-sm text-foreground cursor-pointer">
              🌱 ข้อมูลการดูแล (ไม่บังคับ)
              <AutofillBadge text={form.care_watering || form.care_sunlight ? "Autofill" : ""} />
            </summary>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <input type="text" placeholder="การรดน้ำ" value={form.care_watering}
                onChange={(e) => setForm({ ...form, care_watering: e.target.value })} className={inputCls} />
              <input type="text" placeholder="แสงแดด" value={form.care_sunlight}
                onChange={(e) => setForm({ ...form, care_sunlight: e.target.value })} className={inputCls} />
              <input type="text" placeholder="ดิน" value={form.care_soil}
                onChange={(e) => setForm({ ...form, care_soil: e.target.value })} className={inputCls} />
              <input type="text" placeholder="อุณหภูมิ" value={form.care_temperature}
                onChange={(e) => setForm({ ...form, care_temperature: e.target.value })} className={inputCls} />
            </div>
          </details>

          <button type="submit" disabled={submitting || autofilling}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-kanit text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {submitting ? "กำลังเพิ่ม..." : "เพิ่มดอกไม้"}
          </button>
        </form>

        {/* ── Flower list ───────────────────────────────────────────────────── */}
        <h3 className="font-kanit font-semibold text-lg text-foreground mb-4">
          ดอกไม้ทั้งหมด ({flowers.length} รายการ)
        </h3>

        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 size={24} className="animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-2">
            {flowers.map((f) => (
              <div key={f.id} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 p-3">
                  {f.imageUrl && (
                    <img src={f.imageUrl} alt={f.nameTh} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-kanit text-sm text-foreground truncate">{f.nameEn} ({f.nameTh})</p>
                    <p className="font-sarabun text-xs text-muted-foreground">{f.season} · {f.colors.join(", ")}</p>
                  </div>
                  <button onClick={() => editingSlug === f.id ? setEditingSlug(null) : handleStartEdit(f)}
                    className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors">
                    {editingSlug === f.id ? <X size={16} /> : <Pencil size={16} />}
                  </button>
                  <button onClick={() => handleDelete(f.id)} disabled={deleting === f.id}
                    className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50">
                    {deleting === f.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>

                {/* Edit panel */}
                {editingSlug === f.id && (
                  <div className="border-t border-border p-4 space-y-3 bg-muted/30">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-sarabun text-xs text-muted-foreground block mb-1">ชื่ออังกฤษ *</label>
                        <input type="text" value={editForm.name_en} onChange={(e) => setEditForm({ ...editForm, name_en: e.target.value })} className={inputCls} />
                      </div>
                      <div>
                        <label className="font-sarabun text-xs text-muted-foreground block mb-1">ชื่อไทย *</label>
                        <input type="text" value={editForm.name_th} onChange={(e) => setEditForm({ ...editForm, name_th: e.target.value })} className={inputCls} />
                      </div>
                      <div>
                        <label className="font-sarabun text-xs text-muted-foreground block mb-1">ฤดูกาล *</label>
                        <select value={editForm.season} onChange={(e) => setEditForm({ ...editForm, season: e.target.value })} className={inputCls}>
                          <option value="">เลือกฤดูกาล</option>
                          {seasons.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="font-sarabun text-xs text-muted-foreground block mb-1">ความหมาย *</label>
                        <input type="text" value={editForm.meaning} onChange={(e) => setEditForm({ ...editForm, meaning: e.target.value })} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className="font-sarabun text-xs text-muted-foreground block mb-1">คำอธิบาย *</label>
                      <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={2} className={inputCls + " resize-none"} />
                    </div>
                    <div>
                      <label className="font-sarabun text-xs text-muted-foreground block mb-2">สีของดอกไม้</label>
                      <ColorPicker colors={editForm.colors} onToggle={(c) => toggleColor(c, setEditForm)} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-sarabun text-xs text-muted-foreground block mb-1">สีหลักของรูป</label>
                        <select value={editForm.image_color} onChange={(e) => setEditForm({ ...editForm, image_color: e.target.value })} className={inputCls}>
                          <option value="">เลือกสีหลักของรูป</option>
                          {COLOR_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="font-sarabun text-xs text-muted-foreground block mb-1">เปลี่ยนรูปภาพ</label>
                        <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border bg-background cursor-pointer hover:bg-muted transition-colors">
                          <Upload size={14} className="text-muted-foreground" />
                          <span className="font-sarabun text-xs text-muted-foreground">{editImageFile ? editImageFile.name : "เลือกรูปใหม่..."}</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => setEditImageFile(e.target.files?.[0] ?? null)} />
                        </label>
                      </div>
                    </div>
                    <details className="border border-border rounded-lg p-3">
                      <summary className="font-kanit text-xs text-foreground cursor-pointer">🌱 ข้อมูลการดูแล</summary>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <input type="text" placeholder="การรดน้ำ" value={editForm.care_watering} onChange={(e) => setEditForm({ ...editForm, care_watering: e.target.value })} className={inputCls} />
                        <input type="text" placeholder="แสงแดด" value={editForm.care_sunlight} onChange={(e) => setEditForm({ ...editForm, care_sunlight: e.target.value })} className={inputCls} />
                        <input type="text" placeholder="ดิน" value={editForm.care_soil} onChange={(e) => setEditForm({ ...editForm, care_soil: e.target.value })} className={inputCls} />
                        <input type="text" placeholder="อุณหภูมิ" value={editForm.care_temperature} onChange={(e) => setEditForm({ ...editForm, care_temperature: e.target.value })} className={inputCls} />
                      </div>
                    </details>
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setEditingSlug(null)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-foreground font-sarabun text-sm hover:bg-muted transition-colors">
                        <X size={14} /> ยกเลิก
                      </button>
                      <button type="button" onClick={() => handleSaveEdit(f.id)} disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-sarabun text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                        {saving ? "กำลังบันทึก..." : "บันทึก"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
