<?php
include("header.php");
include("navbar.php");
include("filter.php");
include 'Server/connexion.php';
include 'date_helper.php';

// Retrieve filter parameters from the URL
$city = $_GET['city'] ?? 'Casablanca';
$min_price = $_GET['min_price'] ?? 0;
$max_price = $_GET['max_price'] ?? PHP_INT_MAX; // No upper limit if not set
$min_superficie = $_GET['min_superficie'] ?? 0;
$max_superficie = $_GET['max_superficie'] ?? PHP_INT_MAX; // No upper limit if not set
$type = $_GET['type'] ?? ''; // Empty string means no type filter

// Construct the SQL query with the filters
$sql = "SELECT * FROM immo_infos_with_gps WHERE Villee = '$city' 
        AND Prix >= $min_price 
        AND Prix <= $max_price 
        AND Superficie >= $min_superficie 
        AND Superficie <= $max_superficie";

if (!empty($type)) {
    $sql .= " AND Type_de_bien = '$type'";
}

$result = $conn->query($sql);
?>

<div class="title-section">
    <h2 class="title-city">
        <?php echo htmlspecialchars($city); ?> real estate & homes for sale
    </h2>
</div>

<section class="browse-section-list">
    <div class="browse-cards-list">
        <?php if ($result->num_rows > 0): ?>
            <?php while($place = $result->fetch_assoc()): ?>
                <div class="place-card">
                    <div id="image-container">
                        <img id="place-image"
                             src="<?php echo $place['Images_url'] ? explode(',', $place['Images_url'])[0] : 'default.jpg'; ?>"
                             alt="Place Image">
                    </div>
                    <div class="status">
                        <div class="status-details">
                            <?php echo $place['Transaction'] == 'Vente' ? '<span class="badge"></span>' : '<span class="badge" style="background-color: #ffbc1c;"></span>'; ?>
                            <p class="title"><?php echo $place['Transaction'] == 'Vente' ? 'For Sale' : 'For Rent'; ?></p>
                        </div>
                        <div class="date">
                            <p id="place-date"><?php echo calculateDateDifference($place['Date']); ?></p>
                        </div>
                    </div>
                    <div class="pricesection">
                        <p id="place-price"><?php echo $place['Prix']; ?> DH</p>
                    </div>
                    <div class="place-details-info">
                        <p id="place-superficie"><strong><?php echo $place['Superficie']; ?></strong> Sup</p>
                        <p id="place-etage"><strong><?php echo $place['Étage'] ?: 'N/A'; ?></strong> Etage</p>
                        <p id="place-balcon"><strong><?php echo $place['Balcon'] ?: '0'; ?></strong> Balcon</p>
                    </div>
                    <div class="plussection">
                        <p id="place-ville">
                            <?php echo substr($place['Ville'], 12) ?: 'N/A'; ?>
                        </p>
                    </div>
                </div>
            <?php endwhile; ?>
        <?php else: ?>
            <p>No places found in <?php echo htmlspecialchars($city); ?>.</p>
        <?php endif; ?>

        <?php $conn->close(); ?>
    </div>
</section>

<script src="filterForListData.js"></script>
</body>
</html>
