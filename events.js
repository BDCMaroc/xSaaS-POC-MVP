

$(document).ready(function() {
    // Initial setup
    $('#toggle-immos').addClass('active');
    $('#toggle-immos').on('click', toggleImmoMarkers);
    $('#display-signalisation').on('click', toggleSignalisationMarkers);
    $('#toggle-drawing').on('click', toggleDrawingMode);
    $('.sattelite').on('click', toggleSatellite);
    let city = new URLSearchParams(window.location.search).get('city') || localStorage.getItem('selectedCity') || 'Casablanca';
    // Fetch default location
    $.ajax({
        url: 'Server/default_location.php',
        method: 'GET',
        dataType: 'json',
        data: { city: city },
        success: function(data) {
            let defaultLocation = { lat: parseFloat(data.lat), lng: parseFloat(data.lng) };
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




