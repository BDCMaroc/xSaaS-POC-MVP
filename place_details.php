<?php
if (isset($_GET['place_id'])) {
    $placeId = $_GET['place_id'];
} else {
    echo "No place ID provided.";
    exit();
}
?>
<!DOCTYPE html>
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="style.css">
    <title>Place Details</title>
    </style>
</head>
<body>
    
    <div class="place-details">
        <div class="topbarinfo">
            <h2 id="place-name"></h2>
            <button class="back-button" onclick="goBack()">Back</button>
        </div>
        <div class="centrebarinfo">
            <img id="place-photo" src="" alt="Place photo">
        <div class="details-section">
            <div class="sections">
                <p class="nameofinfo">Address:</p>            
                <p id="place-address"></p>
            </div>
            <div class="sections">
                <p class="nameofinfo">Phone :</p>            
                <p id="place-phone"></p>
            </div>
            <div class="sections">
                <p class="nameofinfo">Website :</p>            
                <p id="place-website"></p>
            </div>
            <div class="sections">
                <p class="nameofinfo">Rating :</p>            
                <p id="place-rating"></p>
            </div>




        </div>
        </div>
    </div>

    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB3MW5OeNFgHZ1Zqd2unW3UNsA6IDLYaFQ&libraries=places"></script>
    <script>
        const placeId = "<?php echo $placeId; ?>";

        function initPlaceDetails() {
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            service.getDetails({placeId: placeId}, function(place, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    document.getElementById('place-name').textContent = place.name;
                    document.getElementById('place-address').textContent = place.formatted_address;
                    document.getElementById('place-photo').src = place.photos ? place.photos[0].getUrl() : 'default-image-url.jpg';
                    document.getElementById('place-phone').textContent = place.formatted_phone_number || 'N/A';
                    document.getElementById('place-website').innerHTML = place.website ? `<a href="${place.website}" target="_blank">${place.website}</a>` : 'N/A';
                    document.getElementById('place-rating').textContent = place.rating ? `${place.rating} stars` : 'No rating available';
                }
            });
        }

        function goBack() {
            window.history.back();
        }

        window.onload = initPlaceDetails;
    </script>
</body>
</html>
