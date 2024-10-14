let isDrawing = false;
let isDrawingModeEnabled = false;
let currentPath = [];
let polyline;
let polygon;

function toggleDrawingMode() {
    if (isDrawingModeEnabled) {
        stopDrawing();
    } else {
        startDrawingMode();
    }
}

function startDrawingMode() {
    isDrawingModeEnabled = true;
    isFetchingData = false;

    $('#toggle-drawing').addClass('active').html('<i class="fa-solid fa-ban"></i> Cancel').css({backgroundColor: '#ffbc1c', color: 'white'});

    // Allow drawing polygon
    google.maps.event.addListenerOnce(map, 'click', function(event) {
        startDrawing(event.latLng);
    });
}

function startDrawing(startLatLng) {
    isDrawing = true;
    currentPath = [startLatLng];

    polyline = new google.maps.Polyline({
        map: map,
        clickable: false,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        path: currentPath
    });

    map.setOptions({ draggable: false, disableDoubleClickZoom: true });

    google.maps.event.addListener(map, 'mousemove', drawPath);
    google.maps.event.addListener(map, 'click', finishDrawing);
}

function drawPath(event) {
    currentPath.push(event.latLng);
    polyline.setPath(currentPath);
}

function finishDrawing() {
    isDrawing = false;
    isFetchingData = true;

    google.maps.event.clearListeners(map, 'mousemove');
    google.maps.event.clearListeners(map, 'click');
    map.setOptions({ draggable: true, disableDoubleClickZoom: false });

    polyline.setMap(null);

    polygon = new google.maps.Polygon({
        paths: currentPath,
        map: map,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        clickable: false,
        editable: false
    });

    fetchLocalDataInPolygon(polygon);

    $('#toggle-drawing').removeClass('active').html('<i class="fa-solid fa-draw-polygon"></i> Draw').css({backgroundColor: '', color: ''});
    isDrawingModeEnabled = false;
}

function stopDrawing() {
    isDrawingModeEnabled = false;
    if (polyline) polyline.setMap(null);
    if (polygon) polygon.setMap(null);

    google.maps.event.clearListeners(map, 'mousemove');
    google.maps.event.clearListeners(map, 'click');
    map.setOptions({ draggable: true, disableDoubleClickZoom: false });

    $('#toggle-drawing').removeClass('active').html('<i class="fa-solid fa-draw-polygon"></i> Draw').css({backgroundColor: '', color: ''});
}

function fetchLocalDataInPolygon(polygon) {
    const path = polygon.getPath();
    const coordinates = [];
    for (let i = 0; i < path.getLength(); i++) {
        coordinates.push({ lat: path.getAt(i).lat(), lng: path.getAt(i).lng() });
    }

    $.ajax({
        url: 'Server/fetch_local_data_polygon.php',  
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ coordinates: coordinates }),
        dataType: 'json',
        success: function(data) {
            console.log('Filtered Data Received:', data);
            handleMarkers(data);
        },
        error: function(error) {
            console.error('Error fetching polygon data', error);
        }
    });
}

function handleMarkers(data) {
    const newMarkers = new Map();
    const zoom = map.getZoom();
    const isZoomedIn = zoom >= 16;
     // Clear the sidebar first
     const sidebar = document.getElementById('sidebar');
     sidebar.innerHTML = '';

    // Remove all existing markers
    visibleMarkers.forEach(marker => marker.setMap(null));
    visibleMarkers.clear();

    data.slice(0, 100).forEach(place => {
        const lat = parseFloat(place.Latitude);
        const lng = parseFloat(place.Longitude);
        const position = { lat: parseFloat(place.Latitude), lng: parseFloat(place.Longitude) };
        const uniqueKey = `${lat},${lng}`;

        if (!visibleMarkers.has(uniqueKey)) {
            const icon = createMarkerIcon(place.Prix, place.Superficie, isZoomedIn);
            const marker = new google.maps.Marker({
                position: position,
                map: map,
                icon: icon
            });

            marker.addListener('click', function() {
                const infoWindowDiv = document.createElement('div');
                        infoWindowDiv.className = 'info-window';
                        const imageUrl = place.Images_url.split(',')[0].trim();
                        infoWindowDiv.innerHTML = `
                        <a href="place_details.php?id=${place.id}" class="place-link" style="text-decoration: none;color: inherit;width: 100%;height: 100%;display: flex;align-items: flex-end;justify-content: flex-start;">
                        <button>NEW</button>
                        <div class="info-details">
                        <p class="window-price"><strong>${place.Prix} DH</strong></p>
                        <p><strong>Superficie :</strong> ${place.Superficie} </p>
                        </div>
                        </a>
                        `;
                        infoWindowDiv.style.backgroundImage = `linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`;
                        infoWindowDiv.style.width = '240px';
                        infoWindowDiv.style.height = '150px';
                        infoWindow.setContent(infoWindowDiv);
                        infoWindow.open(map, marker);
            });

            visibleMarkers.set(uniqueKey, marker);


        }
        newMarkers.set(uniqueKey, visibleMarkers.get(uniqueKey));
        updateSidebarForMultiplePlaces(data);
2
    });

    visibleMarkers = newMarkers;
}
