// map-interactions.js - Location card <-> Map pin interactions

let highlightedMarker = null;

function highlightMapPin(locationIndex, cityKey) {
    if (!currentCityMarkers[locationIndex]) return;

    const marker = currentCityMarkers[locationIndex];

    // Store original icon
    if (!marker._originalIcon) {
        marker._originalIcon = marker.getIcon();
    }

    // Create highlighted icon with pulse animation
    const highlightedIcon = L.divIcon({
        className: 'custom-marker highlighted',
        html: `<div class="map-pin-highlighted">${locationIndex + 1}</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });

    marker.setIcon(highlightedIcon);
    highlightedMarker = marker;

    // Optionally pan to marker
    mainMapInstance.panTo(marker.getLatLng(), {
        animate: true,
        duration: 0.5
    });
}

function unhighlightMapPin() {
    if (highlightedMarker && highlightedMarker._originalIcon) {
        highlightedMarker.setIcon(highlightedMarker._originalIcon);
        highlightedMarker = null;
    }
}
