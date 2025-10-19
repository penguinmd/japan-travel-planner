// maps.js - Single map instance with city-based updates
// UPDATED VERSION - ALL LOCATIONS FROM HTML INCLUDED

const cityLocations = {
    tokyo: [
        // EXISTING LOCATIONS
        { name: "Shinjuku", lat: 35.6938, lng: 139.7034 },
        { name: "Omoide Yokocho", lat: 35.6936, lng: 139.7008 },
        { name: "Golden Gai", lat: 35.6945, lng: 139.7044 },
        { name: "Shibuya Crossing", lat: 35.6595, lng: 139.7004 },
        { name: "Imperial Palace", lat: 35.6852, lng: 139.7528 },
        { name: "Meiji Jingu Shrine", lat: 35.6764, lng: 139.6993 },
        { name: "Tsukiji Outer Market", lat: 35.6654, lng: 139.7707 },
        { name: "Senso-ji Temple", lat: 35.7148, lng: 139.7967 },
        { name: "Tokyo Skytree", lat: 35.7101, lng: 139.8107 },

        // NEW LOCATIONS ADDED
        { name: "Hotel Gracery (Godzilla)", lat: 35.6956, lng: 139.7019 },
        { name: "Shibuya Scramble Square", lat: 35.6580, lng: 139.7016 },
        { name: "Tsurutontan Udon Shibuya", lat: 35.6580, lng: 139.7016 },
        { name: "Yurakucho Kakida Sushi", lat: 35.6865, lng: 139.7004 },
        { name: "Fu-unji Ramen", lat: 35.6840, lng: 139.7012 },
        { name: "Magnet Building (Shibuya View)", lat: 35.6595, lng: 139.7005 }
    ],

    kyoto: [
        // EXISTING LOCATIONS
        { name: "Fushimi Inari Shrine", lat: 34.9671, lng: 135.7727 },
        { name: "Kinkaku-ji (Golden Pavilion)", lat: 35.0394, lng: 135.7292 },
        { name: "Arashiyama Bamboo Grove", lat: 35.0170, lng: 135.6719 },
        { name: "Monkey Park Iwatayama", lat: 35.0127, lng: 135.6761 },
        { name: "Gion District", lat: 35.0036, lng: 135.7750 },
        { name: "Nishiki Market", lat: 35.0050, lng: 135.7661 },
        { name: "Pontocho Alley", lat: 35.0042, lng: 135.7712 },
        { name: "Kiyomizu-dera Temple", lat: 34.9949, lng: 135.7850 },

        // NEW LOCATIONS ADDED
        { name: "Hōkan-ji (Yasaka Pagoda)", lat: 34.9981, lng: 135.7802 },
        { name: "Hanamikoji Street", lat: 35.0035, lng: 135.7751 },
        { name: "Sannenzaka Street", lat: 34.9975, lng: 135.7815 },
        { name: "Ninenzaka Street", lat: 34.9972, lng: 135.7810 },
        { name: "K36 Rooftop Bar", lat: 34.9981, lng: 135.7802 },
        { name: "Crystal Gion Hotel", lat: 35.0020, lng: 135.7730 },
        { name: "Hanamichi Restaurant", lat: 35.0035, lng: 135.7740 },
        { name: "Lorimer Kyoto", lat: 35.0005, lng: 135.7590 },
        { name: "Sushi and Bar Spot", lat: 35.0035, lng: 135.7750 },
        { name: "Pontocho-noichi (Kobe Beef)", lat: 35.0042, lng: 135.7712 },
        { name: "Taisho Hanana (Sea Bream)", lat: 35.0145, lng: 135.6748 },
        { name: "Inari Douhachi Udon", lat: 34.9671, lng: 135.7730 }
    ],

    osaka: [
        // EXISTING LOCATIONS
        { name: "Dotonbori", lat: 34.6686, lng: 135.5006 },
        { name: "Osaka Castle", lat: 34.6873, lng: 135.5262 },
        { name: "Shinsekai", lat: 34.6524, lng: 135.5065 },
        { name: "Kuromon Market", lat: 34.6662, lng: 135.5065 },
        { name: "Namba", lat: 34.6662, lng: 135.5011 },

        // NEW LOCATIONS ADDED
        { name: "APA Namba Ekimae Hotel", lat: 34.6600, lng: 135.5000 },
        { name: "Teppan Jinja", lat: 34.6686, lng: 135.5020 },
        { name: "Suehiro Sushi (Kuromon)", lat: 34.6662, lng: 135.5070 },
        { name: "Entoki Kuromon (Best Tuna)", lat: 34.6660, lng: 135.5065 }
    ],

    kinosaki: [
        // EXISTING LOCATIONS
        { name: "Kinosaki Onsen Town", lat: 35.6274, lng: 134.8095 },
        { name: "Kinosaki Ropeway", lat: 35.6313, lng: 134.8097 },
        { name: "Nishimuraya Hotel", lat: 35.6274, lng: 134.8095 },

        // NEW LOCATIONS ADDED
        { name: "Gina Pizza", lat: 35.6254, lng: 134.8080 },
        { name: "Cable Car Mountain Café", lat: 35.6313, lng: 134.8097 }
    ],

    kanazawa: [
        // EXISTING LOCATIONS
        { name: "Kenrokuen Garden", lat: 36.5618, lng: 136.6628 },
        { name: "Kanazawa Castle", lat: 36.5655, lng: 136.6596 },
        { name: "Higashi Chaya District", lat: 36.5717, lng: 136.6639 },
        { name: "Omicho Market", lat: 36.5680, lng: 136.6576 },
        { name: "21st Century Museum", lat: 36.5608, lng: 136.6581 },

        // NEW LOCATIONS ADDED
        { name: "Tokyu Stay Kanazawa Hotel", lat: 36.5650, lng: 136.6550 },
        { name: "Uva Uva (Italian Fusion)", lat: 36.5590, lng: 136.6545 },
        { name: "Ramen Mikoshi", lat: 36.5700, lng: 136.6600 },
        { name: "Furansu Cocktail Bar", lat: 36.5590, lng: 136.6545 },
        { name: "Fukumitsuya Higashi Sake", lat: 36.5740, lng: 136.6650 },
        { name: "Higashiyama Yoshi Donburi", lat: 36.5717, lng: 136.6639 }
    ]
};

// Global map instance
let mainMapInstance = null;
let currentCityMarkers = [];

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
            const marker = L.marker([loc.lat, loc.lng], {
                icon: L.divIcon({
                    className: 'custom-marker',
                    html: `<div style="background: var(--accent-secondary); width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">${index + 1}</div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                })
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

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeMainMap, 100);
    });
} else {
    setTimeout(initializeMainMap, 100);
}
