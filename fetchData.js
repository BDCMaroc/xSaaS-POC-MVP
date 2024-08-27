let isFetchingData = false;

function fetchLocalData(bounds) {
    if (isFetchingData || !displayImmoMarkers) return;
    isFetchingData = true;

    const params = {
        lat_min: bounds.getSouthWest().lat(),
        lat_max: bounds.getNorthEast().lat(),
        lng_min: bounds.getSouthWest().lng(),
        lng_max: bounds.getNorthEast().lng()
    };

    $.ajax({
        url: 'Server/fetch_local_data.php',
        method: 'GET',
        data: params,
        dataType: 'json',
        success: function (data) {
            console.log("Data received:", data.length, "items");

            const newMarkers = new Map();
            const zoom = map.getZoom();
            const isZoomedIn = zoom >= 16;

            data.slice(0, 1000).forEach(place => {
                const lat = parseFloat(place.Latitude);
                const lng = parseFloat(place.Longitude);
                const uniqueKey = `${lat},${lng}`;  // Use lat and lng as a unique key
                const position = new google.maps.LatLng(lat, lng);

                if (bounds.contains(position)) {
                    if (!visibleMarkers.has(uniqueKey)) {
                        const icon = createMarkerIcon(place.Prix, place.Superficie, isZoomedIn);
                        const marker = new google.maps.Marker({
                            position: position,
                            map: map,
                            icon: icon
                        });

                        marker.addListener('click', function () {
                            const infoWindowDiv = document.createElement('div');
                            infoWindowDiv.className = 'info-window';
                            const imageUrl = place.Images_url.split(',')[0].trim();
                            infoWindowDiv.innerHTML = `
                                <button>NEW</button>
                                <div class="info-details">
                                    <p class="window-price"><strong>${place.Prix} DH</strong></p>
                                    <p><strong>Superficie :</strong> ${place.Superficie} </p>
                                </div>
                            `;
                            infoWindowDiv.style.backgroundImage = `linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(0, 0, 0, 0.5)), url(${imageUrl})`;
                            infoWindowDiv.style.width = '240px';
                            infoWindowDiv.style.height = '150px';
                            infoWindow.setContent(infoWindowDiv);
                            infoWindow.open(map, marker);
                            updateSidebar(place);
                        });

                        visibleMarkers.set(uniqueKey, marker);
                        console.log("Marker added:", uniqueKey, position);
                    } else {
                        console.log("Marker already exists:", uniqueKey);
                    }
                    newMarkers.set(uniqueKey, visibleMarkers.get(uniqueKey));
                }
            });

            // Remove markers that are no longer in the visible area
            visibleMarkers.forEach((marker, uniqueKey) => {
                if (!newMarkers.has(uniqueKey)) {
                    marker.setMap(null);
                    visibleMarkers.delete(uniqueKey);
                    console.log("Marker removed:", uniqueKey);
                }
            });

            // Update the visible markers with the newly calculated set
            visibleMarkers = newMarkers;

            toggleMarkers(); // Optional: If you want to control marker visibility separately
            displayMarkerCount(data.length); // Update the marker count display
        },
        error: function (error) {
            console.error('Error fetching local data', error);
        },
        complete: function () {
            isFetchingData = false;
        }
    });
}
function toggleImmoMarkers() {
    displayImmoMarkers = !displayImmoMarkers;
    $('#toggle-immos').toggleClass('active');
    toggleMarkers();
}


