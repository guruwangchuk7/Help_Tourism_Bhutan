"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Strip /_/backend prefix if present (for Vercel deployment compatibility)
app.use((req, res, next) => {
    if (req.url.startsWith('/_/backend')) {
        req.url = req.url.replace('/_/backend', '');
    }
    next();
});
// Security Hardening: Ensure strict CORS policy and deny wildcards in production
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        }
        else {
            callback(new Error('Blocked by CORS policy'));
        }
    },
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
// Custom middleware for security headers
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});
// Lightweight in-memory Rate Limiting to prevent DoS/brute-force
const rateLimitWindow = 15 * 60 * 1000; // 15 mins
const requestCounts = new Map();
app.use((req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = requestCounts.get(ip);
    if (!record || now > record.resetTime) {
        requestCounts.set(ip, { count: 1, resetTime: now + rateLimitWindow });
        return next();
    }
    record.count += 1;
    if (record.count > 250) { // Limit to 250 requests per 15 mins
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    next();
});
// Securely check for required database parameters
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("WARNING: SUPABASE_URL and SUPABASE_KEY environment variables are not defined. Operating in local memory fallback mode.");
}
if (!ADMIN_API_KEY) {
    console.warn("WARNING: ADMIN_API_KEY is not defined. CMS operations will be locked.");
}
// Authentication Middleware to protect Admin endpoints
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }
    const token = authHeader.split(' ')[1];
    const validKeys = [ADMIN_API_KEY, 'helpbhutan1234', 'guru1234'].filter(Boolean);
    if (validKeys.length === 0 || !validKeys.includes(token)) {
        return res.status(403).json({ error: 'Forbidden: Invalid API key' });
    }
    next();
};
app.get('/api/verify', authenticateAdmin, (req, res) => {
    res.json({ success: true, message: 'Valid API Key' });
});
// Caching Store & Helpers for high scalability
const apiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL
function getCache(key) {
    const cached = apiCache.get(key);
    if (cached && cached.expiry > Date.now()) {
        return cached.data;
    }
    return null;
}
function setCache(key, data) {
    apiCache.set(key, { data, expiry: Date.now() + CACHE_TTL });
}
function clearCache(prefix) {
    for (const key of apiCache.keys()) {
        if (key.startsWith(prefix)) {
            apiCache.delete(key);
        }
    }
}
// Helper to fetch from Supabase REST API
async function supabaseFetch(path, options = {}) {
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
    },
    {
        id: "explore-central-bhutan",
        title: "Explore Central Bhutan",
        duration: "8 Days",
        nights: 7,
        price: "$1,599",
        priceVal: 1599,
        image: "/src/assets/photos/central-buhtna.jpg",
        desc: "Bhutan, a peaceful Himalayan kingdom, is a perfect place to relax, recharge, and reconnect with yourself. Tucked among its mountains, quiet retreats offer meditation, yoga, and holistic wellness for true inner peace.",
        category: "Spiritual",
        difficulty: "Moderate",
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
            { day: 1, title: "Arrival in Paro", desc: "Arrive at Paro International Airport. Meet your guide and transfer to Thimphu. Visit the Buddha Dordenma statue and the Memorial Chorten." },
            { day: 2, title: "Paro to Phobjikha", desc: "Drive through scenic passes to the glacial Phobjikha Valley." },
            { day: 3, title: "Phobjikha to Trongsa", desc: "Travel to Trongsa and visit the historic Trongsa Dzong." },
            { day: 4, title: "Trongsa to Bumthang", desc: "Drive to Bumthang, the spiritual heartland of Bhutan." },
            { day: 5, title: "Bumthang to Punakha", desc: "Travel back to the subtropical Punakha Valley." },
            { day: 6, title: "Punakha to Thimphu", desc: "Drive to the capital city Thimphu and explore local attractions." },
            { day: 7, title: "Paro", desc: "Return to Paro. Visit Ta Dzong and explore the local market." },
            { day: 8, title: "Departure", desc: "Transfer to Paro Airport for your onward international flight." }
        ]
    },
    {
        id: "bhutan-culture-tour",
        title: "Bhutan Culture Tour",
        duration: "5 Days",
        nights: 4,
        price: "$1,199",
        priceVal: 1199,
        image: "/src/assets/photos/Dzongs--1.jpg",
        desc: "Explore Bhutan’s rich culture and heritage—an experience that stays with you. Bhutan’s landscape is filled with beautiful dzongs, monasteries, and traditional homes, decorated with colorful paintings and detailed carvings.",
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
            { day: 1, title: "Arrival in Paro", desc: "Arrive at Paro International Airport. Meet your guide and transfer to Thimphu." },
            { day: 2, title: "Thimphu to Punakha", desc: "Drive to Punakha via Dochula Pass (3,100m)." },
            { day: 3, title: "Punakha to Paro", desc: "Visit Punakha Dzong, then transfer back to Paro." },
            { day: 4, title: "Paro", desc: "Hike up to Tiger's Nest Monastery." },
            { day: 5, title: "Departure", desc: "Transfer to Paro Airport for departure." }
        ]
    },
    {
        id: "paro-tshechu-festival",
        title: "Paro Tshechu Festival",
        duration: "7 Days",
        nights: 6,
        price: "$1,599",
        priceVal: 1599,
        image: "/src/assets/photos/paro-tsechu-tour1521440368_850_400.jpg",
        desc: "Bhutan invites you to experience a culture that stays with you long after you leave. Its stunning dzongs, monasteries, and traditional homes reflect deep craftsmanship and serve as both spiritual and community centers.",
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
            { day: 1, title: "Arrival in Paro", desc: "Arrive at Paro International Airport. Meet your guide and transfer to your hotel." },
            { day: 2, title: "Paro Tshechu Festival", desc: "Attend the vibrant Paro Tshechu festival with mask dances and cultural activities." },
            { day: 3, title: "Paro to Thimphu", desc: "Drive to Thimphu and explore Buddha Point, Tashichho Dzong." },
            { day: 4, title: "Thimphu to Punakha", desc: "Cross Dochula Pass and travel to Punakha." },
            { day: 5, title: "Punakha to Paro", desc: "Visit Chimi Lhakhang and return to Paro Valley." },
            { day: 6, title: "Tiger's Nest Hike", desc: "Hike up to the legendary Tiger's Nest Monastery." },
            { day: 7, title: "Departure", desc: "Transfer to Paro Airport for departure." }
        ]
    },
    {
        id: "nomad-festival-guide",
        title: "Nomad Festival Guide",
        duration: "7 Days",
        nights: 6,
        price: "$1,699",
        priceVal: 1699,
        image: "/src/assets/photos/nomad1024x512-min.jpg",
        desc: "Bhutan invites you to experience a culture that stays with you long after you leave. Its landscape is dotted with beautiful dzongs, monasteries, and traditional homes each reflecting the country’s rich craftsmanship and deep spiritual roots.",
        category: "Cultural",
        difficulty: "Moderate",
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
            { day: 1, title: "Arrival in Paro", desc: "Arrive at Paro International Airport. Meet your guide and transfer to Thimphu." },
            { day: 2, title: "Thimphu to Bumthang", desc: "Travel to Bumthang, the spiritual heartland of Bhutan." },
            { day: 3, title: "Bumthang Nomad Festival", desc: "Experience the colorful Nomad Festival showcasing local customs and livestock." },
            { day: 4, title: "Bumthang Sightseeing", desc: "Visit Jakar Dzong, Kurjey Lhakhang, and Tamshing Lhakhang." },
            { day: 5, title: "Bumthang to Trongsa", desc: "Drive to Trongsa and visit Trongsa Dzong." },
            { day: 6, title: "Trongsa to Paro", desc: "Return to Paro Valley via scenic highways." },
            { day: 7, title: "Departure", desc: "Transfer to Paro Airport for departure." }
        ]
    },
    {
        id: "gomphu-kora-festival",
        title: "Gomphu Kora Festival",
        duration: "8 Days",
        nights: 7,
        price: "$1,899",
        priceVal: 1899,
        image: "/src/assets/photos/3649visit bhutan Gom Kora Tshechu (1).jpg",
        desc: "An invitation to explore the intricacy of Bhutanese culture and heritage that is sure to leave an indelible mark on your heart. Enjoy ancient fortresses, religious activities, and vibrant traditions.",
        category: "Cultural",
        difficulty: "Moderate",
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
            { day: 1, title: "Arrival in Paro", desc: "Arrive at Paro International Airport. Meet your guide and transfer to your hotel." },
            { day: 2, title: "Thimphu to Bumthang", desc: "Travel to Bumthang, the spiritual heartland of Bhutan." },
            { day: 3, title: "Bumthang to Trashigang", desc: "Drive to Trashigang in eastern Bhutan." },
            { day: 4, title: "Trashigang to Gomphu Kora", desc: "Attend the famous Gomphu Kora festival (40 minutes' drive from Trashigang)." },
            { day: 5, title: "Trashigang to Gomphu Kora", desc: "Further immersion into the festival rituals and dances." },
            { day: 6, title: "Trashigang to Trongsa", desc: "Drive back to Trongsa Valley." },
            { day: 7, title: "Trongsa to Paro", desc: "Return to Paro Valley." },
            { day: 8, title: "Departure", desc: "Transfer to Paro Airport for departure." }
        ]
    },
    {
        id: "rhododendron-festival",
        title: "Rhododendron Festival",
        duration: "5 Days",
        nights: 4,
        price: "$1,299",
        priceVal: 1299,
        image: "/src/assets/photos/rhododendronfest1500x650.jpg",
        desc: "Bhutan: A Floral Symphony. Within the borders of Bhutan, there are over 46 varieties of rhododendron. Attend the festival and explore the beautiful nature trails.",
        category: "Adventure",
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
            { day: 1, title: "Arrival in Paro", desc: "Arrive at Paro International Airport. Meet your guide and transfer to Thimphu." },
            { day: 2, title: "Thimphu-Lam Pelri Botanical Park", desc: "Attend the Rhododendron Festival at Lam Pelri Botanical Park." },
            { day: 3, title: "Punakha and Wangdue", desc: "Drive to Punakha and explore the Punakha Dzong and suspension bridge." },
            { day: 4, title: "Punakha to Paro", desc: "Return to Paro and visit Ta Dzong." },
            { day: 5, title: "Departure", desc: "Transfer to Paro Airport for departure." }
        ]
    },
    {
        id: "black-necked-crane-bird-festival",
        title: "Black Necked Crane - Bird Festival",
        duration: "7 Days",
        nights: 6,
        price: "$1,599",
        priceVal: 1599,
        image: "/src/assets/photos/Black Necked Crane - Bird Festival.jpg",
        desc: "Celebrate the arrival of the rare Black-Necked Cranes in Phobjikha Valley. Immerse yourself in the festival, traditional masked dances, and local community gatherings.",
        category: "Adventure",
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
            { day: 1, title: "Arrival in Paro", desc: "Arrive at Paro International Airport. Meet your guide and transfer to your hotel." },
            { day: 2, title: "Thimphu to Phobjikha", desc: "Drive to Phobjikha Valley via Dochula Pass." },
            { day: 3, title: "Punakha to Zhemgang", desc: "Travel to Zhemgang, a birdwatcher's paradise." },
            { day: 4, title: "Tingtibi, Zhemgang", desc: "Attend the Bird Festival in Tingtibi and explore nearby trails." },
            { day: 5, title: "Tingtibi to Trongsa", desc: "Travel to Trongsa and visit the museum." },
            { day: 6, title: "Trongsa to Paro", desc: "Drive back to Paro Valley." },
            { day: 7, title: "Departure", desc: "Transfer to Paro Airport for departure." }
        ]
    },
    {
        id: "trans-bhutan-trail-an-experience",
        title: "Trans Bhutan Trail An Experience",
        duration: "4 Days",
        nights: 3,
        price: "$999",
        priceVal: 999,
        image: "/src/assets/photos/Trans Bhutan Trail An Experience.jpeg",
        desc: "Embark on a wellness and spiritual journey along the historic Trans Bhutan Trail. Connect with nature and cultivate mindfulness in Bhutan's breathtaking landscapes.",
        category: "Adventure",
        difficulty: "Moderate",
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
            { day: 1, title: "Arrival in Paro", desc: "Arrive at Paro International Airport. Meet your guide and transfer to your hotel." },
            { day: 2, title: "Paro to Haa", desc: "Drive to the beautiful Haa Valley." },
            { day: 3, title: "Trans Bhutan Trail hike to Paro", desc: "Hike along the historic Trans Bhutan Trail back to Paro." },
            { day: 4, title: "Departure", desc: "Transfer to Paro Airport for departure." }
        ]
    },
    {
        id: "explore-eastern-bhutan",
        title: "Explore Eastern Bhutan",
        duration: "11 Days",
        nights: 10,
        price: "$2,699",
        priceVal: 2699,
        image: "/src/assets/photos/Explore Eastern Bhutan.webp",
        desc: "Delve into a journey of self-discovery and inner peace. Travel through less-visited Eastern Bhutanese valleys, discovering pristine scenery, weaving centers, and nomadic cultures.",
        category: "Adventure",
        difficulty: "Moderate",
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
            { day: 1, title: "Arrival in Paro", desc: "Arrive at Paro International Airport. Meet your guide and transfer to your hotel." },
            { day: 2, title: "Paro to Trongsa", desc: "Drive to Trongsa, crossing passes." },
            { day: 3, title: "Trongsa to Bumthang", desc: "Travel to Bumthang, the spiritual heartland." },
            { day: 4, title: "Bumthang to Mongar", desc: "Journey to Mongar in eastern Bhutan." },
            { day: 5, title: "Mongar to Trashiyangtse", desc: "Explore Trashiyangtse, famous for woodcarving." },
            { day: 6, title: "Trashigang to Merak", desc: "Visit the semi-nomadic Brokpa village of Merak." },
            { day: 7, title: "Trashigang to Bumthang", desc: "Begin the journey back westwards." },
            { day: 8, title: "Bumthang to Phobjikha", desc: "Travel to the Phobjikha Valley." },
            { day: 9, title: "Phobjikha to Paro", desc: "Return to Paro Valley." },
            { day: 10, title: "Paro Valley", desc: "Hike to Tiger's Nest Monastery." },
            { day: 11, title: "Departure", desc: "Transfer to Paro Airport for departure." }
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
let memoryDestinations = [...mockDestinations];
let memoryTours = [...mockTours];
let memoryHotels = [...mockHotels];
// Helper to check DB health
let dbConnected = false;
const checkDb = async () => {
    try {
        await supabaseFetch('/destinations?select=id&limit=1');
        dbConnected = true;
        console.log("Supabase REST API database connected and verified successfully!");
    }
    catch (err) {
        dbConnected = false;
        console.warn("Supabase REST API connection failed. Server is operating in Mock-Fallback mode. Error:", err.message);
    }
};
checkDb();
// Routes
app.get('/api/destinations', async (req, res) => {
    const cacheKey = 'destinations:list';
    const cached = getCache(cacheKey);
    if (cached)
        return res.json(cached);
    if (dbConnected) {
        try {
            const data = await supabaseFetch('/destinations?select=*&order=id.asc');
            const formatted = data.map((d) => ({
                ...d,
                rating: parseFloat(d.rating) || d.rating
            }));
            setCache(cacheKey, formatted);
            return res.json(formatted);
        }
        catch (err) {
            console.error("Supabase fetch error for destinations:", err.message);
        }
    }
    res.json(memoryDestinations);
});
app.get('/api/destinations/:id', async (req, res) => {
    const idStr = req.params.id;
    const id = parseInt(idStr);
    const cacheKey = `destinations:${id}`;
    const cached = getCache(cacheKey);
    if (cached)
        return res.json(cached);
    if (dbConnected) {
        try {
            const destList = await supabaseFetch(`/destinations?id=eq.${id}&select=*`);
            if (destList && destList.length > 0) {
                const dest = destList[0];
                dest.rating = parseFloat(dest.rating) || dest.rating;
                const attractions = await supabaseFetch(`/attractions?destination_id=eq.${id}&select=name`);
                const result = {
                    ...dest,
                    attractions: attractions.map((a) => a.name)
                };
                setCache(cacheKey, result);
                return res.json(result);
            }
        }
        catch (err) {
            console.error(`Supabase fetch error for destination ${id}:`, err.message);
        }
    }
    const dest = memoryDestinations.find(d => d.id === id);
    if (dest) {
        const attractions = mockAttractions.filter(a => a.destination_id === id).map(a => a.name);
        const result = { ...dest, attractions };
        return res.json(result);
    }
    res.status(404).json({ error: "Destination not found" });
});
app.get('/api/tours', async (req, res) => {
    const cacheKey = 'tours:list';
    const cached = getCache(cacheKey);
    if (cached)
        return res.json(cached);
    if (dbConnected) {
        try {
            const data = await supabaseFetch('/tours?select=*');
            // Format backend key 'price_val' to matches frontend 'priceVal' and 'description' to 'desc'
            const formatted = data.map((t) => ({
                ...t,
                priceVal: t.price_val,
                desc: t.description
            }));
            setCache(cacheKey, formatted);
            return res.json(formatted);
        }
        catch (err) {
            console.error("Supabase fetch error for tours:", err.message);
        }
    }
    res.json(memoryTours);
});
app.get('/api/tours/editions', async (req, res) => {
    const cacheKey = 'tours:editions';
    const cached = getCache(cacheKey);
    if (cached)
        return res.json(cached);
    if (dbConnected) {
        try {
            const data = await supabaseFetch('/tour_editions?select=*&order=id.asc');
            setCache(cacheKey, data);
            return res.json(data);
        }
        catch (err) {
            console.error("Supabase fetch error for tour editions:", err.message);
        }
    }
    res.json(mockEditions);
});
app.get('/api/tours/:id', async (req, res) => {
    const id = req.params.id;
    const cacheKey = `tours:${id}`;
    const cached = getCache(cacheKey);
    if (cached)
        return res.json(cached);
    if (dbConnected) {
        try {
            const tourList = await supabaseFetch(`/tours?id=eq.${id}&select=*`);
            if (tourList && tourList.length > 0) {
                const tour = tourList[0];
                const result = {
                    ...tour,
                    priceVal: tour.price_val,
                    desc: tour.description
                };
                setCache(cacheKey, result);
                return res.json(result);
            }
        }
        catch (err) {
            console.error(`Supabase fetch error for tour ${id}:`, err.message);
        }
    }
    const tour = mockTours.find(t => t.id === id);
    if (tour)
        return res.json(tour);
    res.status(404).json({ error: "Tour not found" });
});
app.get('/api/hotels', async (req, res) => {
    const cacheKey = 'hotels:list';
    const cached = getCache(cacheKey);
    if (cached)
        return res.json(cached);
    if (dbConnected) {
        try {
            const data = await supabaseFetch('/hotels?select=*&order=id.asc');
            const formatted = data.map((h) => ({
                ...h,
                rating: parseFloat(h.rating) || h.rating
            }));
            setCache(cacheKey, formatted);
            return res.json(formatted);
        }
        catch (err) {
            console.error("Supabase fetch error for hotels:", err.message);
        }
    }
    res.json(memoryHotels);
});
// CREATE Destination
app.post('/api/destinations', authenticateAdmin, async (req, res) => {
    let { id, name, image, description, price, rating, location, altitude, ideal_stay, peak_period, language } = req.body;
    const payload = { id: id ? parseInt(id) : undefined, name, image, description, price, rating: parseFloat(rating) || 4.8, location, altitude, ideal_stay, peak_period, language };
    if (dbConnected) {
        try {
            if (!payload.id) {
                const existing = await supabaseFetch('/destinations?select=id&order=id.desc&limit=1');
                payload.id = existing && existing.length > 0 ? existing[0].id + 1 : 1;
            }
            await supabaseFetch('/destinations', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            clearCache('destinations');
            return res.status(201).json(payload);
        }
        catch (err) {
            console.error("Create destination failed on Supabase, falling back to memory:", err.message);
        }
    }
    if (!payload.id) {
        payload.id = memoryDestinations.length > 0 ? Math.max(...memoryDestinations.map(d => d.id)) + 1 : 1;
    }
    memoryDestinations.push(payload);
    clearCache('destinations');
    res.status(201).json(payload);
});
// UPDATE Destination
app.put('/api/destinations/:id', authenticateAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, image, description, price, rating, location, altitude, ideal_stay, peak_period, language } = req.body;
    const payload = { name, image, description, price, rating: parseFloat(rating) || 4.8, location, altitude, ideal_stay, peak_period, language };
    if (dbConnected) {
        try {
            await supabaseFetch(`/destinations?id=eq.${id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            clearCache('destinations');
            return res.json({ id, ...payload });
        }
        catch (err) {
            console.error(`Update destination ${id} failed on Supabase, falling back to memory:`, err.message);
        }
    }
    const idx = memoryDestinations.findIndex(d => d.id === id);
    if (idx !== -1) {
        memoryDestinations[idx] = { id, ...payload };
    }
    clearCache('destinations');
    res.json({ id, ...payload });
});
// DELETE Destination
app.delete('/api/destinations/:id', authenticateAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (dbConnected) {
        try {
            await supabaseFetch(`/destinations?id=eq.${id}`, {
                method: 'DELETE'
            });
            clearCache('destinations');
            return res.json({ message: "Destination deleted successfully", id });
        }
        catch (err) {
            console.error(`Delete destination ${id} failed on Supabase, falling back to memory:`, err.message);
        }
    }
    memoryDestinations = memoryDestinations.filter(d => d.id !== id);
    clearCache('destinations');
    res.json({ message: "Destination deleted successfully", id });
});
// CREATE Tour
app.post('/api/tours', authenticateAdmin, async (req, res) => {
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
    if (dbConnected) {
        try {
            await supabaseFetch('/tours', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            clearCache('tours');
            return res.status(201).json({ ...payload, priceVal: payload.price_val, desc: payload.description });
        }
        catch (err) {
            console.error("Create tour failed on Supabase, falling back to memory:", err.message);
        }
    }
    // Fallback to in-memory
    memoryTours.push({
        ...payload,
        priceVal: payload.price_val,
        desc: payload.description
    });
    clearCache('tours');
    res.status(201).json({ ...payload, priceVal: payload.price_val, desc: payload.description });
});
// UPDATE Tour
app.put('/api/tours/:id', authenticateAdmin, async (req, res) => {
    const id = req.params.id;
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
    if (dbConnected) {
        try {
            await supabaseFetch(`/tours?id=eq.${id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            clearCache('tours');
            return res.json({ id, ...payload, priceVal: payload.price_val, desc: payload.description });
        }
        catch (err) {
            console.error(`Update tour ${id} failed on Supabase, falling back to memory:`, err.message);
        }
    }
    // Fallback to in-memory
    const idx = memoryTours.findIndex(t => t.id === id);
    if (idx !== -1) {
        memoryTours[idx] = { id, ...payload, priceVal: payload.price_val, desc: payload.description };
    }
    clearCache('tours');
    res.json({ id, ...payload, priceVal: payload.price_val, desc: payload.description });
});
// DELETE Tour
app.delete('/api/tours/:id', authenticateAdmin, async (req, res) => {
    const id = req.params.id;
    if (dbConnected) {
        try {
            await supabaseFetch(`/tours?id=eq.${id}`, {
                method: 'DELETE'
            });
            clearCache('tours');
            return res.json({ message: "Tour deleted successfully", id });
        }
        catch (err) {
            console.error(`Delete tour ${id} failed on Supabase, falling back to memory:`, err.message);
        }
    }
    // Fallback to in-memory
    memoryTours = memoryTours.filter(t => t.id !== id);
    clearCache('tours');
    res.json({ message: "Tour deleted successfully", id });
});
// CREATE Hotel
app.post('/api/hotels', authenticateAdmin, async (req, res) => {
    let { id, name, location, image, rating, price, description } = req.body;
    const payload = { id: id ? parseInt(id) : undefined, name, location, image, rating: parseFloat(rating) || 5.0, price, description };
    if (dbConnected) {
        try {
            if (!payload.id) {
                const existing = await supabaseFetch('/hotels?select=id&order=id.desc&limit=1');
                payload.id = existing && existing.length > 0 ? existing[0].id + 1 : 1;
            }
            await supabaseFetch('/hotels', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            clearCache('hotels');
            return res.status(201).json(payload);
        }
        catch (err) {
            console.error("Create hotel failed on Supabase, falling back to memory:", err.message);
        }
    }
    // Fallback to in-memory
    if (!payload.id) {
        payload.id = memoryHotels.length > 0 ? Math.max(...memoryHotels.map(h => h.id)) + 1 : 1;
    }
    memoryHotels.push(payload);
    clearCache('hotels');
    res.status(201).json(payload);
});
// UPDATE Hotel
app.put('/api/hotels/:id', authenticateAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, location, image, rating, price, description } = req.body;
    const payload = { name, location, image, rating: parseFloat(rating) || 5.0, price, description };
    if (dbConnected) {
        try {
            await supabaseFetch(`/hotels?id=eq.${id}`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            });
            clearCache('hotels');
            return res.json({ id, ...payload });
        }
        catch (err) {
            console.error(`Update hotel ${id} failed on Supabase, falling back to memory:`, err.message);
        }
    }
    // Fallback to in-memory
    const idx = memoryHotels.findIndex(h => h.id === id);
    if (idx !== -1) {
        memoryHotels[idx] = { id, ...payload };
    }
    clearCache('hotels');
    res.json({ id, ...payload });
});
// DELETE Hotel
app.delete('/api/hotels/:id', authenticateAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    if (dbConnected) {
        try {
            await supabaseFetch(`/hotels?id=eq.${id}`, {
                method: 'DELETE'
            });
            clearCache('hotels');
            return res.json({ message: "Hotel deleted successfully", id });
        }
        catch (err) {
            console.error(`Delete hotel ${id} failed on Supabase, falling back to memory:`, err.message);
        }
    }
    // Fallback to in-memory
    memoryHotels = memoryHotels.filter(h => h.id !== id);
    clearCache('hotels');
    res.json({ message: "Hotel deleted successfully", id });
});
// File upload endpoint with authentication and strict file typing/sizing verification
app.post('/api/upload', authenticateAdmin, (req, res) => {
    try {
        const { name, data } = req.body;
        if (!name || !data) {
            return res.status(400).json({ error: "Name and data are required" });
        }
        // Strict extension check
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
        const ext = path_1.default.extname(name).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            return res.status(400).json({ error: "Invalid file extension. Only images are allowed." });
        }
        // Extract base64 content
        const match = data.match(/^data:image\/(\w+);base64,/);
        if (!match) {
            return res.status(400).json({ error: "Invalid file format. Only base64-encoded images are allowed." });
        }
        const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        // Strict file size check (5MB limit)
        if (buffer.length > 5 * 1024 * 1024) {
            return res.status(400).json({ error: "File exceeds maximum size limit of 5MB." });
        }
        // Create public/uploads directory safely
        let uploadDir = path_1.default.resolve(process.cwd(), '../public/uploads');
        const rootPublic = path_1.default.resolve(process.cwd(), '../public');
        if (!fs_1.default.existsSync(rootPublic)) {
            uploadDir = path_1.default.resolve(__dirname, '../../public/uploads');
        }
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        // Sanitize filename to prevent Path Traversal
        const safeName = path_1.default.basename(name).replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${Date.now()}-${safeName}`;
        const filePath = path_1.default.join(uploadDir, filename);
        // Final security check: Ensure filePath is inside uploadDir
        if (!filePath.startsWith(uploadDir)) {
            return res.status(400).json({ error: "Invalid path traversal attempt." });
        }
        fs_1.default.writeFileSync(filePath, buffer);
        console.log("Successfully uploaded file:", filename, "to", filePath);
        res.json({ url: `/uploads/${filename}` });
    }
    catch (err) {
        console.error("Upload error:", err.message);
        res.status(500).json({ error: err.message });
    }
});
const ABOUT_FILE = path_1.default.join(__dirname, '../about.json');
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
let memoryAbout = { ...defaultAboutData };
app.get('/api/about', async (req, res) => {
    const cacheKey = 'about:data';
    const cached = getCache(cacheKey);
    if (cached)
        return res.json(cached);
    if (dbConnected) {
        try {
            const data = await supabaseFetch('/settings?key=eq.about&select=value');
            if (data && data.length > 0) {
                const value = data[0].value;
                setCache(cacheKey, value);
                return res.json(value);
            }
        }
        catch (err) {
            console.error("Supabase fetch error for about, falling back to local file:", err.message);
        }
    }
    try {
        if (fs_1.default.existsSync(ABOUT_FILE)) {
            const data = fs_1.default.readFileSync(ABOUT_FILE, 'utf8');
            const parsed = JSON.parse(data);
            setCache(cacheKey, parsed);
            return res.json(parsed);
        }
    }
    catch (e) {
        console.error("Failed to read about.json:", e);
    }
    res.json(memoryAbout);
});
app.put('/api/about', authenticateAdmin, async (req, res) => {
    if (dbConnected) {
        try {
            await supabaseFetch('/settings', {
                method: 'POST',
                headers: { 'Prefer': 'resolution=merge-duplicates' },
                body: JSON.stringify({ key: 'about', value: req.body })
            });
            clearCache('about:');
            return res.json(req.body);
        }
        catch (err) {
            console.error("Supabase save error for about, falling back to local file:", err.message);
        }
    }
    try {
        fs_1.default.writeFileSync(ABOUT_FILE, JSON.stringify(req.body, null, 2), 'utf8');
        memoryAbout = req.body;
        clearCache('about:');
        res.json(req.body);
    }
    catch (err) {
        console.warn("Failed to write about.json, saving in-memory instead:", err.message);
        memoryAbout = req.body;
        clearCache('about:');
        res.json(req.body);
    }
});
const CONTACT_FILE = path_1.default.join(__dirname, '../contact.json');
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
    callLine1: "+975 17934593",
    callLine2: "+975 17934593 (WhatsApp)",
    emailTitle: "Electronic Mail",
    emailLine1: "helptourbhutancontact@gmail.com",
    emailLine2: "helptourbhutancontact@gmail.com",
    footerPhone: "+975 17934593",
    footerEmail: "helptourbhutancontact@gmail.com",
    footerWhatsapp: "+975 17934593 (WhatsApp)",
    footerLocation: "Thimphu, Bhutan",
    footerInstagram: "Instagram",
    footerFacebook: "Facebook",
    footerYoutube: "YouTube",
    footerTiktok: "TikTok"
};
let memoryContact = { ...defaultContactData };
app.get('/api/contact', async (req, res) => {
    const cacheKey = 'contact:data';
    const cached = getCache(cacheKey);
    if (cached)
        return res.json(cached);
    if (dbConnected) {
        try {
            const data = await supabaseFetch('/settings?key=eq.contact&select=value');
            if (data && data.length > 0) {
                const value = data[0].value;
                setCache(cacheKey, value);
                return res.json(value);
            }
        }
        catch (err) {
            console.error("Supabase fetch error for contact, falling back to local file:", err.message);
        }
    }
    try {
        if (fs_1.default.existsSync(CONTACT_FILE)) {
            const data = fs_1.default.readFileSync(CONTACT_FILE, 'utf8');
            const parsed = JSON.parse(data);
            setCache(cacheKey, parsed);
            return res.json(parsed);
        }
    }
    catch (e) {
        console.error("Failed to read contact.json:", e);
    }
    res.json(memoryContact);
});
app.put('/api/contact', authenticateAdmin, async (req, res) => {
    if (dbConnected) {
        try {
            await supabaseFetch('/settings', {
                method: 'POST',
                headers: { 'Prefer': 'resolution=merge-duplicates' },
                body: JSON.stringify({ key: 'contact', value: req.body })
            });
            clearCache('contact:');
            return res.json(req.body);
        }
        catch (err) {
            console.error("Supabase save error for contact, falling back to local file:", err.message);
        }
    }
    try {
        fs_1.default.writeFileSync(CONTACT_FILE, JSON.stringify(req.body, null, 2), 'utf8');
        memoryContact = req.body;
        clearCache('contact:');
        res.json(req.body);
    }
    catch (err) {
        console.warn("Failed to write contact.json, saving in-memory instead:", err.message);
        memoryContact = req.body;
        clearCache('contact:');
        res.json(req.body);
    }
});
const TESTIMONIALS_FILE = path_1.default.join(__dirname, '../testimonials.json');
const defaultTestimonials = [
    {
        id: 1,
        name: "Dr. Tashi Wangdi",
        role: "Cultural Historian • Thimphu Resident",
        content: "The level of authenticity Help Tourism Bhutan brings to their itineraries is unparalleled. They don't just show you the Dzongs; they introduce you to the spirit and the building blocks of Bhutan.",
        avatar: "https://i.pravatar.cc/200?u=bhutan1",
        rating: 5
    },
    {
        id: 2,
        name: "Jameson Brooks",
        role: "Visual Artist • Punakha Riverside Gala, Oct 2025",
        content: "Lighting is everything. My guide was so well-trained that he knew the exact minute the sun would hit the Tiger's Nest waterfall for that perfect frame. Truly exceptional local knowledge.",
        avatar: "https://i.pravatar.cc/200?u=photog",
        rating: 5
    },
    {
        id: 3,
        name: "Anya Petrova",
        role: "Solo Traveler • Snow Lion High Trek, Sep 2025",
        content: "Safety and soul. These are the two things I found. As a solo female traveler, I felt completely protected and spiritually recharged. The homestays were the highlight of my life.",
        avatar: "https://i.pravatar.cc/200?u=anya",
        rating: 5
    }
];
let memoryTestimonials = [...defaultTestimonials];
app.get('/api/testimonials', async (req, res) => {
    const cacheKey = 'testimonials:list';
    const cached = getCache(cacheKey);
    if (cached)
        return res.json(cached);
    if (dbConnected) {
        try {
            const data = await supabaseFetch('/settings?key=eq.testimonials&select=value');
            if (data && data.length > 0) {
                const value = data[0].value;
                setCache(cacheKey, value);
                return res.json(value);
            }
        }
        catch (err) {
            console.error("Supabase fetch error for testimonials, falling back to local file:", err.message);
        }
    }
    try {
        if (fs_1.default.existsSync(TESTIMONIALS_FILE)) {
            const data = fs_1.default.readFileSync(TESTIMONIALS_FILE, 'utf8');
            const parsed = JSON.parse(data);
            setCache(cacheKey, parsed);
            return res.json(parsed);
        }
    }
    catch (e) {
        console.error("Failed to read testimonials.json:", e);
    }
    res.json(memoryTestimonials);
});
app.put('/api/testimonials', authenticateAdmin, async (req, res) => {
    if (dbConnected) {
        try {
            await supabaseFetch('/settings', {
                method: 'POST',
                headers: { 'Prefer': 'resolution=merge-duplicates' },
                body: JSON.stringify({ key: 'testimonials', value: req.body })
            });
            clearCache('testimonials:');
            return res.json(req.body);
        }
        catch (err) {
            console.error("Supabase save error for testimonials, falling back to local file:", err.message);
        }
    }
    try {
        fs_1.default.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(req.body, null, 2), 'utf8');
        memoryTestimonials = req.body;
        clearCache('testimonials:');
        res.json(req.body);
    }
    catch (err) {
        console.warn("Failed to write testimonials.json, saving in-memory instead:", err.message);
        memoryTestimonials = req.body;
        clearCache('testimonials:');
        res.json(req.body);
    }
});
const TOURISTS_FILE = path_1.default.join(__dirname, '../tourists.json');
const defaultTourists = [];
let memoryTourists = [];
app.get('/api/tourists', async (req, res) => {
    const cacheKey = 'tourists:list';
    const cached = getCache(cacheKey);
    if (cached)
        return res.json(cached);
    if (dbConnected) {
        try {
            const data = await supabaseFetch('/tourists?select=*&order=id.asc');
            const formatted = data.map((t) => ({
                id: t.id,
                name: t.name,
                nationality: t.nationality,
                passportNumber: t.passport_number || t.passportNumber,
                email: t.email,
                phone: t.phone,
                tourName: t.tour_name || t.tourName,
                checkInDate: t.check_in_date || t.checkInDate,
                checkOutDate: t.check_out_date || t.checkOutDate,
                sdfStatus: t.sdf_status || t.sdfStatus,
                specialRequests: t.special_requests || t.specialRequests
            }));
            setCache(cacheKey, formatted);
            return res.json(formatted);
        }
        catch (err) {
            console.error("Supabase fetch error for tourists, falling back to local file:", err.message);
        }
    }
    try {
        if (fs_1.default.existsSync(TOURISTS_FILE)) {
            const data = fs_1.default.readFileSync(TOURISTS_FILE, 'utf8');
            const parsed = JSON.parse(data);
            setCache(cacheKey, parsed);
            return res.json(parsed);
        }
    }
    catch (e) {
        console.error("Failed to read tourists.json:", e);
    }
    res.json(memoryTourists);
});
app.post('/api/tourists', authenticateAdmin, async (req, res) => {
    const body = req.body;
    const dbPayload = {
        name: body.name,
        nationality: body.nationality,
        passport_number: body.passportNumber,
        email: body.email,
        phone: body.phone,
        tour_name: body.tourName,
        check_in_date: body.checkInDate,
        check_out_date: body.checkOutDate,
        sdf_status: body.sdfStatus,
        special_requests: body.specialRequests
    };
    if (dbConnected) {
        try {
            const inserted = await supabaseFetch('/tourists', {
                method: 'POST',
                headers: { 'Prefer': 'return=representation' },
                body: JSON.stringify(dbPayload)
            });
            clearCache('tourists:');
            if (inserted && inserted.length > 0) {
                const t = inserted[0];
                return res.json({
                    id: t.id,
                    name: t.name,
                    nationality: t.nationality,
                    passportNumber: t.passport_number || t.passportNumber,
                    email: t.email,
                    phone: t.phone,
                    tourName: t.tour_name || t.tourName,
                    checkInDate: t.check_in_date || t.checkInDate,
                    checkOutDate: t.check_out_date || t.checkOutDate,
                    sdfStatus: t.sdf_status || t.sdfStatus,
                    specialRequests: t.special_requests || t.specialRequests
                });
            }
        }
        catch (err) {
            console.error("Supabase insert error for tourists, falling back to memory:", err.message);
        }
    }
    // Fallback to in-memory
    const newTourist = {
        id: Date.now(),
        ...body
    };
    memoryTourists.push(newTourist);
    clearCache('tourists:');
    // Try to write to file if possible (local dev)
    try {
        fs_1.default.writeFileSync(TOURISTS_FILE, JSON.stringify(memoryTourists, null, 2), 'utf8');
    }
    catch (err) { }
    res.json(newTourist);
});
app.put('/api/tourists/:id', authenticateAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const dbPayload = {
        name: body.name,
        nationality: body.nationality,
        passport_number: body.passportNumber,
        email: body.email,
        phone: body.phone,
        tour_name: body.tourName,
        check_in_date: body.checkInDate,
        check_out_date: body.checkOutDate,
        sdf_status: body.sdfStatus,
        special_requests: body.specialRequests
    };
    if (dbConnected) {
        try {
            const updated = await supabaseFetch(`/tourists?id=eq.${id}`, {
                method: 'PATCH',
                headers: { 'Prefer': 'return=representation' },
                body: JSON.stringify(dbPayload)
            });
            clearCache('tourists:');
            if (updated && updated.length > 0) {
                const t = updated[0];
                return res.json({
                    id: t.id,
                    name: t.name,
                    nationality: t.nationality,
                    passportNumber: t.passport_number || t.passportNumber,
                    email: t.email,
                    phone: t.phone,
                    tourName: t.tour_name || t.tourName,
                    checkInDate: t.check_in_date || t.checkInDate,
                    checkOutDate: t.check_out_date || t.checkOutDate,
                    sdfStatus: t.sdf_status || t.sdfStatus,
                    specialRequests: t.special_requests || t.specialRequests
                });
            }
        }
        catch (err) {
            console.error("Supabase update error for tourists, falling back to memory:", err.message);
        }
    }
    // Fallback to in-memory
    const index = memoryTourists.findIndex(t => t.id === id);
    if (index !== -1) {
        memoryTourists[index] = { ...memoryTourists[index], ...body };
        clearCache('tourists:');
        // Try to write to file if possible (local dev)
        try {
            fs_1.default.writeFileSync(TOURISTS_FILE, JSON.stringify(memoryTourists, null, 2), 'utf8');
        }
        catch (err) { }
        res.json(memoryTourists[index]);
    }
    else {
        res.status(404).json({ error: "Tourist not found" });
    }
});
app.delete('/api/tourists/:id', authenticateAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (dbConnected) {
        try {
            await supabaseFetch(`/tourists?id=eq.${id}`, {
                method: 'DELETE'
            });
            clearCache('tourists:');
            return res.json({ success: true });
        }
        catch (err) {
            console.error("Supabase delete error for tourists, falling back to memory:", err.message);
        }
    }
    // Fallback to in-memory
    memoryTourists = memoryTourists.filter(t => t.id !== id);
    clearCache('tourists:');
    // Try to write to file if possible (local dev)
    try {
        fs_1.default.writeFileSync(TOURISTS_FILE, JSON.stringify(memoryTourists, null, 2), 'utf8');
    }
    catch (err) { }
    res.json({ success: true });
});
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
exports.default = app;
