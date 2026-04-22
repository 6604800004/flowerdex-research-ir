import goldenShowerImg from "@/assets/flowers/golden-shower.jpg";
import peonyImg from "@/assets/flowers/peony.jpg";
import gazaniaImg from "@/assets/flowers/gazania.jpg";
import lilyImg from "@/assets/flowers/lily.jpg";
import hydrangeaImg from "@/assets/flowers/hydrangea.jpg";
import gerberaImg from "@/assets/flowers/gerbera.jpg";
import birdOfParadiseImg from "@/assets/flowers/bird-of-paradise.jpg";
import jasmineImg from "@/assets/flowers/jasmine.jpg";
import sunflowerImg from "@/assets/flowers/sunflower.jpg";
import siamTulipImg from "@/assets/flowers/siam-tulip.jpg";
import roseImg from "@/assets/flowers/rose.jpg";
import orchidImg from "@/assets/flowers/orchid.jpg";
import lotusImg from "@/assets/flowers/lotus.jpg";
import plumeriaImg from "@/assets/flowers/plumeria.jpg";
import marigoldImg from "@/assets/flowers/marigold.jpg";

export interface Flower {
  id: string;
  nameEn: string;
  nameTh: string;
  description: string;
  colors: string[];
  season: string;
  meaning: string;
  imageUrl: string;
  imageColor: string;
  care?: {
    watering: string;
    sunlight: string;
    soil: string;
    temperature: string;
  };
}

export const FLOWERS: Flower[] = [
  {
    id: "golden-shower",
    nameEn: "Golden Shower",
    nameTh: "ดอกราชพฤกษ์",
    description: "ราชพฤกษ์เป็นดอกไม้ประจำชาติไทย มีช่อดอกสีเหลืองทองห้อยระย้าสวยงาม บานในช่วงฤดูร้อน",
    colors: ["เหลือง", "ทอง"],
    season: "ดอกไม้ฤดูร้อน",
    meaning: "ความรุ่งเรือง, ความสง่างาม",
    imageUrl: goldenShowerImg,
    imageColor: "เหลือง",
    care: { watering: "รดน้ำปานกลาง สัปดาห์ละ 2-3 ครั้ง", sunlight: "แดดจัด 6-8 ชม./วัน", soil: "ดินร่วนระบายน้ำดี", temperature: "25-35°C" },
  },
  {
    id: "peony",
    nameEn: "Peony",
    nameTh: "ดอกพีโอนี",
    description: "พีโอนีเป็นดอกไม้ที่มีกลีบซ้อนหลายชั้นสวยงาม นิยมใช้ในงานแต่งงานและการตกแต่ง",
    colors: ["ชมพู", "แดง", "ขาว"],
    season: "ดอกไม้ฤดูหนาว",
    meaning: "ความรัก, ความมั่งคั่ง, เกียรติยศ",
    imageUrl: peonyImg,
    imageColor: "ชมพู",
    care: { watering: "รดน้ำสม่ำเสมอ อย่าให้ดินแฉะ", sunlight: "แดดรำไร 4-6 ชม./วัน", soil: "ดินร่วนผสมปุ๋ยหมัก", temperature: "15-25°C" },
  },
  {
    id: "gazania",
    nameEn: "Gazania",
    nameTh: "ดอกกาซาเนีย",
    description: "กาซาเนียเป็นดอกไม้ที่มีสีสันสดใส กลีบดอกมีลวดลายหลากหลาย นิยมปลูกประดับสวนและทนแดดได้ดี",
    colors: ["เหลือง", "ส้ม", "แดง", "ชมพู", "ขาว"],
    season: "ดอกไม้ฤดูร้อน",
    meaning: "ความสดใส, ความร่าเริง, ความสุข",
    imageUrl: gazaniaImg,
    imageColor: "ส้ม",
    care: { watering: "รดน้ำน้อย ทนแล้งได้ดี", sunlight: "แดดจัด 6-8 ชม./วัน", soil: "ดินทรายระบายน้ำดี", temperature: "20-35°C" },
  },
  {
    id: "lily",
    nameEn: "Lily",
    nameTh: "ดอกลิลลี่",
    description: "ลิลลี่เป็นดอกไม้ที่มีกลิ่นหอม กลีบดอกใหญ่สง่างาม นิยมใช้ในพิธีการและการตกแต่ง",
    colors: ["ขาว", "ชมพู", "เหลือง", "ส้ม"],
    season: "ดอกไม้ฤดูร้อน",
    meaning: "ความบริสุทธิ์, ความสง่างาม",
    imageUrl: lilyImg,
    imageColor: "ขาว",
    care: { watering: "รดน้ำสม่ำเสมอ 2-3 ครั้ง/สัปดาห์", sunlight: "แดดรำไร 4-6 ชม./วัน", soil: "ดินร่วนระบายน้ำดี pH 6-6.5", temperature: "18-28°C" },
  },
  {
    id: "hydrangea",
    nameEn: "Hydrangea",
    nameTh: "ไฮเดรนเยีย",
    description: "ไฮเดรนเยียมีช่อดอกทรงกลมขนาดใหญ่ สีสันเปลี่ยนตามค่า pH ของดิน นิยมปลูกในที่ร่ม",
    colors: ["ม่วง", "ฟ้า", "ชมพู", "ขาว"],
    season: "ดอกไม้ฤดูฝน",
    meaning: "ความกตัญญู, ความอดทน",
    imageUrl: hydrangeaImg,
    imageColor: "ม่วง",
    care: { watering: "รดน้ำบ่อย ชอบความชื้น", sunlight: "แดดรำไร ไม่ชอบแดดจัด", soil: "ดินเปรี้ยว pH 5.5 ให้สีฟ้า ดินด่างให้สีชมพู", temperature: "15-25°C" },
  },
  {
    id: "gerbera",
    nameEn: "Gerbera",
    nameTh: "ดอกเยอบีร่า",
    description: "เยอบีร่ามีดอกขนาดใหญ่สีสันสดใส คล้ายดอกเดซี่ นิยมใช้จัดช่อดอกไม้",
    colors: ["ชมพู", "แดง", "เหลือง", "ส้ม", "ขาว"],
    season: "ตลอดปี",
    meaning: "ความสุข, ความร่าเริง",
    imageUrl: gerberaImg,
    imageColor: "ชมพู",
    care: { watering: "รดน้ำปานกลาง อย่าให้โดนใบ", sunlight: "แดดอ่อน 4-6 ชม./วัน", soil: "ดินร่วนผสมทราย", temperature: "20-30°C" },
  },
  {
    id: "bird-of-paradise",
    nameEn: "Bird of Paradise",
    nameTh: "ปักษาสวรรค์",
    description: "ปักษาสวรรค์มีรูปทรงคล้ายนกที่กำลังบิน สีส้มและน้ำเงินโดดเด่น เป็นดอกไม้เขตร้อน",
    colors: ["ส้ม", "น้ำเงิน"],
    season: "ดอกไม้ฤดูร้อน",
    meaning: "ความอิสระ, ความสวยงาม, สวรรค์",
    imageUrl: birdOfParadiseImg,
    imageColor: "ส้ม",
    care: { watering: "รดน้ำปานกลาง ชอบความชื้น", sunlight: "แดดจัด 6+ ชม./วัน", soil: "ดินร่วนอุดมสมบูรณ์", temperature: "25-35°C" },
  },
  {
    id: "jasmine",
    nameEn: "Jasmine",
    nameTh: "ดอกมะลิ",
    description: "มะลิเป็นดอกไม้ประจำวันแม่ของไทย มีกลิ่นหอมละมุน ดอกสีขาวบริสุทธิ์",
    colors: ["ขาว"],
    season: "ตลอดปี",
    meaning: "ความรักของแม่, ความบริสุทธิ์",
    imageUrl: jasmineImg,
    imageColor: "ขาว",
    care: { watering: "รดน้ำทุกวัน ชอบความชื้น", sunlight: "แดดจัด 6-8 ชม./วัน", soil: "ดินร่วนร่วนทราย", temperature: "25-35°C" },
  },
  {
    id: "sunflower",
    nameEn: "Sunflower",
    nameTh: "ดอกทานตะวัน",
    description: "ทานตะวันเป็นดอกไม้ขนาดใหญ่ที่หันหน้าตามดวงอาทิตย์ สีเหลืองสดใสเป็นสัญลักษณ์แห่งความสุข",
    colors: ["เหลือง"],
    season: "ดอกไม้ฤดูหนาว",
    meaning: "ความซื่อสัตย์, ความชื่นชม",
    imageUrl: sunflowerImg,
    imageColor: "เหลือง",
    care: { watering: "รดน้ำปานกลาง 2-3 ครั้ง/สัปดาห์", sunlight: "แดดจัดเต็มวัน 8+ ชม.", soil: "ดินร่วนทุกชนิด", temperature: "20-30°C" },
  },
  {
    id: "siam-tulip",
    nameEn: "Siam Tulip",
    nameTh: "ดอกกระเจียว",
    description: "กระเจียวเป็นดอกไม้พื้นเมืองของไทย บานในฤดูฝน มีสีชมพูม่วงสวยงาม พบมากที่ทุ่งดอกกระเจียว จ.ชัยภูมิ",
    colors: ["ชมพู", "ม่วง"],
    season: "ดอกไม้ฤดูฝน",
    meaning: "ความงดงาม, ความอ่อนโยน",
    imageUrl: siamTulipImg,
    imageColor: "ชมพู",
    care: { watering: "รดน้ำบ่อย ชอบความชื้นสูง", sunlight: "แดดรำไร 3-5 ชม./วัน", soil: "ดินร่วนชื้น", temperature: "22-30°C" },
  },
  {
    id: "rose",
    nameEn: "Rose",
    nameTh: "ดอกกุหลาบ",
    description: "กุหลาบเป็นราชินีแห่งดอกไม้ มีหลากหลายสีและพันธุ์ เป็นสัญลักษณ์แห่งความรัก",
    colors: ["แดง", "ชมพู", "ขาว", "เหลือง", "ส้ม", "ม่วง", "น้ำเงิน"],
    season: "ตลอดปี",
    meaning: "ความรัก, ความงาม, ความหลงใหล",
    imageUrl: roseImg,
    imageColor: "น้ำเงิน",
    care: { watering: "รดน้ำทุกวัน เช้าหรือเย็น", sunlight: "แดด 6+ ชม./วัน", soil: "ดินร่วนผสมปุ๋ยหมัก pH 6-6.5", temperature: "18-28°C" },
  },
  {
    id: "orchid",
    nameEn: "Orchid",
    nameTh: "ดอกกล้วยไม้",
    description: "กล้วยไม้เป็นดอกไม้ที่มีความหลากหลายมากที่สุดในโลก ไทยมีกล้วยไม้พื้นเมืองมากมาย",
    colors: ["ม่วง", "ขาว", "ชมพู", "เหลือง"],
    season: "ตลอดปี",
    meaning: "ความสวยงาม, ความหรูหรา, ความรัก",
    imageUrl: orchidImg,
    imageColor: "ม่วง",
    care: { watering: "รดน้ำวันเว้นวัน ให้แห้งก่อนรดใหม่", sunlight: "แสงสว่างรำไร ไม่โดนแดดตรง", soil: "เครื่องปลูกกล้วยไม้ (ถ่าน, กาบมะพร้าว)", temperature: "20-30°C" },
  },
  {
    id: "lotus",
    nameEn: "Lotus",
    nameTh: "ดอกบัว",
    description: "บัวเป็นดอกไม้ศักดิ์สิทธิ์ในศาสนาพุทธ ผุดพ้นจากโคลนตมแต่สะอาดบริสุทธิ์",
    colors: ["ชมพู", "ขาว"],
    season: "ดอกไม้ฤดูฝน",
    meaning: "ความบริสุทธิ์, การตื่นรู้, ศรัทธา",
    imageUrl: lotusImg,
    imageColor: "ชมพู",
    care: { watering: "ปลูกในน้ำ ระดับน้ำ 15-30 ซม.", sunlight: "แดดจัด 6+ ชม./วัน", soil: "ดินเหนียวก้นบ่อ", temperature: "25-35°C" },
  },
  {
    id: "plumeria",
    nameEn: "Plumeria",
    nameTh: "ดอกลีลาวดี",
    description: "ลีลาวดี (ลั่นทม) มีกลิ่นหอม กลีบดอกหนาเป็นมัน สีสันหลากหลาย นิยมปลูกเป็นไม้ประดับ",
    colors: ["ขาว", "เหลือง", "ชมพู", "แดง"],
    season: "ดอกไม้ฤดูร้อน",
    meaning: "ความงดงาม, การเริ่มต้นใหม่",
    imageUrl: plumeriaImg,
    imageColor: "ขาว",
    care: { watering: "รดน้ำน้อย ทนแล้งได้ดี", sunlight: "แดดจัด 6-8 ชม./วัน", soil: "ดินร่วนทรายระบายน้ำดี", temperature: "25-35°C" },
  },
  {
    id: "marigold",
    nameEn: "Marigold",
    nameTh: "ดอกดาวเรือง",
    description: "ดาวเรืองเป็นดอกไม้มงคลของไทย สีเหลืองทองสดใส นิยมใช้ในพิธีไหว้และงานมงคล",
    colors: ["เหลือง", "ส้ม"],
    season: "ดอกไม้ฤดูหนาว",
    meaning: "ความรุ่งเรือง, ความเจริญ",
    imageUrl: marigoldImg,
    imageColor: "เหลือง",
    care: { watering: "รดน้ำปานกลาง วันละ 1 ครั้ง", sunlight: "แดดจัด 6+ ชม./วัน", soil: "ดินร่วนทั่วไป", temperature: "20-30°C" },
  },
];

export const CATEGORIES = [
  "ดอกไม้ฤดูร้อน",
  "ดอกไม้ฤดูหนาว",
  "ดอกไม้ฤดูใบไม้ผลิ",
  "ดอกไม้ฤดูฝน",
  "ตลอดปี",
];

export const COLOR_LIST = [
  "แดง", "ชมพู", "ส้ม", "เหลือง", "ขาว", "ม่วง", "ฟ้า", "น้ำเงิน", "ทอง",
];
