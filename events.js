$(document).ready(function() {
    // Initial setup
    $('#toggle-immos').addClass('active');
    $('#toggle-immos').on('click', toggleImmoMarkers);
    $('#display-signalisation').on('click', toggleSignalisationMarkers);
    $('.circle').on('click', toggleDrawCircle);
    $('.polygone').on('click', toggleDrawPolygon);
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

function toggleDrawCircle() {
    if ($('.circle').hasClass('active')) {
        clearSelectedShape();
        drawingManager.setDrawingMode(null);
        $('.circle').removeClass('active').html('<i class="fa-solid fa-circle"></i> Circle').css({backgroundColor: '', color: ''});
    } else {
        clearSelectedShape();
        drawCircle();
        $('.circle').addClass('active').html('<i class="fa-regular fa-circle-xmark"></i> Circle').css({backgroundColor: '#ffbc1c', color: 'white'});
        $('.polygone').removeClass('active').html('<i class="fa-solid fa-circle-nodes"></i> Polygone').css({backgroundColor: '', color: ''});
    }
}

function toggleDrawPolygon() {
    if ($('.polygone').hasClass('active')) {
        clearSelectedShape();
        drawingManager.setDrawingMode(null);
        $('.polygone').removeClass('active').html('<i class="fa-solid fa-circle-nodes"></i> Polygone').css({backgroundColor: '', color: ''});
    } else {
        clearSelectedShape();
        drawPolygon();
        $('.polygone').addClass('active').html('<i class="fa-regular fa-circle-xmark"></i> Polygone').css({backgroundColor: '#ffbc1c', color: 'white'});
        $('.circle').removeClass('active').html('<i class="fa-solid fa-circle"></i> Circle').css({backgroundColor: '', color: ''});
    }
}
