"use strict";
const apikey = 'sb_publishable_RVaEhvDjI2TE6ctNgtiK2A_2g9slg0N';
const baseUrl = 'https://sahdrcajbflinfhlwgmb.supabase.co/rest/v1';
const destinations = [
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
const attractions = [
    { id: 1, destination_id: 1, name: "Punakha Suspension Bridge", description: "The longest suspension bridge in Bhutan with stunning views over the Mo Chhu River.", image: "/punakha-bridge.jpg" },
    { id: 2, destination_id: 3, name: "Dochula Pass Chortens", description: "108 memorial chortens set against panoramic Himalayan mountains.", image: "/dochula-chortens.jpg" },
    { id: 3, destination_id: 2, name: "Paro Valley Viewpoint", description: "Breathtaking view of Paro Valley and Tiger’s Nest Monastery.", image: "/paro-viewpoint.jpg" }
];
const tours = [
    {
        id: "bhutan-highlights",
        title: "4 Days Bhutan Highlights",
        duration: "4 Days",
        nights: 3,
        price: "$999",
        price_val: 999,
        image: "/paro-taksang.jpg",
        description: "A brief but immersive escape covering Tiger's Nest and Thimphu's key attractions.",
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
        price_val: 1699,
        image: "/punakha-dzong.jpg",
        description: "Unveil the cultural heritage, majestic dzongs, and scenic passes across three valleys.",
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
        price_val: 2499,
        image: "/dochula-pass.jpg",
        description: "A combination of standard sightseeing, pristine day hikes, and local river rafting.",
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
        price_val: 3299,
        image: "/monk.jpg",
        description: "Indulge in five-star luxury accommodations with private transfers and wellness treatments.",
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
const editions = [
    { id: 1, tour_id: "bhutan-highlights", title: "The Paro Tshechu Edition", period: "Spring (March-May)", price: "$3,499", image: "/paro-taksang.jpg", icon: "Sun" },
    { id: 2, tour_id: "adventure-bhutan", title: "Snow Lion High Trek", period: "Summer (June-Aug)", price: "$2,899", image: "/airport.jpg", icon: "CloudRain" },
    { id: 3, tour_id: "cultural-journey", title: "Punakha Riverside Gala", period: "Fall (Sept-Nov)", price: "$4,199", image: "/punakha-dzong.jpg", icon: "Heart" },
    { id: 4, tour_id: "luxury-escape", title: "Black-Necked Crane Haven", period: "Winter (Dec-Feb)", price: "$2,299", image: "/monk.jpg", icon: "Snowflake" }
];
const hotels = [
    { id: 1, name: "Amankora Resort", location: "Paro, Thimphu, Punakha, Gangtey & Bumthang", image: "/paro-taksang.jpg", rating: 5.0, price: "$1,800", description: "A series of five luxury lodges spread across valleys, offering quiet elegance." },
    { id: 2, name: "Six Senses Bhutan", location: "Thimphu, Punakha & Paro", image: "/punakha-dzong.jpg", rating: 4.9, price: "$1,600", description: "Reflecting simplicity and beauty of heritage, celebrating wellness." },
    { id: 3, name: "COMO Uma Paro", location: "Paro Valley", image: "/dochula-pass.jpg", rating: 4.8, price: "$950", description: "Private villas, fine dining, and holistic Asian-inspired therapies." },
    { id: 4, name: "Zhiwa Ling Heritage", location: "Paro", image: "/monk.jpg", rating: 4.7, price: "$450", description: "Stunning locally-owned luxury hotel crafted in classic Bhutanese heritage." }
];
async function seedTable(tableName, data) {
    console.log(`Seeding ${tableName}...`);
    const res = await fetch(`${baseUrl}/${tableName}`, {
        method: 'POST',
        headers: {
            'apikey': apikey,
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(data)
    });
    console.log(`Seeding ${tableName} status: ${res.status}`);
    if (res.status >= 300) {
        console.error(`Failed to seed ${tableName}:`, await res.text());
    }
}
async function run() {
    try {
        await seedTable('destinations', destinations);
        await seedTable('attractions', attractions);
        await seedTable('tours', tours);
        await seedTable('tour_editions', editions);
        await seedTable('hotels', hotels);
        console.log('Seeding complete!');
    }
    catch (err) {
        console.error('Seeding error:', err);
    }
}
run();
