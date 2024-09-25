<?php
include 'Server/connexion.php';

$place_id = $_GET['id'] ?? null;

if ($place_id) {
    $sql = "SELECT * FROM immo_infos_with_gps WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $place_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $place = $result->fetch_assoc();
} else {
    echo "Invalid place ID.";
    exit;
}

function calculateDateDifference($date) {
    $currentDate = new DateTime();
    $placeDate = new DateTime($date);
    $interval = $placeDate->diff($currentDate);

    return $interval->format('%a days ago');
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <?php include("header.php") ?>
    <link rel="stylesheet" href="place_details.css">
</head>

<body>
    <?php include("navbar.php") ?>

    <div class="property-details-container">
        <div class="image-gallery">
            <div class="main-image">
                <img id="main-image" src="<?php echo $place['Images_url'] ? explode(',', $place['Images_url'])[0] : 'default.jpg'; ?>" alt="Main Property Image">
                <div class="image-nav">
                    <button id="prev-image" class="nav-btn"><i class="fa-solid fa-arrow-left"></i></button>
                    <button id="next-image" class="nav-btn"><i class="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>
            <div class="thumbnails">
                <?php
                $images = explode(',', $place['Images_url']);
                foreach ($images as $index => $image) {
                    echo "<img class='thumbnail' src='$image' data-index='$index' alt='Thumbnail'>";
                }
                ?>
            </div>
            <div class="description-place">
                <h3>Description</h3>
                <p><?php echo $place['Description'] ?: 'No description about this page'; ?></p>
            </div>
        </div>

        <div class="property-info">
            <div class="p1">
            <div class="listing-details">
                <div class="status-details">
                            <?php echo $place['Transaction'] == 'Vente' ? '<span class="badge"></span>' : '<span class="badge" style="background-color: #ffbc1c;"></span>'; ?>
                            <p class="title"><?php echo $place['Transaction'] == 'Vente' ? 'For Sale' : 'For Rent'; ?></p>
                </div>
                <h1><?php echo $place['Prix']; ?> DH</h1>
                <div class="secondary-info">
                    <div class="secondary-info-itmes">
                        <h4><?php echo $place['Superficie']; ?></h4>
                        <p>Sup</p>
                    </div>
                    <div class="secondary-info-itmes">
                        <h4><?php echo $place['Étage'] ?: 'N/A'; ?></h4>
                        <p>Etage</p>
                    </div>
                    <div class="secondary-info-itmes">
                        <h4><?php echo $place['Balcon'] ?: '0'; ?></h4>
                        <p>Balcon</p>
                    </div>
            </div>
                <div class="important-info">
                    <div class="important-info-items">
                        <i class="fa-solid fa-house">       </i>
                        <div class="important-info-items-data">
                    <h3><?php echo $place['Type_de_bien']; ?></h3>
                    <p>Type</p>
                    </div>
                </div>
                <div class="important-info-items">
                    <i class="fa-solid fa-calendar-day"></i>
                    <div class="important-info-items-data">
                    <h3><?php echo $place['date_extraction'] ?: 'N/A'; ?></h3>
                    <p><?php echo $place['Source'] ?: 'N/A'; ?>.com</p>
                    </div>
                </div>
                <div class="important-info-items">
                    <i class="fa-solid fa-location-dot"></i>
                    <div class="important-info-items-data">
                    <h3><?php echo $place['Quartier'] ?: 'N/A'; ?></h3>
                    <p>Quarter</p>
                    </div>
                </div>
                </div>
                
                <p class="address"><?php echo $place['Titre']; ?></p>
            </div>
        <div class="property-map">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3171.762111967152!2d<?php echo $place['Longitude']; ?>!3d<?php echo $place['Latitude']; ?>!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM0JzU1LjUiTiA3wrAzNicxNi4zIlc!5e0!3m2!1sen!2sus!4v1615251484791!5m2!1sen!2sus" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
        </div>
           
            </div>
            <div class="property-actions">
                <button class="ask-question-btn">Ask a Question</button>
                <button class="share-home-btn">Share this Home</button>
            </div>
        </div>


    </div>

    <script src="place_details.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
    const images = [
        <?php
        foreach ($images as $image) {
            echo "'$image',";
        }
        ?>
    ];

    let currentIndex = 0;
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');

    function updateMainImage() {
        mainImage.src = images[currentIndex];
    }

    document.getElementById('prev-image').addEventListener('click', function() {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        updateMainImage();
    });

    document.getElementById('next-image').addEventListener('click', function() {
        currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        updateMainImage();
    });

    thumbnails.forEach(function(thumbnail) {
        thumbnail.addEventListener('click', function() {
            currentIndex = parseInt(this.getAttribute('data-index'));
            updateMainImage();
        });
    });

    updateMainImage();
});

    </script>
</body>

</html>
