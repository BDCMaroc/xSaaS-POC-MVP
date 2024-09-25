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
    const visibleMarkers = immoMarkers.filter(marker => marker.getMap() !== null);
    markerCluster = new markerClusterer.MarkerClusterer({
        map: map,
        markers: visibleMarkers
        
    });
}

function createMarkerIcon(price, superficie, isZoomedIn) {
    if (isZoomedIn) {
        const formattedPrice = formatPrice(price);
        const svg = `
        <svg width="100" height="70" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#b3b3b3"/>
                </filter>
            </defs>
            <path d="M 20 29 Q 20 10 40 9 L 60 9 Q 80 10 80 29 L 80 34 L 20 34 Z" style="fill: #333333; filter: url(#shadow);" />
            <text x="50" y="25" font-family="sans-serif" font-size="15" fill="white" text-anchor="middle" font-weight="bold">${superficie} M</text>
            
            <rect x="01" y="30" width="98" height="30" rx="15" ry="15" style="fill:#ffffff;stroke:none;stroke-width:0; filter: url(#shadow);" />
            <text x="50" y="50" font-family="sans-serif" font-size="16" fill="black" text-anchor="middle" font-weight="bold">${formattedPrice}</text>
            
            <path d="M 45 60 L 55 60 L 50 70 Z" style="fill:#ffbc1c; filter: url(#shadow);" />
        </svg>`;
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    } else {
        // Small red circle with white border and box shadow
        const smallCircleSvg = `
        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="small-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#b3b3b3"/>
                </filter>
            </defs>
            <circle cx="10" cy="10" r="8" stroke="white" stroke-width="2" fill="#ffbc1c" style="filter: url(#small-shadow);" />
        </svg>`;
        return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(smallCircleSvg);
    }
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
    let more;
    let numberofplaces;
    if(totalMarkers >= 200){
        numberofplaces = 200;
        more = "more than"
    }
    if(totalMarkers < 200){
        numberofplaces = totalMarkers;
        more = null;
    }


    document.getElementById('marker-count').innerText = `Showing ${numberofplaces} of ${totalMarkers} places`;
}

