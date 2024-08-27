let isDrawing = false;
let isDrawingModeEnabled = false; // Track if the drawing mode is enabled
let currentPath = [];
let polyline;
let polygon;

function toggleDrawingMode() {
    if ($('#toggle-drawing').hasClass('active')) {
        clearSelectedShape();
        drawingManager.setDrawingMode(null);
        $('#toggle-drawing').removeClass('active').html('<i class="fa-solid fa-draw-polygon"></i> Draw').css({backgroundColor: '', color: ''});
    } else {
        clearSelectedShape();
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        $('#toggle-drawing').addClass('active').html('<i class="fa-solid fa-ban"></i> Cancel').css({backgroundColor: '#ffbc1c', color: 'white'});
    }
}

function clearSelectedShape() {
    if (drawnShape) {
        drawnShape.setMap(null);
        drawnShape = null;
    }
}



function toggleDrawingMode() {
    if (isDrawingModeEnabled) {
        stopDrawing();
    } else {
        startDrawingMode();
    }
}

function startDrawingMode() {
    isDrawingModeEnabled = true;

    // Update button to indicate drawing mode is active
    $('#toggle-drawing').addClass('active').html('<i class="fa-solid fa-ban"></i> Cancel').css({backgroundColor: '#ffbc1c', color: 'white'});

    // Set up click listener to start drawing
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

    map.setOptions({
        draggable: false, 
        disableDoubleClickZoom: true
    });

    google.maps.event.addListener(map, 'mousemove', drawPath);
    google.maps.event.addListener(map, 'click', finishDrawing);
}

function drawPath(event) {
    const latLng = event.latLng;
    currentPath.push(latLng);
    polyline.setPath(currentPath);
}

function finishDrawing() {
    isDrawing = false;

    google.maps.event.clearListeners(map, 'mousemove');
    google.maps.event.clearListeners(map, 'click');
    map.setOptions({
        draggable: true, 
        disableDoubleClickZoom: false
    });

    polyline.setMap(null);

    // Create a closed polygon from the path
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

    // Fetch data within the polygon area
    fetchLocalDataInPolygon(polygon);

    // Reset the button
    $('#toggle-drawing').removeClass('active').html('<i class="fa-solid fa-pen"></i> Draw Area').css({backgroundColor: '', color: ''});
    isDrawingModeEnabled = false;
}

function stopDrawing() {
    isDrawingModeEnabled = false;
    if (polyline) {
        polyline.setMap(null);
    }
    if (polygon) {
        polygon.setMap(null);
    }
    google.maps.event.clearListeners(map, 'mousemove');
    google.maps.event.clearListeners(map, 'click');

    map.setOptions({
        draggable: true, 
        disableDoubleClickZoom: false
    });

    // Reset the button
    $('#toggle-drawing').removeClass('active').html('<i class="fa-solid fa-pen"></i> Draw Area').css({backgroundColor: '', color: ''});
}

function fetchLocalDataInPolygon(polygon) {
    const path = polygon.getPath();
    const coordinates = [];
    for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i);
        coordinates.push({ lat: point.lat(), lng: point.lng() });
    }

    $.ajax({
        url: 'fetch_local_data_polygon.php',  // Update this with your server endpoint
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ coordinates: coordinates }),
        dataType: 'json',
        success: function(data) {
            // Clear existing markers
            markers.forEach(marker => marker.setMap(null));
            markers = [];

            // Create new markers from the fetched data
            data.forEach(place => {
                const position = { lat: parseFloat(place.Latitude), lng: parseFloat(place.Longitude) };
                const marker = new google.maps.Marker({
                    position: new google.maps.LatLng(position.lat, position.lng),
                    map: map,
                    icon: createMarkerIcon(place.Prix, place.Superficie)
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
                });

                markers.push(marker);
            });

            toggleMarkers();
            updateCluster();
        },
        error: function(error) {
            console.error('Error fetching polygon data', error);
        }
    });
}
