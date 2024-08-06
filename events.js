let schoolMarkers = [];
let displaySchools = false;
let nearbyMarkers = [];
let displayNearby = false;

$(document).ready(function() {
    // Initial setup
    $('#toggle-immos').addClass('active');
    $('#toggle-immos').on('click', toggleImmoMarkers);
    $('#display-signalisation').on('click', toggleSignalisationMarkers);
    $('#toggle-drawing').on('click', toggleDrawingMode);
    $('.sattelite').on('click', toggleSatellite);
    $('#toggle-filters-btn').on('click', function() {
        const filters = $('#filters');
        const toggleButton = $('#toggle-filters-btn');
        filters.slideToggle(300, function() {
            if (filters.is(':visible')) {
                toggleButton.html('<i class="fa-solid fa-circle-chevron-up"></i>');
            } else {
                toggleButton.html('<i class="fa-solid fa-circle-chevron-down"></i>');
            }
        });
    });


    $('#school-toggle').on('click', function() {
        displaySchools = !displaySchools;
        if (displaySchools) {
            fetchSchools();
            $('#school-toggle').addClass('active').css({backgroundColor: '#ffbc1c', color: 'white'});
        } else {
            clearSchoolMarkers();
            $('#school-toggle').removeClass('active').css({backgroundColor: '', color: ''});
        }
    });


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



    // Fetch default location
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

    // Search places
    $('#search').on('input', function() {
        const searchQuery = $(this).val();
        if (searchQuery) {
            searchPlaces(searchQuery);
        }
    });
});

function fetchSchools() {
    const service = new google.maps.places.PlacesService(map);
    const bounds = map.getBounds();
    const request = {
        bounds: bounds,
        type: ['school'],
    };

    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
                const marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name,
                    icon: {
                        url: 'icons/school_logo.png',
                        scaledSize: new google.maps.Size(60, 60)
                    },
                });
                marker.addListener('click', function() {
                    const infoWindowDiv = document.createElement('div');
                    infoWindowDiv.className = 'info-window';
                    infoWindowDiv.innerHTML = `
                        <div class="info-details">
                            <p style="color : grey;"><i class="fa-solid fa-school"></i> ${place.name}</p>
                        </div>
                    `;
                    infoWindowDiv.style.width = '200px';
                    infoWindowDiv.style.height = '40px';
                    infoWindow.setContent(infoWindowDiv);
                    infoWindow.open(map, marker);
                });


                schoolMarkers.push(marker);
            });
        }
    });
}

function fetchNearbyPlaces(type) {
    const service = new google.maps.places.PlacesService(map);
    const bounds = map.getBounds();
    const request = {
        bounds: bounds,
        type: [type],
    };

    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
                const marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    title: place.name,
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

function clearSchoolMarkers() {
    schoolMarkers.forEach(marker => marker.setMap(null));
    schoolMarkers = [];
}

function toggleImmoMarkers() {
    displayImmoMarkers = !displayImmoMarkers;
    $('#toggle-immos').toggleClass('active');
    toggleMarkers();
}

function toggleSignalisationMarkers() {
    displaySignalisationMarkers = !displaySignalisationMarkers;
    $('#display-signalisation').toggleClass('active');
    if (displaySignalisationMarkers) {
        fetchSignalisationData();
    } else {
        toggleMarkers();
    }
}

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