let markers = [];
let markerCluster;
let immoMarkers = [];
let signalisationMarkers = [];
let displayImmoMarkers = true;
let displaySignalisationMarkers = false;

function toggleMarkers() {
    immoMarkers.forEach(marker => marker.setMap(displayImmoMarkers ? map : null));
    signalisationMarkers.forEach(marker => marker.setMap(displaySignalisationMarkers ? map : null));
    updateCluster();
}

function updateCluster() {
    if (markerCluster) {
        markerCluster.clearMarkers();
    }
    const visibleMarkers = [
        ...immoMarkers.filter(marker => marker.getMap() !== null),
        ...signalisationMarkers.filter(marker => marker.getMap() !== null)
    ];
    markerCluster = new markerClusterer.MarkerClusterer({
        map: map,
        markers: visibleMarkers
    });
}

function createMarkerIcon(price, superficie) {
    const formattedPrice = formatPrice(price);
    const svg = `
    <svg width="100" height="70" xmlns="http://www.w3.org/2000/svg">
        <path d="M 20 29 Q 20 10 40 9 L 60 9 Q 80 10 80 29 L 80 34 L 20 34 Z" style="fill: #2166ff;" />
        <text x="50" y="25" font-family="Arial" font-size="15" fill="white" text-anchor="middle" font-weight="bold">${superficie} M</text>
        
        <rect x="01" y="30" width="98" height="30" rx="15" ry="15" style="fill:#ffffff;stroke:#ffbc1c;stroke-width:3;" />
        <text x="50" y="50" font-family="Arial" font-size="16" fill="black" text-anchor="middle" font-weight="bold">${formattedPrice}</text>
        
        <path d="M 45 60 L 55 60 L 50 70 Z" style="fill:#4CAF50;" />
    </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}
