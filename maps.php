<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FEENWAY</title>
    <link rel="icon" href="icons/smallogo.png">
    <link rel="stylesheet" href="style.css">

    <link href="fontawesome/css/fontawesome.css" rel="stylesheet">
    <link href="fontawesome/css/brands.css" rel="stylesheet">
    <link href="fontawesome/css/solid.css" rel="stylesheet">
    <link rel="stylesheet" href="home.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB3MW5OeNFgHZ1Zqd2unW3UNsA6IDLYaFQ&libraries=places,drawing,geometry"></script>
    <script src="https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js"></script>
    <script src="formatprice.js"></script>
    <script src="sidebar.js"></script>

    <script src="Controller/Drawing.js"></script>
    <script src="Controller/Nearby.js"></script>
    <script src="Controller/Schools.js"></script>
    <script src="Controller/SignallingPlaces.js"></script>


    <script src="events.js"></script>
    <script src="markers.js"></script>
    <script src="map.js"></script>
    <script src="drawing.js"></script>
    <script src="fetchData.js"></script>

    <script>
        // Get filter parameters from PHP and make them available to JavaScript
        const city = '<?php echo isset($_GET['city']) ? htmlspecialchars($_GET['city']) : 'Casablanca'; ?>';
        const min_price = '<?php echo isset($_GET['min_price']) ? (int)$_GET['min_price'] : 0; ?>';
        const max_price = '<?php echo isset($_GET['max_price']) ? (int)$_GET['max_price'] : PHP_INT_MAX; ?>';
        const min_superficie = '<?php echo isset($_GET['min_superficie']) ? (int)$_GET['min_superficie'] : 0; ?>';
        const max_superficie = '<?php echo isset($_GET['max_superficie']) ? (int)$_GET['max_superficie'] : PHP_INT_MAX; ?>';
        const type_de_bien = '<?php echo isset($_GET['type']) ? htmlspecialchars($_GET['type']) : ''; ?>';
    </script>
  
</head>
<body>
<?php 
include("navbar.php");
include("filter.php");?>
    
    <div class="bottom-section">
        <button id="toggle-immos" class="custom-button active"><i class="fa-solid fa-location-dot"></i> Toggle Immos</button>
        <button id="display-signalisation" class="custom-button"><i class="fa-solid fa-triangle-exclamation"></i>Signalling Places</button>
    </div>
    <div id="school-filters">
        <div id="school-toggle" class="custom-button"><i class="fa-solid fa-school"></i> Schools</div>
        <div id="school-dropdown" class="dropdown-content">
            <div class="close-btn" id="school-close"><i class="fa-solid fa-xmark"></i></div>
            <div><input type="checkbox" id="primary_school"><label for="primary_school">Primary School</label></div>
            <div><input type="checkbox" id="secondary_school"><label for="secondary_school">Secondary School</label></div>
            <div><input type="checkbox" id="high_school"><label for="high_school">High School</label></div>
            <div><input type="checkbox" id="university"><label for="university">University</label></div>
            <div><input type="checkbox" id="kindergarten"><label for="kindergarten">Kindergarten</label></div>
        </div>
    </div>
    
    
    <div id="nearby-filters">
        <div id="nearby-toggle" class="custom-button"><i class="fa-solid fa-location-arrow"></i> Nearby</div>
        <div id="nearby-dropdown" class="dropdown-content">
            <div class="close-btn" id="nearby-close"><i class="fa-solid fa-xmark"></i></div>
            <div><input type="checkbox" id="supermarket"><i class="fa-solid fa-shop"></i> <label for="supermarket">Supermarket</label></div>
            <div><input type="checkbox" id="hospital"><i class="fa-solid fa-hospital"></i> <label for="hospital">Hospital</label></div>
            <div><input type="checkbox" id="park"><i class="fa-solid fa-square-parking"></i> <label for="park">Park</label></div>
            <div><input type="checkbox" id="restaurant"><i class="fa-solid fa-utensils"></i> <label for="restaurant">Restaurant</label></div>
            <div><input type="checkbox" id="mosque"><i class="fa-solid fa-mosque"></i> <label for="mosque">Mosque</label></div>
        </div>
    </div>
    
    
    <div class="navigation">
        <button id="toggle-drawing" class="custom-button"><i class="fa-solid fa-draw-polygon"></i> Draw</button>
        <button class="sattelite"><i class="fa-solid fa-earth-americas"></i> Sattelite</button>
    </div>
    <div id="sidebar">

        <div id="place-details" style="display:none;">
            
            <div id="image-container">
                <img id="place-image" src="" alt="Place Image">
            </div>
            <div class="status">
                <div class="status-details">
                <span class="badge"></span>
                <p class="title"></p>
                </div>
                <div class="date">
                    <p id="place-date"></p>
                </div>
            </div>
            <div class="pricesection">
                <p id="place-price"></p>
            </div>
            <div class="place-details-info">
                <p id="place-superficie"></p>
                <p id="place-etage"></p>
                <p id="place-terrasse"></p>
                <p id="place-balcon"></p>
            </div>
            <div class="plussection">
                <p id="place-ville"></p>
                <button class="more-details-btn">See more</button>
            </div>
        </div>
        <div id="loading-spinner" style="display:none;">Loading...</div>
        
            
    </div>
    <div id="cancel-filter-btn" style="display: none;">
        <button>
            <i class="fa-solid fa-ban"></i> Cancel Filter
        </button>
    </div>
    <div id="map"></div>
    <script src="filter.js"></script>
</body>
</html>
