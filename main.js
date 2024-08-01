let map;
let autocomplete;
let markers = [];
let markerCluster;
let isFetchingData = false;
let infoWindow;
let immoMarkers = [];
let signalisationMarkers = [];
let displayImmoMarkers = true;
let displaySignalisationMarkers = false;

$(document).ready(function() {
    $('#toggle-immos').addClass('active');

    $('#toggle-immos').on('click', function() {
        displayImmoMarkers = !displayImmoMarkers;
        $(this).toggleClass('active');
        toggleMarkers();
    });

    $('#display-signalisation').on('click', function() {
        displaySignalisationMarkers = !displaySignalisationMarkers;
        $(this).toggleClass('active');
        if (displaySignalisationMarkers) {
            fetchSignalisationData();
        } else {
            toggleMarkers();
        }
    });

    $.ajax({
        url: 'default_location.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            let defaultLocation = {lat: parseFloat(data.lat), lng: parseFloat(data.lng)};
            initMap(defaultLocation);
        },
        error: function(error) {
            console.error('Error fetching default location', error);
        }
    });

    $('#search').on('input', function() {
        const searchQuery = $(this).val();
        if (searchQuery) {
            searchPlaces(searchQuery);
        }
    });
});

function toggleMarkers() {
    console.log('Toggling markers. Immo: ', displayImmoMarkers, ' Signalisation: ', displaySignalisationMarkers);
    immoMarkers.forEach(marker => {
        marker.setMap(displayImmoMarkers ? map : null);
    });

    signalisationMarkers.forEach(marker => {
        marker.setMap(displaySignalisationMarkers ? map : null);
    });

    updateCluster();
}

function updateCluster() {
    console.log('Updating cluster with visible markers');
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

function initMap(defaultLocation) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 13,
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });

    autocomplete = new google.maps.places.Autocomplete(document.getElementById('search'));
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        fetchLocalData(map.getBounds());
    });

    infoWindow = new google.maps.InfoWindow();

    google.maps.event.addListener(map, 'bounds_changed', debounce(function() {
        console.log('Map bounds changed');
        fetchLocalData(map.getBounds());
    }, 500));
}

function fetchLocalData(bounds) {
    if (isFetchingData || !displayImmoMarkers) return;
    isFetchingData = true;

    const params = bounds ? {
        lat_min: bounds.getSouthWest().lat(),
        lat_max: bounds.getNorthEast().lat(),
        lng_min: bounds.getSouthWest().lng(),
        lng_max: bounds.getNorthEast().lng()
    } : {};

    console.log('Fetching local data with params:', params);

    $.ajax({
        url: 'fetch_local_data.php',
        method: 'GET',
        data: params,
        dataType: 'json',
        success: function(data) {
            console.log('Fetched local data:', data);

            markers.forEach(marker => marker.setMap(null));
            markers = [];

            const newMarkers = data.map(place => {
                const position = {lat: parseFloat(place.Latitude), lng: parseFloat(place.Longitude)};
                const icon = createMarkerIcon(place.Prix, place.Superficie);
                const marker = new google.maps.Marker({
                    position: new google.maps.LatLng(position.lat, position.lng),
                    map: map,
                    icon: icon
                });

                marker.addListener('click', function() {
                    const infoWindowDiv = document.createElement('div');
                    infoWindowDiv.className = 'info-window';
                    const imageUrl = place.Images_url.split(',')[0].trim();
                    infoWindowDiv.innerHTML = `
                        <button>NEW</button>
                        <div class="info-details">
                            <p><strong>Price :</strong> ${place.Prix} DH</p>
                            <p><strong>Superficie :</strong> ${place.Superficie} </p>
                        </div>
                    `;
                    infoWindowDiv.style.backgroundImage = `linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`;
                    infoWindowDiv.style.width = '200px';
                    infoWindowDiv.style.height = '150px';
                    infoWindow.setContent(infoWindowDiv);
                    infoWindow.open(map, marker);

                    updateSidebar(place);
                });

                immoMarkers.push(marker);
                return marker;
            });

            markers = newMarkers;
            toggleMarkers();
            updateCluster();
        },
        error: function(error) {
            console.error('Error fetching local data', error);
        },
        complete: function() {
            isFetchingData = false;
        }
    });
}

function fetchSignalisationData() {
    $.ajax({
        url: 'fetch_signalisation_data.php',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Fetched signalisation data:', data);

            signalisationMarkers.forEach(marker => marker.setMap(null));
            signalisationMarkers = [];

            const newMarkers = data.map(place => {
                if (place.type === 'future') {
                    const position = {lat: parseFloat(place.lat), lng: parseFloat(place.lon)};
                    const marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        icon: {
                            url: 'new.png',
                            scaledSize: new google.maps.Size(80, 80)
                        },
                        title: place.quoi
                    });

                    marker.addListener('click', function() {
                        const infoWindowDiv = document.createElement('div');
                        infoWindowDiv.className = 'info-window';
                        const imageUrl = `https://www.soliquar.com/Upload/uploads/${place.pj}`;
                        infoWindowDiv.innerHTML = `
                        <button>NEW</button>
                        <div class="info-details">
                            <p>${place.quoi.slice(0, 40)} ...</p>
                        </div>
                    `;
                        infoWindowDiv.style.backgroundImage = `linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`;
                        infoWindowDiv.style.width = '200px';
                        infoWindowDiv.style.height = '150px';
                        infoWindow.setContent(infoWindowDiv);
                        infoWindow.open(map, marker);
                        updateSidebarforfutureplaces(place);
                    });

                    signalisationMarkers.push(marker);
                    return marker;
                }
            }).filter(marker => marker !== undefined);

            signalisationMarkers = newMarkers;
            toggleMarkers();
        },
        error: function(error) {
            console.error('Error fetching signalisation data', error);
        }
    });
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function createMarkerIcon(price, superficie) {
    const formattedPrice = formatPrice(price);
    const svg = `
    <svg width="100" height="70" xmlns="http://www.w3.org/2000/svg">
        <path d="M 20 29 Q 20 10 40 9 L 60 9 Q 80 10 80 29 L 80 34 L 20 34 Z" style="fill:#de0606;" />
        <text x="50" y="25" font-family="Arial" font-size="15" fill="white" text-anchor="middle" font-weight="bold">${superficie} M</text>
        
        <rect x="01" y="30" width="98" height="30" rx="15" ry="15" style="fill:#ffffff;stroke:#4CAF50;stroke-width:3;" />
        <text x="50" y="50" font-family="Arial" font-size="16" fill="black" text-anchor="middle" font-weight="bold">${formattedPrice}</text>
        
        <path d="M 45 60 L 55 60 L 50 70 Z" style="fill:#4CAF50;" />
    </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}
