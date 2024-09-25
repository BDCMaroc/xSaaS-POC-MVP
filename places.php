<?php
include 'Server/connexion.php';
include 'date_helper.php';

$city = $_GET['city'] ?? 'Casablanca';
$min_price = $_GET['min_price'] ?? 0;
$max_price = $_GET['max_price'] ?? PHP_INT_MAX;
$min_superficie = $_GET['min_superficie'] ?? 0;
$max_superficie = $_GET['max_superficie'] ?? PHP_INT_MAX;
$type = $_GET['type'] ?? ''; 

$sql = "SELECT * FROM immo_infos_with_gps WHERE Villee = '$city'";

if (!empty($min_price)) {
    $sql .= " AND Prix >= $min_price";
}
if (!empty($max_price)) {
    $sql .= " AND Prix <= $max_price";
}

if (!empty($min_superficie)) {
    $sql .= " AND Superficie >= $min_superficie";
}
if (!empty($max_superficie)) {
    $sql .= " AND Superficie <= $max_superficie";
}
if (!empty($type)) {
    $sql .= " AND Type_de_bien = '$type'";
}

$sql .= " LIMIT 8";

$result = $conn->query($sql);

include("header.php");
include("navbar.php");
include("filter.php");
include("formatprice.php");


?>


<section class="browse-section-list">
<h2 class="title-city">
        <?php echo htmlspecialchars($city); ?> real estate & homes for sale
    </h2>
    <div class="browse-cards-list" id="data">
        <?php if ($result->num_rows > 0): ?>
            <?php while($place = $result->fetch_assoc()): ?>
                <div class="place-card">
                <a href="place_details.php?id=<?php echo $place['id']; ?>" class="place-link">
                    <div id="image-container">
                        <img id="place-image" src="<?php echo $place['Images_url'] ? explode(',', $place['Images_url'])[0] : 'default.jpg'; ?>" alt="Place Image">
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
                    <p id="place-price"><?php echo formatPrice($place['Prix']); ?></p>
                    </div>
                    <div class="place-details-info">
                        <p id="place-superficie"><strong><?php echo $place['Superficie']; ?></strong> Sup</p>
                        <p id="place-etage"><strong><?php echo $place['Étage'] ?: 'N/A'; ?></strong> Etage</p>
                        <p id="place-balcon"><strong><?php echo $place['Balcon'] ?: '0'; ?></strong> Balcon</p>
                    </div>
                    <div class="plussection">
                        <p id="place-ville"><?php echo $place['Ville'] ?: 'N/A'; ?></p>
                    </div>
                    </a>

                </div>
            <?php endwhile; ?>
        <?php else: ?>
            <p>No places found in <?php echo htmlspecialchars($city); ?>.</p>
        <?php endif; ?>

        <?php $conn->close(); ?>
    </div>
</section>

<script src="filterForListData.js"></script>
<script>
    var page_no = 2; // Start from the second page since the first is already loaded
    var debounceTimer; // Timer for debounce

    $(window).scroll(function() {
        clearTimeout(debounceTimer); // Clear the previous timer if still running
        debounceTimer = setTimeout(function() {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 1000 ) {
            console.log("loading");
            showdata();
        }
    },200); 
    });

    function showdata() {
        const city = '<?= $city; ?>';
        const min_price = '<?= $min_price; ?>';
        const max_price = '<?= $max_price; ?>';
        const min_superficie = '<?= $min_superficie; ?>';
        const max_superficie = '<?= $max_superficie; ?>';
        const type = '<?= $type; ?>';

        $.post("loadmore.php", {
            page: page_no,
            city: city,
            min_price: min_price,
            max_price: max_price,
            min_superficie: min_superficie,
            max_superficie: max_superficie,
            type: type
        }, function(response) {
            if (response.trim() !== '<p>No more places found.</p>') {
                $("#data").append(response);
                page_no++;
            } else {
                // Stop further requests if no more data
                $(window).off('scroll');
                $("#data").append(response);
            }
        });
    }
    
</script>
</body>
</html>
