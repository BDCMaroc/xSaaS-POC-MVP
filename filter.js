let useFilter = false; // Flag to determine whether to use filtered data or not

$('#min-price, #max-price').on('change', updatePriceButton);
$('#min-superficie, #max-superficie').on('change', updateSuperficieButton);
$('#select-type').on('change', updateTypeButton);

function updatePriceButton() {
    const minPricefortext = $('#min-price option:selected').text();
    const maxPricefortext = $('#max-price option:selected').text();
    const priceText = `${minPricefortext} - ${maxPricefortext}`;
    $('#price-filter-btn').html(priceText).css({
        'background': 'black',
        'color': 'white'
    });
}

function updateSuperficieButton() {
    const minSuperficiefortext = $('#min-superficie option:selected').text();
    const maxSuperficiefortext = $('#max-superficie option:selected').text();
    const superficieText = `${minSuperficiefortext} - ${maxSuperficiefortext}`;
    $('#superficie-filter-btn').html(superficieText).css({
        'background': 'black',
        'color': 'white'
    });
}

function updateTypeButton() {
    const typefortext = $('#select-type option:selected').text();
    const typeText = `Type: ${typefortext}`;
    $('#type-filter-btn').html(typeText).css({
        'background': 'black',
        'color': 'white'
    });
}

$('#save-search-btn').on('click', function() {
    useFilter = true;
    isFilterActive = true;
    console.log('Save Search button clicked, enabling filter mode');


    $('#cancel-filter-btn').css('display', 'block');

    // Get the selected price, superficie, and type ranges
    const minPrice = $('#min-price').val();
    const maxPrice = $('#max-price').val();
    const minSuperficie = $('#min-superficie').val();
    const maxSuperficie = $('#max-superficie').val();
    const typeDeBien = $('#select-type').val();

    console.log('Selected Filters:', {minPrice, maxPrice, minSuperficie, maxSuperficie, typeDeBien});

    // Get the map bounds
    const bounds = map.getBounds();
    const latMin = bounds.getSouthWest().lat();
    const latMax = bounds.getNorthEast().lat();
    const lngMin = bounds.getSouthWest().lng();
    const lngMax = bounds.getNorthEast().lng();

    // Prepare the parameters for the filtered request
    const params = {
        lat_min: latMin,
        lat_max: latMax,
        lng_min: lngMin,
        lng_max: lngMax,
        min_price: parseInt(minPrice),
        max_price: parseInt(maxPrice),
        min_superficie: parseInt(minSuperficie),
        max_superficie: parseInt(maxSuperficie),
        type_de_bien: typeDeBien
    };
    
    console.log('Fetching filtered data with params:', params);
    fetchLocalDataWithFilter(params); // Call the function to fetch filtered data
});

function fetchLocalDataWithFilter(params) {
    $.ajax({
        url: 'Server/fetch_filtered_data.php',
        method: 'GET',
        data: params,
        dataType: 'json',
        success: function(data) {
            console.log('Filtered Data Received:', data);

            const newMarkers = new Map();
            const zoom = map.getZoom();
            const isZoomedIn = zoom >= 16;

            data.forEach(place => {
                const position = new google.maps.LatLng(parseFloat(place.Latitude), parseFloat(place.Longitude));
                const uniqueKey = `${place.Latitude},${place.Longitude}`;

                // Check if the marker already exists
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
                
                // Add the marker to the new set of markers
                newMarkers.set(uniqueKey, visibleMarkers.get(uniqueKey));
            });

            // Remove any markers that are no longer in the new set of markers
            visibleMarkers.forEach((marker, uniqueKey) => {
                if (!newMarkers.has(uniqueKey)) {
                    marker.setMap(null);  // Remove the marker from the map
                    visibleMarkers.delete(uniqueKey);  // Remove the marker from the visibleMarkers map
                    console.log("Marker removed:", uniqueKey);
                }
            });

            // Replace the visibleMarkers map with the new set
            visibleMarkers = newMarkers;

            toggleMarkers(); // To update the cluster
            displayMarkerCount(data.length);
        },
        error: function(error) {
            console.error('Error fetching filtered data:', error);
        }
    });
}

$('#cancel-filter-btn').on('click', function() {
    useFilter = false;
    isFilterActive = false;
    
    $('#price-filter-btn').html('Price <i class="fa-solid fa-chevron-down"></i>').css({
        'background': '#ffffff',
        'color': 'black'
    });
    $('#superficie-filter-btn').html('superficie<i class="fa-solid fa-chevron-down"></i>').css({
        'background': '#ffffff',
        'color': 'black'
    });
    $('#type-filter-btn').html('Type<i class="fa-solid fa-chevron-down"></i>').css({
        'background': '#ffffff',
        'color': 'black'
    });

    $('#cancel-filter-btn').hide(); // Hide the cancel filter button

    // Fetch the default data to reset the map
    fetchLocalData(map.getBounds());
});
