let nearbyMarkers = [];
let displayNearby = false;

function fetchNearbyPlaces(type) {
    const service = new google.maps.places.PlacesService(map);
    const bounds = map.getBounds();
    const request = {
        bounds: bounds,
        type: [type],
    };

    const typeIcons = {
        'supermarket': 'iconformap/supermarket.png',
        'hospital': 'iconformap/hospital.png',
        'park': 'iconformap/park.png',
        'restaurant': 'iconformap/restaurant.png',
        'mosque': 'iconformap/mosque.png'
    };

    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
                const marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name,
                    icon: {
                        url: typeIcons[type],
                        scaledSize: new google.maps.Size(80, 80)
                    },
                });

                marker.addListener('click', function() {
                    infoWindow.setContent(place.name);
                    infoWindow.open(map, marker);
                });

                nearbyMarkers.push({marker, type});
            });
        }
    });
}

function clearNearbyMarkers(type) {
    nearbyMarkers = nearbyMarkers.filter(obj => {
        if (obj.type === type) {
            obj.marker.setMap(null);
            return false;
        }
        return true;
    });
}

function clearAllNearbyMarkers() {
    nearbyMarkers.forEach(obj => obj.marker.setMap(null));
    nearbyMarkers = [];
}

$(document).ready(function() {
    $('#nearby-toggle').on('click', function() {
        const dropdown = $('#nearby-dropdown');
        dropdown.slideToggle(300);
    });

    $('#nearby-close').on('click', function() {
        $('#nearby-dropdown').slideUp(300);
    });

    $('#nearby-dropdown input[type="checkbox"]').on('change', function() {
        const placeType = $(this).attr('id');
        if ($(this).is(':checked')) {
            fetchNearbyPlaces(placeType);
        } else {
            clearNearbyMarkers(placeType);
        }
    });
});
