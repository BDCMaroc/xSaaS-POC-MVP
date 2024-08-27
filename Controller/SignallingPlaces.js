function toggleSignalisationMarkers() {
    displaySignalisationMarkers = !displaySignalisationMarkers;
    $('#display-signalisation').toggleClass('active');
    if (displaySignalisationMarkers) {
        fetchSignalisationData();
    } else {
        toggleMarkers();
    }
}


function fetchSignalisationData() {
    $.ajax({
        url: 'Server/fetch_signalisation_data.php',
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
                            scaledSize: new google.maps.Size(65, 65)
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
