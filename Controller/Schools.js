let schoolMarkers = [];
let displaySchools = false;

function fetchSchools(schoolType) {
    const service = new google.maps.places.PlacesService(map);
    const bounds = map.getBounds();
    const request = {
        bounds: bounds,
        type: [schoolType],
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

                marker.schoolType = schoolType; // Store the school type with the marker

                marker.addListener('click', function() {
                    const infoWindowDiv = document.createElement('div');
                    infoWindowDiv.className = 'info-window';
                    infoWindowDiv.innerHTML = `
                        <div class="info-details">
                            <p style="color : grey;"><i class="fa-solid fa-school"></i> ${place.name}</p>
                        </div>
                    `;
                    infoWindowDiv.style.width = '240px';
                    infoWindowDiv.style.height = '40px';
                    infoWindowDiv.style.display = 'flex';
                    infoWindowDiv.style.justifyContent = 'center';
                    infoWindow.setContent(infoWindowDiv);
                    infoWindow.open(map, marker);
                });

                schoolMarkers.push(marker); // Add marker to array
            });
        }
    });
}


function clearSchoolMarkers(schoolType) {
    schoolMarkers = schoolMarkers.filter(marker => {
        if (marker.schoolType === schoolType) {
            marker.setMap(null); // Remove marker from the map
            return false; // Remove marker from the array
        }
        return true; // Keep marker in the array
    });
}


function clearAllSchoolMarkers() {
    schoolMarkers.forEach(marker => marker.setMap(null));
    schoolMarkers = [];
}

$(document).ready(function() {
    $('#school-toggle').on('click', function() {
        const dropdown = $('#school-dropdown');
        dropdown.slideToggle(300);
    });

    $('#school-close').on('click', function() {
        $('#school-dropdown').slideUp(300);
    });

    $('#school-dropdown input[type="checkbox"]').on('change', function() {
        const schoolType = $(this).attr('id');
        if ($(this).is(':checked')) {
            fetchSchools(schoolType);
        } else {
            clearSchoolMarkers(schoolType);
        }
    });
});
