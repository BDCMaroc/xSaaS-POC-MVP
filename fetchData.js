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
            markers.forEach(marker => marker.setMap(null));
            markers = [];

            const newMarkers = data.map(place => {
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
        },
        error: function(error) {
            console.error('Error fetching local data', error);
        },
        complete: function() {
            isFetchingData = false;
        }
    });
}

function fetchLocalDataInCircle(circle) {
    const center = circle.getCenter();
    const radius = circle.getRadius();

    const params = {
        lat: center.lat(),
        lng: center.lng(),
        radius: radius
    };

    $.ajax({
        url: 'fetch_local_data_circle.php',
        method: 'GET',
        data: params,
        dataType: 'json',
        success: function(data) {
            markers.forEach(marker => marker.setMap(null));
            markers = [];
            const newMarkers = data.map(place => {
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

                markers.push(marker);
                return marker;
            });

            markers = newMarkers;
            toggleMarkers();
            updateCluster();
        },
        error: function(error) {
            console.error('Error fetching circle data', error);
        },
        complete: function() {
            isFetchingData = false;
        }
    });
}

function fetchLocalDataInPolygon(polygon) {
    const path = polygon.getPath();
    const coordinates = [];
    for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i);
        coordinates.push({ lat: point.lat(), lng: point.lng() });
    }

    $.ajax({
        url: 'fetch_local_data_polygon.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ coordinates: coordinates }),
        dataType: 'json',
        success: function(data) {
            markers.forEach(marker => marker.setMap(null));
            markers = [];
            const newMarkers = data.map(place => {
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

                markers.push(marker);
                return marker;
            });

            markers = newMarkers;
            toggleMarkers();
            updateCluster();
        },
        error: function(error) {
            console.error('Error fetching polygon data', error);
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

            const newMarkers = data.map(place => {
                if (place.type === 'future') {
                    const position = { lat: parseFloat(place.lat), lng: parseFloat(place.lon) };
                    const marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        icon: {
                            url: 'new.png',
                            scaledSize: new google.maps.Size(80, 80)
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
