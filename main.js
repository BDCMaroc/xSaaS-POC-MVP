let map;
let autocomplete;
let markers = [];
let markerCluster;
let drawingManager;
let selectedShape;
let isFetchingData = false;
let infoWindow;
let circle;
let boundsTimeout;
let immoMarkers = []; // To store immovable info markers
let signalisationMarkers = []; // To store signalisation markers
let displayImmoMarkers = true; // Control variable to display/hide immo markers


$(document).ready(function() {
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

    $('#radius').on('input', function() {
        const radius = parseInt($(this).val());
        if (circle) {
            circle.setRadius(radius);
            searchInCircle();
        }
    });
    $('#toggle-immos').on('click', function() {
        toggleImmos();
    });

    $('#display-signalisation').on('click', function() {
        displaySignalisationPlaces();
    });
});
function toggleImmos() {
    displayImmoMarkers = true; // Ensure immo markers should be displayed
    immoMarkers.forEach(marker => {
        marker.setMap(map);
    });

    // Hide signalisation markers
    signalisationMarkers.forEach(marker => marker.setMap(null));
    if (markerCluster) {
        markerCluster.clearMarkers();
        markerCluster = new markerClusterer.MarkerClusterer({ map, markers: immoMarkers });
    }
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

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions: {
            editable: true,
            draggable: true
        }
    });

    drawingManager.setMap(map);
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
        if (selectedShape) {
            selectedShape.setMap(null);
        }
        selectedShape = event.overlay;
        drawingManager.setDrawingMode(null);

        if (selectedShape.type === google.maps.drawing.OverlayType.POLYGON) {
            google.maps.event.addListener(selectedShape.getPath(), 'set_at', fetchLocalDataInPolygon);
            google.maps.event.addListener(selectedShape.getPath(), 'insert_at', fetchLocalDataInPolygon);
        }

        fetchLocalDataInPolygon();
    });

    google.maps.event.addListener(map, 'bounds_changed', function() {
        clearTimeout(boundsTimeout);
        boundsTimeout = setTimeout(function() {
            if (circle) {
                searchInCircle();  // Trigger search in the circle's bounds
            }
            else if (selectedShape && selectedShape.type === google.maps.drawing.OverlayType.POLYGON) {
            fetchLocalDataInPolygon();  // Trigger search in the polygon's bounds
            } else {
                fetchLocalData(map.getBounds());  // Fetch data for the new bounds if no circle
            }
        }, 500);
    });

    createCustomButton('Draw Zone', toggleDrawing, map);
    createCustomButton('Cancel Polygon', cancelPolygon, map);
    createCustomButton('Draw Circle', drawCircle, map);
    createCustomButton('Remove Circle', removeCircle, map);
    createCustomButton('Zoom In', zoomIn, map);
    createCustomButton('Zoom Out', zoomOut, map);
    createCustomButton('Satellite', toggleSatellite, map);

    google.maps.event.addListener(map, 'dblclick', function(event) {
        handleMapDoubleClick(event.latLng);
    });
}

function createCustomButton(text, callback, map) {
    const controlDiv = document.createElement('div');
    controlDiv.style.margin = '10px';

    const controlUI = document.createElement('button');
    controlUI.className = 'custom-button';
    controlUI.innerHTML = text;
    controlUI.addEventListener('click', callback);

    controlDiv.appendChild(controlUI);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);
}

function zoomIn() {
    map.setZoom(map.getZoom() + 1);
}

function zoomOut() {
    map.setZoom(map.getZoom() - 1);
}

function toggleSatellite() {
    const currentMapTypeId = map.getMapTypeId();
    map.setMapTypeId(currentMapTypeId === 'satellite' ? 'roadmap' : 'satellite');
}

function toggleDrawing() {
    if (drawingManager.getDrawingMode()) {
        drawingManager.setDrawingMode(null);
    } else {
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    }
}

function cancelPolygon() {
    if (selectedShape) {
        selectedShape.setMap(null);
        selectedShape = null;
    }
}

function drawCircle() {
    if (circle) {
        circle.setMap(null);
        circle = null;
    }

    circle = new google.maps.Circle({
        map: map,
        center: map.getCenter(),
        radius: 100,
        editable: true,
        draggable: true
    });
    

    google.maps.event.addListener(circle, 'radius_changed', searchInCircle);
    google.maps.event.addListener(circle, 'center_changed', searchInCircle);
    searchInCircle();
}

function removeCircle() {
    if (circle) {
        circle.setMap(null);
        circle = null;
    }
    fetchLocalData(map.getBounds());
}

function searchInCircle() {
    fetchLocalData(circle.getBounds());
}
function displaySignalisationPlaces() {
    // Hide immo markers
    displayImmoMarkers = false;
    immoMarkers.forEach(marker => marker.setMap(null));
    if (markerCluster) {
        markerCluster.clearMarkers();
    }

    // Fetch and display signalisation data
    fetchSignalisationData();
}

function fetchSignalisationData() {
    $.ajax({
        url: 'fetch_signalisation_data.php', // Endpoint to fetch signalisation data
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            // Clear existing signalisation markers
            signalisationMarkers.forEach(marker => marker.setMap(null));
            signalisationMarkers = [];

            // Create new signalisation markers
            data.forEach(place => {
                if (place.type === 'future') {
                    const position = {lat: parseFloat(place.lat), lng: parseFloat(place.lon)};
                    const marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        icon: {
                            url: 'new.png', // Path to your custom icon
                            scaledSize: new google.maps.Size(80, 80) // Adjust the size here
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
                            <p>${place.quoi.slice(0, 40)}</p>
                        </div>
                    `;
                    infoWindowDiv.style.backgroundImage = `linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`;
                    infoWindowDiv.style.width = '200px'; // Ensure the width is set
                    infoWindowDiv.style.height = '150px'; // Ensure the height is set

                    infoWindow.setContent(infoWindowDiv);
                    infoWindow.open(map, marker);
                    updateSidebarforfutureplaces(place);
                    });

                    signalisationMarkers.push(marker);
                }
                
            });
            if (markerCluster) {
                markerCluster.clearMarkers();
            }
            markerCluster = new markerClusterer.MarkerClusterer({ map, markers: signalisationMarkers });
        },
        error: function(error) {
            console.error('Error fetching signalisation data', error);
        }
    });
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

    $.ajax({
        url: 'fetch_local_data.php',
        method: 'GET',
        data: params,
        dataType: 'json',
        success: function(data) {
            // Clear existing markers
            markers.forEach(marker => marker.setMap(null));
            markers = [];

            // Create new markers
            data.forEach(place => {
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
                            <p><strong>Price :</strong> ${place.Prix}</p>
                            <p><strong>Superficie :</strong> ${place.Superficie} </p>
                        </div>
                    `;
                    infoWindowDiv.style.backgroundImage = `linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`;
                    infoWindowDiv.style.width = '200px'; // Ensure the width is set
                    infoWindowDiv.style.height = '150px'; // Ensure the height is set

                    infoWindow.setContent(infoWindowDiv);
                    infoWindow.open(map, marker);
                    // Update place details section
                    updateSidebar(place);
                });
                immoMarkers.push(marker);
                markers.push(marker);
            });
            // Initialize marker clustering
            if (markerCluster) {
                markerCluster.clearMarkers();
            }
            markerCluster = new markerClusterer.MarkerClusterer({ map, markers });


        },
        error: function(error) {
            console.error('Error fetching local data', error);
        },
        complete: function() {
            isFetchingData = false;
        }
    });
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



function fetchLocalDataInPolygon() {
    const bounds = new google.maps.LatLngBounds();
    selectedShape.getPath().forEach(function(latLng) {
        bounds.extend(latLng);
    });
    fetchLocalData(bounds);
}

function handleMapDoubleClick(latLng) {
    const request = {
        location: latLng,
        radius: '50',
        type: ['restaurant', 'bar', 'store', 'point_of_interest']
    };

    placesService.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            markers.forEach(marker => marker.setMap(null));
            markers = [];
            results.forEach(place => {
                const marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name
                });
                marker.addListener('click', function() {
                    showCustomInfoWindow(marker, place);
                });
                markers.push(marker);
            });
        }
    });
}
