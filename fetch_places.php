<?php
include 'Server/connexion.php';

$city = $_GET['city'] ?? 'Casablanca'; // Default to Casablanca if no city is selected

$sql = "SELECT * FROM immo_infos_with_gps WHERE Villee = '$city' LIMIT 4";
$result = $conn->query($sql);
include("formatprice.php");

if ($result->num_rows > 0):
    while($place = $result->fetch_assoc()): ?>
<div class="place-card">
<a href="place_details.php?id=<?php echo $place['id']; ?>" class="place-link">
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
        <p id="place-date"><?php echo $place['date_extraction']; ?></p> 
        </div>
    </div>
    <div class="pricesection">
    <p id="place-price"><?php echo formatPrice($place['Prix']); ?></p>
    </div>
    <div class="place-details-info">
        <p id="place-superficie"><?php echo $place['Superficie']; ?> Sup</p>
        <p id="place-etage"><?php echo $place['Étage'] ?: 'N/A'; ?> Etage</p>
        <p id="place-balcon"><?php echo $place['Balcon'] ?: '0'; ?> Balcon</p>
    </div>
    <div class="plussection">
        <p id="place-ville">
            <?php echo $place['Ville'] ?: 'N/A'; ?>
        </p>
    </div>
    </a>
</div>
<script src="fetchBySearchBar.js"></script>

<?php endwhile;
else: ?>
<p>No places found.</p>
<?php endif;

$conn->close();
?>