import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://sahdrcajbflinfhlwgmb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_RVaEhvDjI2TE6ctNgtiK2A_2g9slg0N';

// Helper to fetch from Supabase REST API
async function supabaseFetch(path: string, options: any = {}): Promise<any> {
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Supabase request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null;
}

// Fallback Mock Data in case DB connection fails or is not setup yet
const mockDestinations = [
  {
    id: 1,
    name: "Punakha Dzong",
    image: "/punakha-dzong.jpg",
    description: "Punakha Dzong is one of Bhutan's most majestic fortresses and the winter capital of the Drukpa Lineage. It offers stunning architecture, riverside views, and a rich historical experience.",
    price: "$120",
    rating: 4.8,
    location: "Punakha",
    altitude: "1,200m",
    ideal_stay: "1-2 Days",
    peak_period: "Spring/Fall",
    language: "Dzongkha"
  },
  {
    id: 2,
    name: "Paro Taktsang",
    image: "/paro-taksang.jpg",
    description: "Also known as Tiger’s Nest Monastery, Paro Taktsang clings to a cliff 900 meters above the Paro Valley. It is Bhutan's most iconic pilgrimage site with breathtaking views.",
    price: "$150",
    rating: 4.9,
    location: "Paro",
    altitude: "3,120m",
    ideal_stay: "1 Day (hike)",
    peak_period: "Spring/Fall",
    language: "Dzongkha"
  },
  {
    id: 3,
    name: "Dochula Pass",
    image: "/dochula-pass.jpg",
    description: "Dochula Pass features 108 memorial chortens set against panoramic Himalayan mountains. It's an excellent spot for photography and scenic drives.",
    price: "$95",
    rating: 4.7,
    location: "Thimphu",
    altitude: "3,100m",
    ideal_stay: "Half Day",
    peak_period: "Spring/Fall",
    language: "Dzongkha"
  },
  {
    id: 4,
    name: "Thimphu Valley",
    image: "/thimphu.jpg",
    description: "The capital city of Bhutan, Thimphu is a unique blend of modern development and ancient traditions, being the only capital in the world without traffic lights.",
    price: "$110",
    rating: 4.6,
    location: "Thimphu",
    altitude: "2,330m",
    ideal_stay: "2-3 Days",
    peak_period: "Year-round",
    language: "Dzongkha"
  },
  {
    id: 5,
    name: "Phobjikha Valley",
    image: "/monk.jpg",
    description: "A vast U-shaped glacial valley, famous as the winter home of the rare black-necked cranes that migrate from the Tibetan Plateau.",
    price: "$130",
    rating: 4.8,
    location: "Wangdue Phodrang",
    altitude: "3,000m",
    ideal_stay: "2 Days",
    peak_period: "Winter/Spring",
    language: "Dzongkha"
  },
  {
    id: 6,
    name: "Bumthang Valley",
    image: "/airport.jpg",
    description: "The spiritual heartland of Bhutan, Bumthang is home to some of the country's oldest and most sacred Buddhist temples and monasteries.",
    price: "$140",
    rating: 4.9,
    location: "Bumthang",
    altitude: "2,600m",
    ideal_stay: "3-4 Days",
    peak_period: "Spring/Fall",
    language: "Dzongkha"
  }
];

const mockAttractions = [
  { id: 1, destination_id: 1, name: "Punakha Suspension Bridge", description: "The longest suspension bridge in Bhutan with stunning views over the Mo Chhu River.", image: "/punakha-bridge.jpg" },
  { id: 2, destination_id: 3, name: "Dochula Pass Chortens", description: "108 memorial chortens set against panoramic Himalayan mountains.", image: "/dochula-chortens.jpg" },
  { id: 3, destination_id: 2, name: "Paro Valley Viewpoint", description: "Breathtaking view of Paro Valley and Tiger’s Nest Monastery.", image: "/paro-viewpoint.jpg" }
];

const mockTours = [
  {
    id: "bhutan-highlights",
    title: "4 Days Bhutan Highlights",
    duration: "4 Days",
    nights: 3,
    price: "$999",
    priceVal: 999,
    image: "/paro-taksang.jpg",
    desc: "A brief but immersive escape covering Tiger's Nest and Thimphu's key attractions.",
    category: "Cultural",
    difficulty: "Easy",
    inclusions: [
      "TCB Certified English-speaking tour guide",
      "Standard 3-Star accommodations",
      "Private transfers & driver",
      "All meals & entry visa fee",
      "All monument entrance fees"
    ],
    exclusions: [
      "International flights to/from Paro",
      "Travel insurance",
      "Tips for guide and driver",
      "Alcoholic beverages & personal items"
    ],
    itinerary: [
      { day: 1, title: "Arrival in Paro & Drive to Thimphu", desc: "Arrive at Paro International Airport. Meet your guide and transfer to Thimphu. Visit the Buddha Dordenma statue and the Memorial Chorten." },
      { day: 2, title: "Thimphu Sightseeing & Drive to Paro", desc: "Explore Tashichho Dzong, the Simply Bhutan living museum, and local craft bazaars. In the afternoon, return to Paro." },
      { day: 3, title: "Hike to Paro Taktsang (Tiger's Nest)", desc: "Embark on the iconic 4-5 hour roundtrip trek to Tiger's Nest Monastery, perched on a cliff 900m above the valley floor." },
      { day: 4, title: "Departure", desc: "Transfer to Paro Airport for your onward international flight." }
    ]
  },
  {
    id: "cultural-journey",
    title: "7 Days Cultural Journey",
    duration: "7 Days",
    nights: 6,
    price: "$1,699",
    priceVal: 1699,
    image: "/punakha-dzong.jpg",
    desc: "Unveil the cultural heritage, majestic dzongs, and scenic passes across three valleys.",
    category: "Cultural",
    difficulty: "Easy",
    inclusions: [
      "TCB Certified English-speaking tour guide",
      "Standard 3-Star accommodations",
      "Private transfers & driver",
      "All meals & entry visa fee",
      "All monument entrance fees"
    ],
    exclusions: [
      "International flights to/from Paro",
      "Travel & medical insurance",
      "Tips for guide and driver",
      "Alcoholic beverages & personal items"
    ],
    itinerary: [
      { day: 1, title: "Arrive Paro - Transfer to Thimphu", desc: "Arrival in Paro, custom clearance. Drive to Thimphu. Relax and explore the capital town on foot." },
      { day: 2, title: "Thimphu Valley Exploration", desc: "Visit the Folk Heritage Museum, National Library, School of Astrology, and the majestic Tashichho Dzong." },
      { day: 3, title: "Scenic Drive to Punakha via Dochula", desc: "Cross the Dochula Pass (3,100m) and view the 108 memorial chortens and snow-capped Himalayan peaks. Descend to subtropical Punakha." },
      { day: 4, title: "Punakha Exploration & Suspension Bridge", desc: "Visit Punakha Dzong, the fertility temple (Chimi Lhakhang), and hike across the longest suspension bridge in Bhutan." },
      { day: 5, title: "Punakha to Paro", desc: "Drive back to Paro Valley. Visit Ta Dzong (National Museum) and Rinpung Dzong." },
      { day: 6, title: "Pilgrimage to Tiger's Nest", desc: "Hike up to Taktsang Monastery. In the evening, experience a traditional Bhutanese stone bath and farmhouse dinner." },
      { day: 7, title: "Farewell Bhutan", desc: "Transfer to Paro Airport for departure." }
    ]
  },
  {
    id: "adventure-bhutan",
    title: "10 Days Adventure Bhutan",
    duration: "10 Days",
    nights: 9,
    price: "$2,499",
    priceVal: 2499,
    image: "/dochula-pass.jpg",
    desc: "A combination of standard sightseeing, pristine day hikes, and local river rafting.",
    category: "Adventure",
    difficulty: "Moderate",
    inclusions: [
      "TCB Certified adventure & cultural tour guide",
      "Private rafting equipment & river fees",
      "Standard 3-Star accommodations & camping gear",
      "Private transfers & logistics",
      "All meals, entry visa & monument fees"
    ],
    exclusions: [
      "International airfare",
      "Personal trekking clothing/boots",
      "Tips and gratuities",
      "Personal expenses"
    ],
    itinerary: [
      { day: 1, title: "Arrive Paro & Sightseeing", desc: "Arrive in Paro. Visit local dzongs and prepare gear for the upcoming adventure." },
      { day: 2, title: "Cycle through Thimphu Valley", desc: "Transfer to Thimphu. Embark on a half-day mountain biking excursion around the northern ridges." },
      { day: 3, title: "Thimphu to Punakha & Rafting", desc: "Cross Dochula Pass and raft down the Po Chhu (Male River) in Punakha Valley." },
      { day: 4, title: "Punakha to Phobjikha Valley", desc: "Drive into Phobjikha glacial valley. Start a nature trail walk through pristine pine forests." },
      { day: 5, title: "Phobjikha Trekking Day", desc: "Hike up to remote valleys, encountering local yak herders and remote farming communities." },
      { day: 6, title: "Phobjikha to Bumthang Valley", desc: "Scenic drive crossing the Pelela Pass. Arrive in the spiritual heartland of Bumthang." },
      { day: 7, title: "Bumthang Valley Exploration", desc: "Visit Jakar Dzong and the sacred burning lake (Mebar Tsho). Sample local red panda beer and cheese." },
      { day: 8, title: "Fly back to Paro", desc: "Take a scenic domestic flight from Bumthang back to Paro. Visit local handicraft shops." },
      { day: 9, title: "Tiger's Nest Pilgrimage", desc: "Hike the iconic Tiger's Nest trail. Celebrate the journey with a farewell dinner." },
      { day: 10, title: "Departure", desc: "Transfer to Paro airport for final departure." }
    ]
  },
  {
    id: "luxury-escape",
    title: "Luxury Bhutan Escape",
    duration: "6 Days",
    nights: 5,
    price: "$3,299",
    priceVal: 3299,
    image: "/monk.jpg",
    desc: "Indulge in five-star luxury accommodations with private transfers and wellness treatments.",
    category: "Luxury",
    difficulty: "Easy",
    inclusions: [
      "5-Star Luxury resort stays (Amankora / Six Senses / COMO)",
      "Dedicated luxury private SUV & driver",
      "Premium English-speaking private guide",
      "All meals, visa fees, and top-tier spa treatment",
      "Private cultural blessing and butter lamp ceremony"
    ],
    exclusions: [
      "International business class airfare",
      "Premium reserve wines & spirits",
      "Tips & gratuities"
    ],
    itinerary: [
      { day: 1, title: "Arrive Paro - Luxury Transfer to Thimphu", desc: "Arrive in style. Transfer to your 5-star lodge in Thimphu. Enjoy a private welcoming spa session." },
      { day: 2, title: "Thimphu Royal Experiences", desc: "Private VIP tour of Tashichho Dzong and a bespoke incense-making workshop." },
      { day: 3, title: "Dochula Pass to Punakha Luxury Lodge", desc: "Private transfer to Punakha. Check into your pool villa. Sunset drinks by the river." },
      { day: 4, title: "Punakha Blessings & Return to Paro", desc: "Experience a private butter lamp lighting ceremony at Punakha Dzong before transferring back to Paro." },
      { day: 5, title: "Bespoke Tiger's Nest Hike", desc: "Hike up Tiger's Nest at sunrise with a private champagne picnic lunch. Traditional hot stone bath in the evening." },
      { day: 6, title: "Departure", desc: "Private VIP airport lounge access and departure." }
    ]
  }
];

const mockEditions = [
  { id: 1, tour_id: "bhutan-highlights", title: "The Paro Tshechu Edition", period: "Spring (March-May)", price: "$3,499", image: "/paro-taksang.jpg", icon: "Sun" },
  { id: 2, tour_id: "adventure-bhutan", title: "Snow Lion High Trek", period: "Summer (June-Aug)", price: "$2,899", image: "/airport.jpg", icon: "CloudRain" },
  { id: 3, tour_id: "cultural-journey", title: "Punakha Riverside Gala", period: "Fall (Sept-Nov)", price: "$4,199", image: "/punakha-dzong.jpg", icon: "Heart" },
  { id: 4, tour_id: "luxury-escape", title: "Black-Necked Crane Haven", period: "Winter (Dec-Feb)", price: "$2,299", image: "/monk.jpg", icon: "Snowflake" }
];

const mockHotels = [
  { id: 1, name: "Amankora Resort", location: "Paro, Thimphu, Punakha, Gangtey & Bumthang", image: "/paro-taksang.jpg", rating: 5.0, price: "$1,800", description: "A series of five luxury lodges spread across valleys, offering quiet elegance." },
  { id: 2, name: "Six Senses Bhutan", location: "Thimphu, Punakha & Paro", image: "/punakha-dzong.jpg", rating: 4.9, price: "$1,600", description: "Reflecting simplicity and beauty of heritage, celebrating wellness." },
  { id: 3, name: "COMO Uma Paro", location: "Paro Valley", image: "/dochula-pass.jpg", rating: 4.8, price: "$950", description: "Private villas, fine dining, and holistic Asian-inspired therapies." },
  { id: 4, name: "Zhiwa Ling Heritage", location: "Paro", image: "/monk.jpg", rating: 4.7, price: "$450", description: "Stunning locally-owned luxury hotel crafted in classic Bhutanese heritage." }
];

// Helper to check DB health
let dbConnected = false;
const checkDb = async () => {
  try {
    await supabaseFetch('/destinations?select=id&limit=1');
    dbConnected = true;
    console.log("Supabase REST API database connected and verified successfully!");
  } catch (err: any) {
    dbConnected = false;
    console.warn("Supabase REST API connection failed. Server is operating in Mock-Fallback mode. Error:", err.message);
  }
};
checkDb();

// Routes
app.get('/api/destinations', async (req, res) => {
  if (dbConnected) {
    try {
      const data = await supabaseFetch('/destinations?select=*&order=id.asc');
      const formatted = data.map((d: any) => ({
        ...d,
        rating: parseFloat(d.rating) || d.rating
      }));
      return res.json(formatted);
    } catch (err: any) {
      console.error("Supabase fetch error for destinations:", err.message);
    }
  }
  res.json(mockDestinations);
});

app.get('/api/destinations/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (dbConnected) {
    try {
      const destList = await supabaseFetch(`/destinations?id=eq.${id}&select=*`);
      if (destList && destList.length > 0) {
        const dest = destList[0];
        dest.rating = parseFloat(dest.rating) || dest.rating;
        const attractions = await supabaseFetch(`/attractions?destination_id=eq.${id}&select=name`);
        return res.json({
          ...dest,
          attractions: attractions.map((a: any) => a.name)
        });
      }
    } catch (err: any) {
      console.error(`Supabase fetch error for destination ${id}:`, err.message);
    }
  }
  
  const dest = mockDestinations.find(d => d.id === id);
  if (dest) {
    const attractions = mockAttractions.filter(a => a.destination_id === id).map(a => a.name);
    return res.json({ ...dest, attractions });
  }
  res.status(404).json({ error: "Destination not found" });
});

app.get('/api/tours', async (req, res) => {
  if (dbConnected) {
    try {
      const data = await supabaseFetch('/tours?select=*');
      // Format backend key 'price_val' to matches frontend 'priceVal' and 'description' to 'desc'
      const formatted = data.map((t: any) => ({
        ...t,
        priceVal: t.price_val,
        desc: t.description
      }));
      return res.json(formatted);
    } catch (err: any) {
      console.error("Supabase fetch error for tours:", err.message);
    }
  }
  res.json(mockTours);
});

app.get('/api/tours/editions', async (req, res) => {
  if (dbConnected) {
    try {
      const data = await supabaseFetch('/tour_editions?select=*&order=id.asc');
      return res.json(data);
    } catch (err: any) {
      console.error("Supabase fetch error for tour editions:", err.message);
    }
  }
  res.json(mockEditions);
});

app.get('/api/tours/:id', async (req, res) => {
  const id = req.params.id;
  if (dbConnected) {
    try {
      const tourList = await supabaseFetch(`/tours?id=eq.${id}&select=*`);
      if (tourList && tourList.length > 0) {
        const tour = tourList[0];
        return res.json({
          ...tour,
          priceVal: tour.price_val,
          desc: tour.description
        });
      }
    } catch (err: any) {
      console.error(`Supabase fetch error for tour ${id}:`, err.message);
    }
  }
  const tour = mockTours.find(t => t.id === id);
  if (tour) return res.json(tour);
  res.status(404).json({ error: "Tour not found" });
});

app.get('/api/hotels', async (req, res) => {
  if (dbConnected) {
    try {
      const data = await supabaseFetch('/hotels?select=*&order=id.asc');
      const formatted = data.map((h: any) => ({
        ...h,
        rating: parseFloat(h.rating) || h.rating
      }));
      return res.json(formatted);
    } catch (err: any) {
      console.error("Supabase fetch error for hotels:", err.message);
    }
  }
  res.json(mockHotels);
});

// CREATE Destination
app.post('/api/destinations', async (req, res) => {
  try {
    let { id, name, image, description, price, rating, location, altitude, ideal_stay, peak_period, language } = req.body;
    if (!id) {
      const existing = await supabaseFetch('/destinations?select=id&order=id.desc&limit=1');
      id = existing && existing.length > 0 ? existing[0].id + 1 : 1;
    }
    const payload = { id, name, image, description, price, rating: parseFloat(rating) || 4.8, location, altitude, ideal_stay, peak_period, language };
    await supabaseFetch('/destinations', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    res.status(201).json(payload);
  } catch (err: any) {
    console.error("Create destination failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Destination
app.put('/api/destinations/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { name, image, description, price, rating, location, altitude, ideal_stay, peak_period, language } = req.body;
    const payload = { name, image, description, price, rating: parseFloat(rating) || 4.8, location, altitude, ideal_stay, peak_period, language };
    await supabaseFetch(`/destinations?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    res.json({ id, ...payload });
  } catch (err: any) {
    console.error(`Update destination ${id} failed:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE Destination
app.delete('/api/destinations/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await supabaseFetch(`/destinations?id=eq.${id}`, {
      method: 'DELETE'
    });
    res.json({ message: "Destination deleted successfully", id });
  } catch (err: any) {
    console.error(`Delete destination ${id} failed:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// CREATE Tour
app.post('/api/tours', async (req, res) => {
  try {
    let { id, title, duration, nights, price, priceVal, image, desc, category, difficulty, inclusions, exclusions, itinerary } = req.body;
    if (!id && title) {
      id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    const payload = {
      id,
      title,
      duration,
      nights: parseInt(nights) || 0,
      price,
      price_val: parseInt(priceVal) || 0,
      image,
      description: desc,
      category,
      difficulty,
      inclusions: Array.isArray(inclusions) ? inclusions : [],
      exclusions: Array.isArray(exclusions) ? exclusions : [],
      itinerary: Array.isArray(itinerary) ? itinerary : []
    };
    await supabaseFetch('/tours', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    res.status(201).json({ ...payload, priceVal: payload.price_val, desc: payload.description });
  } catch (err: any) {
    console.error("Create tour failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Tour
app.put('/api/tours/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const { title, duration, nights, price, priceVal, image, desc, category, difficulty, inclusions, exclusions, itinerary } = req.body;
    const payload = {
      title,
      duration,
      nights: parseInt(nights) || 0,
      price,
      price_val: parseInt(priceVal) || 0,
      image,
      description: desc,
      category,
      difficulty,
      inclusions: Array.isArray(inclusions) ? inclusions : [],
      exclusions: Array.isArray(exclusions) ? exclusions : [],
      itinerary: Array.isArray(itinerary) ? itinerary : []
    };
    await supabaseFetch(`/tours?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    res.json({ id, ...payload, priceVal: payload.price_val, desc: payload.description });
  } catch (err: any) {
    console.error(`Update tour ${id} failed:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE Tour
app.delete('/api/tours/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await supabaseFetch(`/tours?id=eq.${id}`, {
      method: 'DELETE'
    });
    res.json({ message: "Tour deleted successfully", id });
  } catch (err: any) {
    console.error(`Delete tour ${id} failed:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// CREATE Hotel
app.post('/api/hotels', async (req, res) => {
  try {
    let { id, name, location, image, rating, price, description } = req.body;
    if (!id) {
      const existing = await supabaseFetch('/hotels?select=id&order=id.desc&limit=1');
      id = existing && existing.length > 0 ? existing[0].id + 1 : 1;
    }
    const payload = { id, name, location, image, rating: parseFloat(rating) || 5.0, price, description };
    await supabaseFetch('/hotels', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    res.status(201).json(payload);
  } catch (err: any) {
    console.error("Create hotel failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Hotel
app.put('/api/hotels/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const { name, location, image, rating, price, description } = req.body;
    const payload = { name, location, image, rating: parseFloat(rating) || 5.0, price, description };
    await supabaseFetch(`/hotels?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    res.json({ id, ...payload });
  } catch (err: any) {
    console.error(`Update hotel ${id} failed:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE Hotel
app.delete('/api/hotels/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await supabaseFetch(`/hotels?id=eq.${id}`, {
      method: 'DELETE'
    });
    res.json({ message: "Hotel deleted successfully", id });
  } catch (err: any) {
    console.error(`Delete hotel ${id} failed:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// File upload endpoint (writes to frontend public/uploads directory)
app.post('/api/upload', (req, res) => {
  try {
    const { name, data } = req.body;
    if (!name || !data) {
      return res.status(400).json({ error: "Name and data are required" });
    }

    // Extract base64 content
    const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Create public/uploads directory
    let uploadDir = path.resolve(process.cwd(), '../public/uploads');
    const rootPublic = path.resolve(process.cwd(), '../public');
    if (!fs.existsSync(rootPublic)) {
      uploadDir = path.resolve(__dirname, '../../public/uploads');
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    console.log("Successfully uploaded file:", filename, "to", filePath);
    res.json({ url: `/uploads/${filename}` });
  } catch (err: any) {
    console.error("Upload error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const ABOUT_FILE = path.join(__dirname, '../about.json');
const defaultAboutData = {
  philosophyText: "At Help Tourism Bhutan, we believe travel shouldn't just change your location—it should change your perspective. We focus on \"Deep Travel\"—engaging with local communities, respecting sacred traditions, and ensuring every journey contributes to Bhutan's sustainable growth.",
  stat1Label: "Founded",
  stat1Val: "2010",
  stat2Label: "Guides",
  stat2Val: "50+ Local",
  stat3Label: "Regions",
  stat3Val: "All 20 Dzongkhags",
  stat4Label: "Happiness",
  stat4Val: "100% GNH",
  pillar1Title: "Community First",
  pillar1Desc: "We ensure tourism dollars reach the remote families we visit.",
  pillar2Title: "Unmatched Expertise",
  pillar2Desc: "Our guides are certified historians and cultural experts.",
  pillar3Title: "Deep Vetting",
  pillar3Desc: "Every hotel and lodge is personally tested for soul and quality.",
  pillar4Title: "Ethical Impact",
  pillar4Desc: "We are carbon-negative and plastic-free on all our treks."
};

app.get('/api/about', (req, res) => {
  try {
    if (fs.existsSync(ABOUT_FILE)) {
      const data = fs.readFileSync(ABOUT_FILE, 'utf8');
      return res.json(JSON.parse(data));
    }
  } catch (e) {
    console.error("Failed to read about.json:", e);
  }
  res.json(defaultAboutData);
});

app.put('/api/about', (req, res) => {
  try {
    fs.writeFileSync(ABOUT_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json(req.body);
  } catch (err: any) {
    console.error("Failed to save about.json:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const CONTACT_FILE = path.join(__dirname, '../contact.json');
const defaultContactData = {
  heroTitle: "Contact Thimphu",
  heroSubtitle: "Our local travel architects are stationed directly in the capital, ready to craft your bespoke Bhutanese journey.",
  channelTitle: "Direct Channels",
  channelSubtitle: "How to Reach Us",
  channelDesc: "Whether you prefer a traditional wire transfer, a digital dialogue, or a direct call to our Himalayan base, we are here to assist.",
  baseTitle: "The Base",
  baseLine1: "Changlam Square, 2nd Floor",
  baseLine2: "Thimphu, Kingdom of Bhutan",
  callTitle: "Digital Call",
  callLine1: "+975 2 334567",
  callLine2: "+975 17 609800 (WhatsApp)",
  emailTitle: "Electronic Mail",
  emailLine1: "explore@helptourismbhutan.bt",
  emailLine2: "concierge@helptourismbhutan.bt",
  footerPhone: "+975 2 334567",
  footerEmail: "explore@helptourismbhutan.bt",
  footerWhatsapp: "+975 17 609800 (WhatsApp)",
  footerLocation: "Thimphu, Bhutan",
  footerInstagram: "Instagram",
  footerFacebook: "Facebook",
  footerYoutube: "YouTube",
  footerTiktok: "TikTok"
};


app.get('/api/contact', (req, res) => {
  try {
    if (fs.existsSync(CONTACT_FILE)) {
      const data = fs.readFileSync(CONTACT_FILE, 'utf8');
      return res.json(JSON.parse(data));
    }
  } catch (e) {
    console.error("Failed to read contact.json:", e);
  }
  res.json(defaultContactData);
});

app.put('/api/contact', (req, res) => {
  try {
    fs.writeFileSync(CONTACT_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json(req.body);
  } catch (err: any) {
    console.error("Failed to save contact.json:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

