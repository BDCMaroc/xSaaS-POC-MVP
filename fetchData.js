let isFetchingData = false;

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
            immoMarkers.forEach(marker => {
                if (!bounds.contains(marker.getPosition())) {
                    marker.setMap(null);
                }
            });

            const newMarkers = data.slice(0, 200).map(place => {
                const position = { lat: parseFloat(place.Latitude), lng: parseFloat(place.Longitude) };
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
                        displayMarkerCount(data.length);
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
            signalisationMarkers.forEach(marker => marker.setMap(null));
            signalisationMarkers = [];
            const typeIcons = {
                'future': 'new.png',
                'trash': 'icons/trash logo.png',
                'badSmell': 'icons/bad smell.png',
                'water': 'icons/water project.png',
                'garden': 'icons/garden.png'
            };

            const newMarkers = data.map(place => {
                const iconUrl = typeIcons[place.type];
                if (iconUrl) {
                    const position = { lat: parseFloat(place.lat), lng: parseFloat(place.lon) };
                    const marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        icon: {
                            url: iconUrl,
                            scaledSize: new google.maps.Size(100, 100)
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
