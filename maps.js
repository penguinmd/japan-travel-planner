// maps.js - Single map instance with city-based updates
// UPDATED VERSION - ALL LOCATIONS FROM HTML INCLUDED

const cityLocations = {
    tokyo: [
        // LOCATIONS/ATTRACTIONS
        { name: "Shinjuku", lat: 35.6938, lng: 139.7034, type: "location" },
        { name: "Golden Gai", lat: 35.6945, lng: 139.7044, type: "location" },
        { name: "Shibuya Crossing", lat: 35.6595, lng: 139.7004, type: "location" },
        { name: "Imperial Palace", lat: 35.6852, lng: 139.7528, type: "location" },
        { name: "Meiji Jingu Shrine", lat: 35.6764, lng: 139.6993, type: "location" },
        { name: "Senso-ji Temple", lat: 35.7148, lng: 139.7967, type: "location" },
        { name: "Tokyo Skytree", lat: 35.7101, lng: 139.8107, type: "location" },
        { name: "Shibuya Scramble Square", lat: 35.6580, lng: 139.7016, type: "location" },
        { name: "Magnet Building (Shibuya View)", lat: 35.6595, lng: 139.7005, type: "location" },

        // HOTELS
        { name: "Hotel Gracery (Godzilla)", lat: 35.6956, lng: 139.7019, type: "hotel" },

        // RESTAURANTS/FOOD
        { name: "Omoide Yokocho", lat: 35.6936, lng: 139.7008, type: "restaurant" },
        { name: "Tsukiji Outer Market", lat: 35.6654, lng: 139.7707, type: "restaurant" },
        { name: "Tsurutontan Udon Shibuya", lat: 35.6580, lng: 139.7016, type: "restaurant" },
        { name: "Yurakucho Kakida Sushi", lat: 35.6865, lng: 139.7004, type: "restaurant" },
        { name: "Fu-unji Ramen", lat: 35.6840, lng: 139.7012, type: "restaurant" }
    ],

    kyoto: [
        // LOCATIONS/ATTRACTIONS
        { name: "Fushimi Inari Shrine", lat: 34.9671, lng: 135.7727, type: "location" },
        { name: "Kinkaku-ji (Golden Pavilion)", lat: 35.0394, lng: 135.7292, type: "location" },
        { name: "Arashiyama Bamboo Grove", lat: 35.0170, lng: 135.6719, type: "location" },
        { name: "Monkey Park Iwatayama", lat: 35.0127, lng: 135.6761, type: "location" },
        { name: "Gion District", lat: 35.0036, lng: 135.7750, type: "location" },
        { name: "Kiyomizu-dera Temple", lat: 34.9949, lng: 135.7850, type: "location" },
        { name: "Hōkan-ji (Yasaka Pagoda)", lat: 34.9981, lng: 135.7802, type: "location" },
        { name: "Hanamikoji Street", lat: 35.0035, lng: 135.7751, type: "location" },
        { name: "Sannenzaka Street", lat: 34.9975, lng: 135.7815, type: "location" },
        { name: "Ninenzaka Street", lat: 34.9972, lng: 135.7810, type: "location" },
        { name: "Nishiki Market", lat: 35.0050, lng: 135.7661, type: "location" },
        { name: "Pontocho Alley", lat: 35.0042, lng: 135.7712, type: "location" },

        // HOTELS
        { name: "Crystal Gion Hotel", lat: 35.0020, lng: 135.7730, type: "hotel" },

        // RESTAURANTS/FOOD/BARS
        { name: "K36 Rooftop Bar", lat: 34.9981, lng: 135.7802, type: "restaurant" },
        { name: "Hanamichi Restaurant", lat: 35.0035, lng: 135.7740, type: "restaurant" },
        { name: "Lorimer Kyoto", lat: 35.0005, lng: 135.7590, type: "restaurant" },
        { name: "Sushi and Bar Spot", lat: 35.0035, lng: 135.7750, type: "restaurant" },
        { name: "Pontocho-noichi (Kobe Beef)", lat: 35.0042, lng: 135.7712, type: "restaurant" },
        { name: "Taisho Hanana (Sea Bream)", lat: 35.0145, lng: 135.6748, type: "restaurant" },
        { name: "Inari Douhachi Udon", lat: 34.9671, lng: 135.7730, type: "restaurant" }
    ],

    osaka: [
        // LOCATIONS/ATTRACTIONS
        { name: "Dotonbori", lat: 34.6686, lng: 135.5006, type: "location" },
        { name: "Osaka Castle", lat: 34.6873, lng: 135.5262, type: "location" },
        { name: "Shinsekai", lat: 34.6524, lng: 135.5065, type: "location" },
        { name: "Kuromon Market", lat: 34.6662, lng: 135.5065, type: "location" },
        { name: "Namba", lat: 34.6662, lng: 135.5011, type: "location" },

        // HOTELS
        { name: "APA Namba Ekimae Hotel", lat: 34.6600, lng: 135.5000, type: "hotel" },

        // RESTAURANTS/FOOD
        { name: "Teppan Jinja", lat: 34.6686, lng: 135.5020, type: "restaurant" },
        { name: "Suehiro Sushi (Kuromon)", lat: 34.6662, lng: 135.5070, type: "restaurant" },
        { name: "Entoki Kuromon (Best Tuna)", lat: 34.6660, lng: 135.5065, type: "restaurant" }
    ],

    kinosaki: [
        // LOCATIONS/ATTRACTIONS
        { name: "Kinosaki Onsen Town", lat: 35.6274, lng: 134.8095, type: "location" },
        { name: "Kinosaki Ropeway", lat: 35.6313, lng: 134.8097, type: "location" },

        // HOTELS
        { name: "Nishimuraya Hotel", lat: 35.6274, lng: 134.8095, type: "hotel" },

        // RESTAURANTS/FOOD
        { name: "Gina Pizza", lat: 35.6254, lng: 134.8080, type: "restaurant" },
        { name: "Cable Car Mountain Café", lat: 35.6313, lng: 134.8097, type: "restaurant" }
    ],

    kanazawa: [
        // LOCATIONS/ATTRACTIONS
        { name: "Kenrokuen Garden", lat: 36.5618, lng: 136.6628, type: "location" },
        { name: "Kanazawa Castle", lat: 36.5655, lng: 136.6596, type: "location" },
        { name: "Higashi Chaya District", lat: 36.5717, lng: 136.6639, type: "location" },
        { name: "Omicho Market", lat: 36.5680, lng: 136.6576, type: "location" },
        { name: "21st Century Museum", lat: 36.5608, lng: 136.6581, type: "location" },

        // HOTELS
        { name: "Tokyu Stay Kanazawa Hotel", lat: 36.5650, lng: 136.6550, type: "hotel" },

        // RESTAURANTS/FOOD
        { name: "Uva Uva (Italian Fusion)", lat: 36.5590, lng: 136.6545, type: "restaurant" },
        { name: "Ramen Mikoshi", lat: 36.5700, lng: 136.6600, type: "restaurant" },
        { name: "Furansu Cocktail Bar", lat: 36.5590, lng: 136.6545, type: "restaurant" },
        { name: "Fukumitsuya Higashi Sake", lat: 36.5740, lng: 136.6650, type: "restaurant" },
        { name: "Higashiyama Yoshi Donburi", lat: 36.5717, lng: 136.6639, type: "restaurant" }
    ]
};

// Global map instance
let mainMapInstance = null;
let currentCityMarkers = [];
let mapFilters = {
    locations: true,
    hotels: true,
    restaurants: true
};

// Initialize single map instance
function initializeMainMap() {
    if (mainMapInstance) {
        return; // Already initialized
    }

    const mapElement = document.getElementById('main-map');
    if (!mapElement) {
        console.error('Map container not found');
        return;
    }

    // Create map centered on Japan
    mainMapInstance = L.map('main-map', {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView([36.2048, 138.2529], 6); // Center of Japan

    // Add dark tile layer - CartoDB Dark Matter
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(mainMapInstance);

    // Error handling
    mainMapInstance.on('tileerror', function(error) {
        console.warn('Tile loading error:', error);
    });
}

// Update map to show specific city
function updateMapForCity(cityKey) {
    if (!mainMapInstance) {
        initializeMainMap();
    }

    const locations = cityLocations[cityKey];
    if (!locations) {
        console.warn('No locations for city:', cityKey);
        return;
    }

    // Clear existing markers
    currentCityMarkers.forEach(marker => marker.remove());
    currentCityMarkers = [];

    // Calculate center
    const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;

    // Fly to city with animation
    mainMapInstance.flyTo([avgLat, avgLng], 13, {
        duration: 1.5,
        easeLinearity: 0.25
    });

    // Add markers after animation starts
    setTimeout(() => {
        locations.forEach((loc, index) => {
            // Skip if filtered out
            if (loc.type === 'location' && !mapFilters.locations) return;
            if (loc.type === 'hotel' && !mapFilters.hotels) return;
            if (loc.type === 'restaurant' && !mapFilters.restaurants) return;

            // Choose color based on type
            let markerColor;
            switch(loc.type) {
                case 'hotel':
                    markerColor = '#5d5d81'; // Indigo
                    break;
                case 'restaurant':
                    markerColor = '#d4a5a5'; // Sakura
                    break;
                default: // location
                    markerColor = '#7d8f69'; // Matcha
            }

            const marker = L.marker([loc.lat, loc.lng], {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background: ${markerColor}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">${index + 1}</div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                }),
                locationType: loc.type
            }).addTo(mainMapInstance);

            // Click opens Google Maps in new tab
            marker.on('click', () => {
                window.open(`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`, '_blank');
            });

            // Hover shows tooltip
            marker.bindTooltip(loc.name, {
                permanent: false,
                direction: 'top'
            });

            currentCityMarkers.push(marker);
        });

        // Fit bounds to show all markers
        const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
        mainMapInstance.fitBounds(bounds, {
            padding: [80, 80],
            maxZoom: 14
        });
    }, 800);
}

// Toggle map filter
function toggleMapFilter(filterType) {
    mapFilters[filterType] = !mapFilters[filterType];

    // Re-render current city
    const currentSection = document.querySelector('.content-section.active');
    if (currentSection) {
        const sectionId = currentSection.id;
        const cityMap = {
            'tokyo': 'tokyo',
            'kyoto': 'kyoto',
            'osaka': 'osaka',
            'kinosaki': 'kinosaki',
            'kanazawa': 'kanazawa'
        };

        if (cityMap[sectionId]) {
            updateMapForCity(sectionId);
        }
    }
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeMainMap, 100);
    });
} else {
    setTimeout(initializeMainMap, 100);
}
