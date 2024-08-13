let markers = [];
let markerCluster;
let immoMarkers = [];
let signalisationMarkers = [];
let displayImmoMarkers = true;
let displaySignalisationMarkers = false;

function updateClusterMarkers() {
    console.log('Updating cluster with visible markers');
    if (markerCluster) {
        markerCluster.clearMarkers();
    }

    const visibleMarkers = immoMarkers.filter(marker => marker.getMap() !== null);
    markerCluster = new markerClusterer.MarkerClusterer({
        map: map,
        markers: visibleMarkers,
        renderer: {
            render: ({ count, position }) => {
                const div = document.createElement('div');
                div.style.backgroundColor = 'red';
                div.style.border = '2px solid white';
                div.style.borderRadius = '50%';
                div.style.color = 'white';
                div.style.textAlign = 'center';
                div.style.lineHeight = '40px';
                div.style.width = '40px';
                div.style.height = '40px';
                div.innerText = count;
                return new google.maps.Marker({
                    position,
                    icon: {
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(div.outerHTML),
                        scaledSize: new google.maps.Size(40, 40),
                    },
                });
            },
        },
    });
}

function toggleMarkers() {
    immoMarkers.forEach(marker => marker.setMap(displayImmoMarkers ? map : null));
    signalisationMarkers.forEach(marker => marker.setMap(displaySignalisationMarkers ? map : null));
    updateCluster();
}


function updateCluster() {
    if (markerCluster) {
        markerCluster.clearMarkers();
    }
    const visibleMarkers = immoMarkers.filter(marker => marker.getMap() !== null);
    markerCluster = new markerClusterer.MarkerClusterer({
        map: map,
        markers: visibleMarkers
        
    });
}

function createMarkerIcon(price, superficie) {
    const formattedPrice = formatPrice(price);
    const svg = `
    <svg width="100" height="70" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#b3b3b3"/>
            </filter>
        </defs>
        <path d="M 20 29 Q 20 10 40 9 L 60 9 Q 80 10 80 29 L 80 34 L 20 34 Z" style="fill: #333333; filter: url(#shadow);" />
        <text x="50" y="25" font-family="Arial" font-size="15" fill="white" text-anchor="middle" font-weight="bold">${superficie} M</text>
        
        <rect x="01" y="30" width="98" height="30" rx="15" ry="15" style="fill:#ffffff;stroke:none;stroke-width:0; filter: url(#shadow);" />
        <text x="50" y="50" font-family="Arial" font-size="16" fill="black" text-anchor="middle" font-weight="bold">${formattedPrice}</text>
        
        <path d="M 45 60 L 55 60 L 50 70 Z" style="fill:#ffbc1c; filter: url(#shadow);" />
    </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

function displayMarkerCount(totalMarkers) {
    const countDiv = document.getElementById('marker-count');
    if (!countDiv) {
        const div = document.createElement('div');
        div.id = 'marker-count';
        div.style.position = 'absolute';
        div.style.bottom = '15px';
        div.style.right = '10px';
        div.style.fontSize = 'large';
        div.style.width = '240px';
        div.style.padding = '10px 20px';
        div.style.background = 'rgb(0 0 0 / 70%)';
        div.style.backdropFilter = 'blur(5px)'
        div.style.color = 'white';
        div.style.borderRadius = '50px';
        div.style.zIndex = '1000';
        document.body.appendChild(div);
    }

    document.getElementById('marker-count').innerText = `Showing ${markers.length} of ${totalMarkers} places`;
}

