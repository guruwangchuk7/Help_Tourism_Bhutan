-- Table Definitions

CREATE TABLE IF NOT EXISTS destinations (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(512) NOT NULL,
    description TEXT NOT NULL,
    price VARCHAR(50) NOT NULL,
    rating NUMERIC(3, 2) NOT NULL,
    location VARCHAR(100) NOT NULL,
    altitude VARCHAR(50) DEFAULT '2,300m',
    ideal_stay VARCHAR(50) DEFAULT '4-5 Days',
    peak_period VARCHAR(50) DEFAULT 'Spring/Fall',
    language VARCHAR(50) DEFAULT 'Dzongkha'
);

CREATE TABLE IF NOT EXISTS attractions (
    id INT PRIMARY KEY,
    destination_id INT REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(512) NOT NULL
);

CREATE TABLE IF NOT EXISTS tours (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    nights INT NOT NULL,
    price VARCHAR(50) NOT NULL,
    price_val INT NOT NULL,
    image VARCHAR(512) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    exclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    itinerary JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS tour_editions (
    id SERIAL PRIMARY KEY,
    tour_id VARCHAR(100) REFERENCES tours(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    period VARCHAR(100) NOT NULL,
    price VARCHAR(50) NOT NULL,
    image VARCHAR(512) NOT NULL,
    icon VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS hotels (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    image VARCHAR(512) NOT NULL,
    rating NUMERIC(3, 2) NOT NULL,
    price VARCHAR(50) NOT NULL,
    description TEXT NOT NULL
);

-- Seed Data

INSERT INTO destinations (id, name, image, description, price, rating, location, altitude, ideal_stay, peak_period, language) VALUES
(1, 'Punakha Dzong', '/punakha-dzong.jpg', 'Punakha Dzong is one of Bhutan''s most majestic fortresses and the winter capital of the Drukpa Lineage. It offers stunning architecture, riverside views, and a rich historical experience.', '$120', 4.8, 'Punakha', '1,200m', '1-2 Days', 'Spring/Fall', 'Dzongkha'),
(2, 'Paro Taktsang', '/paro-taksang.jpg', 'Also known as Tiger’s Nest Monastery, Paro Taktsang clings to a cliff 900 meters above the Paro Valley. It is Bhutan''s most iconic pilgrimage site with breathtaking views.', '$150', 4.9, 'Paro', '3,120m', '1 Day (hike)', 'Spring/Fall', 'Dzongkha'),
(3, 'Dochula Pass', '/dochula-pass.jpg', 'Dochula Pass features 108 memorial chortens set against panoramic Himalayan mountains. It''s an excellent spot for photography and scenic drives.', '$95', 4.7, 'Thimphu', '3,100m', 'Half Day', 'Spring/Fall', 'Dzongkha'),
(4, 'Thimphu Valley', '/thimphu.jpg', 'The capital city of Bhutan, Thimphu is a unique blend of modern development and ancient traditions, being the only capital in the world without traffic lights.', '$110', 4.6, 'Thimphu', '2,330m', '2-3 Days', 'Year-round', 'Dzongkha'),
(5, 'Phobjikha Valley', '/monk.jpg', 'A vast U-shaped glacial valley, famous as the winter home of the rare black-necked cranes that migrate from the Tibetan Plateau.', '$130', 4.8, 'Wangdue Phodrang', '3,000m', '2 Days', 'Winter/Spring', 'Dzongkha'),
(6, 'Bumthang Valley', '/airport.jpg', 'The spiritual heartland of Bhutan, Bumthang is home to some of the country''s oldest and most sacred Buddhist temples and monasteries.', '$140', 4.9, 'Bumthang', '2,600m', '3-4 Days', 'Spring/Fall', 'Dzongkha')
ON CONFLICT (id) DO NOTHING;

INSERT INTO attractions (id, destination_id, name, description, image) VALUES
(1, 1, 'Punakha Suspension Bridge', 'The longest suspension bridge in Bhutan with stunning views over the Mo Chhu River.', '/punakha-bridge.jpg'),
(2, 3, 'Dochula Pass Chortens', '108 memorial chortens set against panoramic Himalayan mountains.', '/dochula-chortens.jpg'),
(3, 2, 'Paro Valley Viewpoint', 'Breathtaking view of Paro Valley and Tiger’s Nest Monastery.', '/paro-viewpoint.jpg')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tours (id, title, duration, nights, price, price_val, image, description, category, difficulty, inclusions, exclusions, itinerary) VALUES
(
  'bhutan-highlights',
  '4 Days Bhutan Highlights',
  '4 Days',
  3,
  '$999',
  999,
  '/paro-taksang.jpg',
  'A brief but immersive escape covering Tiger''s Nest and Thimphu''s key attractions.',
  'Cultural',
  'Easy',
  '["TCB Certified English-speaking tour guide", "Standard 3-Star accommodations", "Private transfers & driver", "All meals & entry visa fee", "All monument entrance fees"]'::jsonb,
  '["International flights to/from Paro", "Travel insurance", "Tips for guide and driver", "Alcoholic beverages & personal items"]'::jsonb,
  '[
    {"day": 1, "title": "Arrival in Paro & Drive to Thimphu", "desc": "Arrive at Paro International Airport. Meet your guide and transfer to Thimphu. Visit the Buddha Dordenma statue and the Memorial Chorten."},
    {"day": 2, "title": "Thimphu Sightseeing & Drive to Paro", "desc": "Explore Tashichho Dzong, the Simply Bhutan living museum, and local craft bazaars. In the afternoon, return to Paro."},
    {"day": 3, "title": "Hike to Paro Taktsang (Tiger''s Nest)", "desc": "Embark on the iconic 4-5 hour roundtrip trek to Tiger''s Nest Monastery, perched on a cliff 900m above the valley floor."},
    {"day": 4, "title": "Departure", "desc": "Transfer to Paro Airport for your onward international flight."}
  ]'::jsonb
),
(
  'cultural-journey',
  '7 Days Cultural Journey',
  '7 Days',
  6,
  '$1,699',
  1699,
  '/punakha-dzong.jpg',
  'Unveil the cultural heritage, majestic dzongs, and scenic passes across three valleys.',
  'Cultural',
  'Easy',
  '["TCB Certified English-speaking tour guide", "Standard 3-Star accommodations", "Private transfers & driver", "All meals & entry visa fee", "All monument entrance fees"]'::jsonb,
  '["International flights to/from Paro", "Travel & medical insurance", "Tips for guide and driver", "Alcoholic beverages & personal items"]'::jsonb,
  '[
    {"day": 1, "title": "Arrive Paro - Transfer to Thimphu", "desc": "Arrival in Paro, custom clearance. Drive to Thimphu. Relax and explore the capital town on foot."},
    {"day": 2, "title": "Thimphu Valley Exploration", "desc": "Visit the Folk Heritage Museum, National Library, School of Astrology, and the majestic Tashichho Dzong."},
    {"day": 3, "title": "Scenic Drive to Punakha via Dochula", "desc": "Cross the Dochula Pass (3,100m) and view the 108 memorial chortens and snow-capped Himalayan peaks. Descend to subtropical Punakha."},
    {"day": 4, "title": "Punakha Exploration & Suspension Bridge", "desc": "Visit Punakha Dzong, the fertility temple (Chimi Lhakhang), and hike across the longest suspension bridge in Bhutan."},
    {"day": 5, "title": "Punakha to Paro", "desc": "Drive back to Paro Valley. Visit Ta Dzong (National Museum) and Rinpung Dzong."},
    {"day": 6, "title": "Pilgrimage to Tiger''s Nest", "desc": "Hike up to Taktsang Monastery. In the evening, experience a traditional Bhutanese stone bath and farmhouse dinner."},
    {"day": 7, "title": "Farewell Bhutan", "desc": "Transfer to Paro Airport for departure."}
  ]'::jsonb
),
(
  'adventure-bhutan',
  '10 Days Adventure Bhutan',
  '10 Days',
  9,
  '$2,499',
  2499,
  '/dochula-pass.jpg',
  'A combination of standard sightseeing, pristine day hikes, and local river rafting.',
  'Adventure',
  'Moderate',
  '["TCB Certified adventure & cultural tour guide", "Private rafting equipment & river fees", "Standard 3-Star accommodations & camping gear", "Private transfers & logistics", "All meals, entry visa & monument fees"]'::jsonb,
  '["International airfare", "Personal trekking clothing/boots", "Tips and gratuities", "Personal expenses"]'::jsonb,
  '[
    {"day": 1, "title": "Arrive Paro & Sightseeing", "desc": "Arrive in Paro. Visit local dzongs and prepare gear for the upcoming adventure."},
    {"day": 2, "title": "Cycle through Thimphu Valley", "desc": "Transfer to Thimphu. Embark on a half-day mountain biking excursion around the northern ridges."},
    {"day": 3, "title": "Thimphu to Punakha & Rafting", "desc": "Cross Dochula Pass and raft down the Po Chhu (Male River) in Punakha Valley."},
    {"day": 4, "title": "Punakha to Phobjikha Valley", "desc": "Drive into Phobjikha glacial valley. Start a nature trail walk through pristine pine forests."},
    {"day": 5, "title": "Phobjikha Trekking Day", "desc": "Hike up to remote valleys, encountering local yak herders and remote farming communities."},
    {"day": 6, "title": "Phobjikha to Bumthang Valley", "desc": "Scenic drive crossing the Pelela Pass. Arrive in the spiritual heartland of Bumthang."},
    {"day": 7, "title": "Bumthang Valley Exploration", "desc": "Visit Jakar Dzong and the sacred burning lake (Mebar Tsho). Sample local red panda beer and cheese."},
    {"day": 8, "title": "Fly back to Paro", "desc": "Take a scenic domestic flight from Bumthang back to Paro. Visit local handicraft shops."},
    {"day": 9, "title": "Tiger''s Nest Pilgrimage", "desc": "Hike the iconic Tiger''s Nest trail. Celebrate the journey with a farewell dinner."},
    {"day": 10, "title": "Departure", "desc": "Transfer to Paro airport for final departure."}
  ]'::jsonb
),
(
  'luxury-escape',
  'Luxury Bhutan Escape',
  '6 Days',
  5,
  '$3,299',
  3299,
  '/monk.jpg',
  'Indulge in five-star luxury accommodations with private transfers and wellness treatments.',
  'Luxury',
  'Easy',
  '["5-Star Luxury resort stays (Amankora / Six Senses / COMO)", "Dedicated luxury private SUV & driver", "Premium English-speaking private guide", "All meals, visa fees, and top-tier spa treatment", "Private cultural blessing and butter lamp ceremony"]'::jsonb,
  '["International business class airfare", "Premium reserve wines & spirits", "Tips & gratuities"]'::jsonb,
  '[
    {"day": 1, "title": "Arrive Paro - Luxury Transfer to Thimphu", "desc": "Arrive in style. Transfer to your 5-star lodge in Thimphu. Enjoy a private welcoming spa session."},
    {"day": 2, "title": "Thimphu Royal Experiences", "desc": "Private VIP tour of Tashichho Dzong and a bespoke incense-making workshop."},
    {"day": 3, "title": "Dochula Pass to Punakha Luxury Lodge", "desc": "Private transfer to Punakha. Check into your valley-facing pool villa. Sunset drinks by the river."},
    {"day": 4, "title": "Punakha Blessings & Return to Paro", "desc": "Experience a private butter lamp lighting ceremony at Punakha Dzong before transferring back to Paro."},
    {"day": 5, "title": "Bespoke Tiger''s Nest Hike", "desc": "Hike up Tiger''s Nest at sunrise with a private champagne picnic lunch. Traditional hot stone bath in the evening."},
    {"day": 6, "title": "Departure", "desc": "Private VIP airport lounge access and departure."}
  ]'::jsonb
),
(
  'explore-central-bhutan',
  'Explore Central Bhutan',
  '8 Days',
  7,
  '$1,599',
  1599,
  '/central-buhtna.jpg',
  'Bhutan, a peaceful Himalayan kingdom, is a perfect place to relax, recharge, and reconnect with yourself. Tucked among its mountains, quiet retreats offer meditation, yoga, and holistic wellness for true inner peace.',
  'Spiritual',
  'Moderate',
  '["TCB Certified English-speaking tour guide", "Standard 3-Star accommodations", "Private transfers & driver", "All meals & entry visa fee", "All monument entrance fees"]'::jsonb,
  '["International flights to/from Paro", "Travel insurance", "Tips for guide and driver", "Alcoholic beverages & personal items"]'::jsonb,
  '[
    {"day": 1, "title": "Arrival in Paro", "desc": "Arrive at Paro International Airport. Meet your guide and transfer to Thimphu. Visit the Buddha Dordenma statue and the Memorial Chorten."},
    {"day": 2, "title": "Paro to Phobjikha", "desc": "Drive through scenic passes to the glacial Phobjikha Valley."},
    {"day": 3, "title": "Phobjikha to Trongsa", "desc": "Travel to Trongsa and visit the historic Trongsa Dzong."},
    {"day": 4, "title": "Trongsa to Bumthang", "desc": "Drive to Bumthang, the spiritual heartland of Bhutan."},
    {"day": 5, "title": "Bumthang to Punakha", "desc": "Travel back to the subtropical Punakha Valley."},
    {"day": 6, "title": "Punakha to Thimphu", "desc": "Drive to the capital city Thimphu and explore local attractions."},
    {"day": 7, "title": "Paro", "desc": "Return to Paro. Visit Ta Dzong and explore the local market."},
    {"day": 8, "title": "Departure", "desc": "Transfer to Paro Airport for your onward international flight."}
  ]'::jsonb
),
(
  'bhutan-culture-tour',
  'Bhutan Culture Tour',
  '5 Days',
  4,
  '$1,199',
  1199,
  '/Dzongs--1.jpg',
  'Explore Bhutan’s rich culture and heritage—an experience that stays with you. Bhutan’s landscape is filled with beautiful dzongs, monasteries, and traditional homes, decorated with colorful paintings and detailed carvings.',
  'Cultural',
  'Easy',
  '["TCB Certified English-speaking tour guide", "Standard 3-Star accommodations", "Private transfers & driver", "All meals & entry visa fee", "All monument entrance fees"]'::jsonb,
  '["International flights to/from Paro", "Travel insurance", "Tips for guide and driver", "Alcoholic beverages & personal items"]'::jsonb,
  '[
    {"day": 1, "title": "Arrival in Paro", "desc": "Arrive at Paro International Airport. Meet your guide and transfer to Thimphu."},
    {"day": 2, "title": "Thimphu to Punakha", "desc": "Drive to Punakha via Dochula Pass (3,100m)."},
    {"day": 3, "title": "Punakha to Paro", "desc": "Visit Punakha Dzong, then transfer back to Paro."},
    {"day": 4, "title": "Paro", "desc": "Hike up to Tiger''s Nest Monastery."},
    {"day": 5, "title": "Departure", "desc": "Transfer to Paro Airport for departure."}
  ]'::jsonb
),
(
  'paro-tshechu-festival',
  'Paro Tshechu Festival',
  '7 Days',
  6,
  '$1,599',
  1599,
  '/paro-tsechu-tour1521440368_850_400.jpg',
  'Bhutan invites you to experience a culture that stays with you long after you leave. Its stunning dzongs, monasteries, and traditional homes reflect deep craftsmanship and serve as both spiritual and community centers.',
  'Cultural',
  'Easy',
  '["TCB Certified English-speaking tour guide", "Standard 3-Star accommodations", "Private transfers & driver", "All meals & entry visa fee", "All monument entrance fees"]'::jsonb,
  '["International flights to/from Paro", "Travel insurance", "Tips for guide and driver", "Alcoholic beverages & personal items"]'::jsonb,
  '[
    {"day": 1, "title": "Arrival in Paro", "desc": "Arrive at Paro International Airport. Meet your guide and transfer to your hotel."},
    {"day": 2, "title": "Paro Tshechu Festival", "desc": "Attend the vibrant Paro Tshechu festival with mask dances and cultural activities."},
    {"day": 3, "title": "Paro to Thimphu", "desc": "Drive to Thimphu and explore Buddha Point, Tashichho Dzong."},
    {"day": 4, "title": "Thimphu to Punakha", "desc": "Cross Dochula Pass and travel to Punakha."},
    {"day": 5, "title": "Punakha to Paro", "desc": "Visit Chimi Lhakhang and return to Paro Valley."},
    {"day": 6, "title": "Tiger''s Nest Hike", "desc": "Hike up to the legendary Tiger''s Nest Monastery."},
    {"day": 7, "title": "Departure", "desc": "Transfer to Paro Airport for departure."}
  ]'::jsonb
),
(
  'nomad-festival-guide',
  'Nomad Festival Guide',
  '7 Days',
  6,
  '$1,699',
  1699,
  '/nomad1024x512-min.jpg',
  'Bhutan invites you to experience a culture that stays with you long after you leave. Its landscape is dotted with beautiful dzongs, monasteries, and traditional homes each reflecting the country’s rich craftsmanship and deep spiritual roots.',
  'Cultural',
  'Moderate',
  '["TCB Certified English-speaking tour guide", "Standard 3-Star accommodations", "Private transfers & driver", "All meals & entry visa fee", "All monument entrance fees"]'::jsonb,
  '["International flights to/from Paro", "Travel insurance", "Tips for guide and driver", "Alcoholic beverages & personal items"]'::jsonb,
  '[
    {"day": 1, "title": "Arrival in Paro", "desc": "Arrive at Paro International Airport. Meet your guide and transfer to Thimphu."},
    {"day": 2, "title": "Thimphu to Bumthang", "desc": "Travel to Bumthang, the spiritual heartland of Bhutan."},
    {"day": 3, "title": "Bumthang Nomad Festival", "desc": "Experience the colorful Nomad Festival showcasing local customs and livestock."},
    {"day": 4, "title": "Bumthang Sightseeing", "desc": "Visit Jakar Dzong, Kurjey Lhakhang, and Tamshing Lhakhang."},
    {"day": 5, "title": "Bumthang to Trongsa", "desc": "Drive to Trongsa and visit Trongsa Dzong."},
    {"day": 6, "title": "Trongsa to Paro", "desc": "Return to Paro Valley via scenic highways."},
    {"day": 7, "title": "Departure", "desc": "Transfer to Paro Airport for departure."}
  ]'::jsonb
),
(
  'gomphu-kora-festival',
  'Gomphu Kora Festival',
  '8 Days',
  7,
  '$1,899',
  1899,
  '/3649visit bhutan Gom Kora Tshechu (1).jpg',
  'An invitation to explore the intricacy of Bhutanese culture and heritage that is sure to leave an indelible mark on your heart. Enjoy ancient fortresses, religious activities, and vibrant traditions.',
  'Cultural',
  'Moderate',
  '["TCB Certified English-speaking tour guide", "Standard 3-Star accommodations", "Private transfers & driver", "All meals & entry visa fee", "All monument entrance fees"]'::jsonb,
  '["International flights to/from Paro", "Travel insurance", "Tips for guide and driver", "Alcoholic beverages & personal items"]'::jsonb,
  '[
    {"day": 1, "title": "Arrival in Paro", "desc": "Arrive at Paro International Airport. Meet your guide and transfer to your hotel."},
    {"day": 2, "title": "Thimphu to Bumthang", "desc": "Travel to Bumthang, the spiritual heartland of Bhutan."},
    {"day": 3, "title": "Bumthang to Trashigang", "desc": "Drive to Trashigang in eastern Bhutan."},
    {"day": 4, "title": "Trashigang to Gomphu Kora", "desc": "Attend the famous Gomphu Kora festival (40 minutes'' drive from Trashigang)."},
    {"day": 5, "title": "Trashigang to Gomphu Kora", "desc": "Further immersion into the festival rituals and dances."},
    {"day": 6, "title": "Trashigang to Trongsa", "desc": "Drive back to Trongsa Valley."},
    {"day": 7, "title": "Trongsa to Paro", "desc": "Return to Paro Valley."},
    {"day": 8, "title": "Departure", "desc": "Transfer to Paro Airport for departure."}
  ]'::jsonb
),
(
  'rhododendron-festival',
  'Rhododendron Festival',
  '5 Days',
  4,
  '$1,299',
  1299,
  '/rhododendronfest1500x650.jpg',
  'Bhutan: A Floral Symphony. Within the borders of Bhutan, there are over 46 varieties of rhododendron. Attend the festival and explore the beautiful nature trails.',
  'Adventure',
  'Easy',
  '["TCB Certified English-speaking tour guide", "Standard 3-Star accommodations", "Private transfers & driver", "All meals & entry visa fee", "All monument entrance fees"]'::jsonb,
  '["International flights to/from Paro", "Travel insurance", "Tips for guide and driver", "Alcoholic beverages & personal items"]'::jsonb,
  '[
    {"day": 1, "title": "Arrival in Paro", "desc": "Arrive at Paro International Airport. Meet your guide and transfer to Thimphu."},
    {"day": 2, "title": "Thimphu-Lam Pelri Botanical Park", "desc": "Attend the Rhododendron Festival at Lam Pelri Botanical Park."},
    {"day": 3, "title": "Punakha and Wangdue", "desc": "Drive to Punakha and explore the Punakha Dzong and suspension bridge."},
    {"day": 4, "title": "Punakha to Paro", "desc": "Return to Paro and visit Ta Dzong."},
    {"day": 5, "title": "Departure", "desc": "Transfer to Paro Airport for departure."}
  ]'::jsonb
),
(
  'black-necked-crane-bird-festival',
  'Black Necked Crane - Bird Festival',
  '7 Days',
  6,
  '$1,599',
  1599,
  '/Black Necked Crane - Bird Festival.jpg',
  'Celebrate the arrival of the rare Black-Necked Cranes in Phobjikha Valley. Immerse yourself in the festival, traditional masked dances, and local community gatherings.',
  'Adventure',
  'Easy',
  '["TCB Certified English-speaking tour guide", "Standard 3-Star accommodations", "Private transfers & driver", "All meals & entry visa fee", "All monument entrance fees"]'::jsonb,
  '["International flights to/from Paro", "Travel insurance", "Tips for guide and driver", "Alcoholic beverages & personal items"]'::jsonb,
  '[
    {"day": 1, "title": "Arrival in Paro", "desc": "Arrive at Paro International Airport. Meet your guide and transfer to your hotel."},
    {"day": 2, "title": "Thimphu to Phobjikha", "desc": "Drive to Phobjikha Valley via Dochula Pass."},
    {"day": 3, "title": "Punakha to Zhemgang", "desc": "Travel to Zhemgang, a birdwatcher''s paradise."},
    {"day": 4, "title": "Tingtibi, Zhemgang", "desc": "Attend the Bird Festival in Tingtibi and explore nearby trails."},
    {"day": 5, "title": "Tingtibi to Trongsa", "desc": "Travel to Trongsa and visit the museum."},
    {"day": 6, "title": "Trongsa to Paro", "desc": "Drive back to Paro Valley."},
    {"day": 7, "title": "Departure", "desc": "Transfer to Paro Airport for departure."}
  ]'::jsonb
),
(
  'trans-bhutan-trail-an-experience',
  'Trans Bhutan Trail An Experience',
  '4 Days',
  3,
  '$999',
  999,
  '/Trans Bhutan Trail An Experience.jpeg',
  'Embark on a wellness and spiritual journey along the historic Trans Bhutan Trail. Connect with nature and cultivate mindfulness in Bhutan''s breathtaking landscapes.',
  'Adventure',
  'Moderate',
  '["TCB Certified English-speaking tour guide", "Standard 3-Star accommodations", "Private transfers & driver", "All meals & entry visa fee", "All monument entrance fees"]'::jsonb,
  '["International flights to/from Paro", "Travel insurance", "Tips for guide and driver", "Alcoholic beverages & personal items"]'::jsonb,
  '[
    {"day": 1, "title": "Arrival in Paro", "desc": "Arrive at Paro International Airport. Meet your guide and transfer to your hotel."},
    {"day": 2, "title": "Paro to Haa", "desc": "Drive to the beautiful Haa Valley."},
    {"day": 3, "title": "Trans Bhutan Trail hike to Paro", "desc": "Hike along the historic Trans Bhutan Trail back to Paro."},
    {"day": 4, "title": "Departure", "desc": "Transfer to Paro Airport for departure."}
  ]'::jsonb
),
(
  'explore-eastern-bhutan',
  'Explore Eastern Bhutan',
  '11 Days',
  10,
  '$2,699',
  2699,
  '/Explore Eastern Bhutan.webp',
  'Delve into a journey of self-discovery and inner peace. Travel through less-visited Eastern Bhutanese valleys, discovering pristine scenery, weaving centers, and nomadic cultures.',
  'Adventure',
  'Moderate',
  '["TCB Certified English-speaking tour guide", "Standard 3-Star accommodations", "Private transfers & driver", "All meals & entry visa fee", "All monument entrance fees"]'::jsonb,
  '["International flights to/from Paro", "Travel insurance", "Tips for guide and driver", "Alcoholic beverages & personal items"]'::jsonb,
  '[
    {"day": 1, "title": "Arrival in Paro", "desc": "Arrive at Paro International Airport. Meet your guide and transfer to your hotel."},
    {"day": 2, "title": "Paro to Trongsa", "desc": "Drive to Trongsa, crossing passes."},
    {"day": 3, "title": "Trongsa to Bumthang", "desc": "Travel to Bumthang, the spiritual heartland."},
    {"day": 4, "title": "Bumthang to Mongar", "desc": "Journey to Mongar in eastern Bhutan."},
    {"day": 5, "title": "Mongar to Trashiyangtse", "desc": "Explore Trashiyangtse, famous for woodcarving."},
    {"day": 6, "title": "Trashigang to Merak", "desc": "Visit the semi-nomadic Brokpa village of Merak."},
    {"day": 7, "title": "Trashigang to Bumthang", "desc": "Begin the journey back westwards."},
    {"day": 8, "title": "Bumthang to Phobjikha", "desc": "Travel to the Phobjikha Valley."},
    {"day": 9, "title": "Phobjikha to Paro", "desc": "Return to Paro Valley."},
    {"day": 10, "title": "Paro Valley", "desc": "Hike to Tiger''s Nest Monastery."},
    {"day": 11, "title": "Departure", "desc": "Transfer to Paro Airport for departure."}
  ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, duration = EXCLUDED.duration, nights = EXCLUDED.nights, price = EXCLUDED.price, price_val = EXCLUDED.price_val, image = EXCLUDED.image, description = EXCLUDED.description, category = EXCLUDED.category, difficulty = EXCLUDED.difficulty, inclusions = EXCLUDED.inclusions, exclusions = EXCLUDED.exclusions, itinerary = EXCLUDED.itinerary;

INSERT INTO tour_editions (id, tour_id, title, period, price, image, icon) VALUES
(1, 'bhutan-highlights', 'The Paro Tshechu Edition', 'Spring (March-May)', '$3,499', '/paro-taksang.jpg', 'Sun'),
(2, 'adventure-bhutan', 'Snow Lion High Trek', 'Summer (June-Aug)', '$2,899', '/airport.jpg', 'CloudRain'),
(3, 'cultural-journey', 'Punakha Riverside Gala', 'Fall (Sept-Nov)', '$4,199', '/punakha-dzong.jpg', 'Heart'),
(4, 'luxury-escape', 'Black-Necked Crane Haven', 'Winter (Dec-Feb)', '$2,299', '/monk.jpg', 'Snowflake')
ON CONFLICT (id) DO NOTHING;

INSERT INTO hotels (id, name, location, image, rating, price, description) VALUES
(1, 'Amankora Resort', 'Paro, Thimphu, Punakha, Gangtey & Bumthang', '/paro-taksang.jpg', 5.0, '$1,800', 'A series of five ultra-luxury lodges spread across the pristine valleys, offering quiet elegance and unparalleled cultural immersion.'),
(2, 'Six Senses Bhutan', 'Thimphu, Punakha & Paro', '/punakha-dzong.jpg', 4.9, '$1,600', 'Designed to reflect the simplicity and beauty of the heritage sites, celebrating wellness, luxury, and the breathtaking scenery of Bhutan.'),
(3, 'COMO Uma Paro', 'Paro Valley', '/dochula-pass.jpg', 4.8, '$950', 'Combining luxury with adventure, COMO Uma Paro features private villas, fine dining, and holistic Asian-inspired therapies at Como Shambhala.'),
(4, 'Zhiwa Ling Heritage', 'Paro', '/monk.jpg', 4.7, '$450', 'A stunning locally-owned luxury hotel crafted in classic Bhutanese architectural heritage with modern guest amenities.')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, location = EXCLUDED.location, image = EXCLUDED.image, rating = EXCLUDED.rating, price = EXCLUDED.price, description = EXCLUDED.description;

CREATE TABLE IF NOT EXISTS public.tourists (
  id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
  name character varying NOT NULL,
  nationality character varying NOT NULL,
  passport_number character varying NOT NULL,
  email character varying NOT NULL,
  phone character varying NOT NULL,
  tour_name character varying NOT NULL,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  sdf_status character varying DEFAULT 'Paid'::character varying,
  special_requests text,
  CONSTRAINT tourists_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.settings (
  key character varying NOT NULL,
  value jsonb NOT NULL,
  CONSTRAINT settings_pkey PRIMARY KEY (key)
);

