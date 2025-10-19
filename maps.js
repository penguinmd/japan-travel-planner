// maps.js - Multi-marker map generator using Leaflet.js

const cityLocations = {
    tokyo: [
        { name: "Shinjuku", lat: 35.6938, lng: 139.7034 },
        { name: "Omoide Yokocho", lat: 35.6936, lng: 139.7008 },
        { name: "Golden Gai", lat: 35.6945, lng: 139.7044 },
        { name: "Shibuya Crossing", lat: 35.6595, lng: 139.7004 },
        { name: "Imperial Palace", lat: 35.6852, lng: 139.7528 },
        { name: "Meiji Jingu Shrine", lat: 35.6764, lng: 139.6993 },
        { name: "Tsukiji Outer Market", lat: 35.6654, lng: 139.7707 },
        { name: "Senso-ji Temple", lat: 35.7148, lng: 139.7967 },
        { name: "Tokyo Skytree", lat: 35.7101, lng: 139.8107 }
    ],
    kyoto: [
        { name: "Fushimi Inari Shrine", lat: 34.9671, lng: 135.7727 },
        { name: "Kinkaku-ji (Golden Pavilion)", lat: 35.0394, lng: 135.7292 },
        { name: "Arashiyama Bamboo Grove", lat: 35.0170, lng: 135.6719 },
        { name: "Monkey Park Iwatayama", lat: 35.0127, lng: 135.6761 },
        { name: "Gion District", lat: 35.0036, lng: 135.7750 },
        { name: "Nishiki Market", lat: 35.0050, lng: 135.7661 },
        { name: "Pontocho Alley", lat: 35.0042, lng: 135.7712 },
        { name: "Kiyomizu-dera Temple", lat: 34.9949, lng: 135.7850 }
    ],
    osaka: [
        { name: "Dotonbori", lat: 34.6686, lng: 135.5006 },
        { name: "Osaka Castle", lat: 34.6873, lng: 135.5262 },
        { name: "Shinsekai", lat: 34.6524, lng: 135.5065 },
        { name: "Kuromon Market", lat: 34.6662, lng: 135.5065 },
        { name: "Namba", lat: 34.6662, lng: 135.5011 }
    ],
    kinosaki: [
        { name: "Kinosaki Onsen Town", lat: 35.6274, lng: 134.8095 },
        { name: "Kinosaki Ropeway", lat: 35.6313, lng: 134.8097 },
        { name: "Nishimuraya Hotel", lat: 35.6274, lng: 134.8095 }
    ],
    kanazawa: [
        { name: "Kenrokuen Garden", lat: 36.5618, lng: 136.6628 },
        { name: "Kanazawa Castle", lat: 36.5655, lng: 136.6596 },
        { name: "Higashi Chaya District", lat: 36.5717, lng: 136.6639 },
        { name: "Omicho Market", lat: 36.5680, lng: 136.6576 },
        { name: "21st Century Museum", lat: 36.5608, lng: 136.6581 }
    ]
};

// Custom map marker icon
const customIcon = L.divIcon({
    className: 'custom-marker',
    html: '<div style="background: var(--accent-secondary); width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"><div style="transform: rotate(45deg); color: white; font-weight: bold; text-align: center; line-height: 24px; font-size: 14px;"></div></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
});

// Create and initialize a map for a city
function createCityMap(cityKey) {
    const locations = cityLocations[cityKey];
    if (!locations || locations.length === 0) return;

    const mapId = `map-${cityKey}`;
    const mapElement = document.getElementById(mapId);
    if (!mapElement) return;

    // Calculate center point
    const avgLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;

    // Create map
    const map = L.map(mapId, {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView([avgLat, avgLng], 13);

    // Add map tile layer - using CartoDB Dark Matter for dark mode compatibility
    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    });

    tileLayer.addTo(map);

    // Error handling for tile loading
    tileLayer.on('tileerror', function(error) {
        console.warn('Tile loading error:', error);
    });

    // Add markers for each location
    locations.forEach((loc, index) => {
        const marker = L.marker([loc.lat, loc.lng], {
            icon: L.divIcon({
                className: 'custom-marker',
                html: `<div style="background: var(--accent-secondary); width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">${index + 1}</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            })
        }).addTo(map);

        // Create popup with location name and link
        const popupContent = `
            <div style="color: #000; min-width: 150px;">
                <strong style="font-size: 14px; display: block; margin-bottom: 8px;">${index + 1}. ${loc.name}</strong>
                <a href="https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}"
                   target="_blank"
                   style="color: var(--accent-primary); text-decoration: none; font-size: 12px;">
                    📍 Open in Google Maps →
                </a>
            </div>
        `;
        marker.bindPopup(popupContent);
    });

    // Fit bounds to show all markers with generous padding
    const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
    map.fitBounds(bounds, {
        padding: [80, 80],
        maxZoom: 14  // Prevent zooming in too close
    });

    // Force map to invalidate size and recalculate after a moment
    setTimeout(() => {
        map.invalidateSize();
        map.fitBounds(bounds, {
            padding: [80, 80],
            maxZoom: 14
        });
    }, 250);
}

// Create map HTML structure
function createCityMapHTML(cityKey) {
    const locations = cityLocations[cityKey];
    if (!locations) return '';

    const cityName = cityKey.charAt(0).toUpperCase() + cityKey.slice(1);

    return `
        <div style="background: var(--bg-tertiary); border-radius: 12px; padding: 24px; margin-bottom: 30px; border: 1px solid var(--border);">
            <h3 style="margin-top: 0; color: var(--accent-primary);">📍 ${cityName} - All Locations</h3>

            <!-- Location legend -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px; margin-bottom: 20px;">
                ${locations.map((loc, i) => `
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 0.9em;">
                        <div style="background: var(--accent-secondary); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; flex-shrink: 0;">${i + 1}</div>
                        <span style="color: var(--text-primary);">${loc.name}</span>
                    </div>
                `).join('')}
            </div>

            <!-- Map container -->
            <div id="map-${cityKey}" style="height: 600px; border-radius: 8px; border: 1px solid var(--border); z-index: 1;"></div>

            <p style="margin: 12px 0 0 0; font-size: 0.85em; color: var(--text-secondary);">
                💡 Click any marker on the map to see details and get directions
            </p>
        </div>
    `;
}

// Initialize all maps
function initializeMaps() {
    Object.keys(cityLocations).forEach(cityKey => {
        const section = document.getElementById(cityKey);
        if (section) {
            // Find existing map container or create new one
            let mapContainer = section.querySelector('.city-map-container');

            // Remove old map if exists
            const oldMapDiv = section.querySelector(`div[style*="background: #f8f9ff"]`);
            if (oldMapDiv) {
                oldMapDiv.remove();
            }

            if (!mapContainer) {
                mapContainer = document.createElement('div');
                mapContainer.className = 'city-map-container';
                // Insert after h2
                const h2 = section.querySelector('h2');
                if (h2) {
                    h2.parentNode.insertBefore(mapContainer, h2.nextSibling);
                }
            }

            mapContainer.innerHTML = createCityMapHTML(cityKey);

            // Initialize the map after a short delay to ensure DOM is ready
            setTimeout(() => createCityMap(cityKey), 100);
        }
    });
}

// Call initialization when DOM and Leaflet are ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeMaps, 500);
    });
} else {
    setTimeout(initializeMaps, 500);
}
