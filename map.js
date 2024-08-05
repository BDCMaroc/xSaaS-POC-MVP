let map;
let autocomplete;
let infoWindow;
let drawingManager;
let selectedShape;
let circle;

function initMap(defaultLocation) {
  map = new google.maps.Map(document.getElementById('map'), {
      center: defaultLocation,
      zoom: 13,
      mapTypeControl: false,
      zoomControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
          { featureType: "poi", stylers: [{ visibility: "off" }] }, // Hide points of interest
          { featureType: "poi.park", stylers: [{ visibility: "off" }] }, // Hide parks
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
          { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
          { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
          { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
          { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
          { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] }, // Hide transit
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
          { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
          { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
      ]
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
        fetchLocalData(map.getBounds());
        
    }, 500));

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false,
        circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 0.5,
            strokeWeight: 1,
            clickable: false,
            editable: true,
            zIndex: 1
        },
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
