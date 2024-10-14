let map;
let autocomplete;
let infoWindow;
let drawingManager;
let drawnShape = null;
let visibleMarkers = new Map(); // Store currently visible markers
let isFilterActive = false; // Track whether the filter is active
let previousZoom = 13; // Store the previous zoom level to detect changes
// Debounce timer variable
let debounceTimer;

function initMap(defaultLocation) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 13,
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
            { elementType: "labels.text.stroke", stylers: [{ color: "#3D3D3D" }] },
            { elementType: "labels.text.fill", stylers: [{ visibility: "off", color: "#6F6F6F" }] },
            { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#A1A1A1" }] },
            { featureType: "poi", stylers: [{ visibility: "off" }] }, // Hide points of interest
            { featureType: "poi.park", stylers: [{ visibility: "off" }] }, // Hide parks
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ visibility: "off", color: "#CFCFCF" }] },
            { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#C2C2C2" }] },
            { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ visibility: "off", color: "#3E3E3E" }] },
            { featureType: "transit", stylers: [{ visibility: "off" }] } // Hide transit
        ]
    });

    autocomplete = new google.maps.places.Autocomplete(document.getElementById('search'));
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', function () {
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
        updateMarkers();
    });

    infoWindow = new google.maps.InfoWindow();

    // Event listener for bounds change with debouncing
    google.maps.event.addListener(map, 'bounds_changed', function () {
        clearTimeout(debounceTimer); // Clear the previous debounce timer if still running

        // Set a new timer to execute after the user stops interacting with the map
        debounceTimer = setTimeout(function () {
            if (isFilterActive) {
                const bounds = map.getBounds();
                const latMin = bounds.getSouthWest().lat();
                const latMax = bounds.getNorthEast().lat();
                const lngMin = bounds.getSouthWest().lng();
                const lngMax = bounds.getNorthEast().lng();

                const params = {
                    lat_min: latMin,
                    lat_max: latMax,
                    lng_min: lngMin,
                    lng_max: lngMax,
                    min_price: parseInt(document.getElementById('min-price').value),
                    max_price: parseInt(document.getElementById('max-price').value),
                    min_superficie: parseInt(document.getElementById('min-superficie').value),
                    max_superficie: parseInt(document.getElementById('max-superficie').value),
                    type_de_bien: document.getElementById('select-type').value
                };

                fetchLocalDataWithFilter(params);
            } else {
                fetchLocalData(map.getBounds());
            }
        }, 500); // Adjust the debounce time (500 ms in this case) to your needs
    });

// Listener for zoom change to refresh markers
google.maps.event.addListener(map, 'zoom_changed', function () {
    const zoom = map.getZoom();
    if ((previousZoom < 16 && zoom >= 16) || (previousZoom >= 16 && zoom < 16)) {
        visibleMarkers.forEach(marker => marker.setMap(null));
    visibleMarkers.clear();

    // Fetch new data and add markers again
    fetchLocalData(map.getBounds());
    fetchLocalDataInPolygon(polygon);
    }
    previousZoom = zoom; // Update the previous zoom level
});

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        polygonOptions: {
            fillColor: '#ffff00',
            fillOpacity: 0.5,
            strokeWeight: 1,
            clickable: false,
            editable: true,
            zIndex: 1
        }
    });
    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
        if (drawnShape) {
            drawnShape.setMap(null);
        }
        drawnShape = event.overlay;
        drawingManager.setDrawingMode(null);
        fetchLocalDataInPolygon(drawnShape);
    });
}

function toggleSatellite() {
    const currentMapTypeId = map.getMapTypeId();
    if (currentMapTypeId === 'satellite') {
        map.setMapTypeId('roadmap');
        $('.sattelite').html('<i class="fa-solid fa-earth-americas"></i> Satellite');
    } else {
        map.setMapTypeId('satellite');
        $('.sattelite').html('<i class="fa-solid fa-map"></i> Default');
    }
}
