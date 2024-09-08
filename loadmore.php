<?php
include 'Server/connexion.php';
include 'date_helper.php';

$city = $_POST['city'] ?? 'Casablanca';
$min_price = $_POST['min_price'] ?? 0;
$max_price = $_POST['max_price'] ?? PHP_INT_MAX; 
$min_superficie = $_POST['min_superficie'] ?? 0;
$max_superficie = $_POST['max_superficie'] ?? PHP_INT_MAX;
$type = $_POST['type'] ?? ''; 

$page = $_POST["page"] ?? 1;
$limit = 8;
$row = ($page - 1) * $limit;

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

$sql .= " LIMIT $row, $limit";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($place = $result->fetch_assoc()) {
        echo '<div class="place-card">
                <a href="place_details.php?id='.$place['id'].'" class="place-link">
                <div id="image-container">
                    <img id="place-image" src="'.($place['Images_url'] ? explode(',', $place['Images_url'])[0] : 'default.jpg').'" alt="Place Image">
                </div>
                <div class="status">
                    <div class="status-details">'
                        .($place['Transaction'] == 'Vente' ? '<span class="badge"></span>' : '<span class="badge" style="background-color: #ffbc1c;"></span>').'
                        <p class="title">'.($place['Transaction'] == 'Vente' ? 'For Sale' : 'For Rent').'</p>
                    </div>
                    <div class="date">
                        <p id="place-date">'.calculateDateDifference($place['Date']).'</p>
                    </div>
                </div>
                <div class="pricesection">
                    <p id="place-price">'.$place['Prix'].' DH</p>
                </div>
                <div class="place-details-info">
                    <p id="place-superficie"><strong>'.$place['Superficie'].'</strong> Sup</p>
                    <p id="place-etage"><strong>'.($place['Étage'] ?: 'N/A').'</strong> Etage</p>
                    <p id="place-balcon"><strong>'.($place['Balcon'] ?: '0').'</strong> Balcon</p>
                </div>
                <div class="plussection">
                    <p id="place-ville">'.(substr($place['Ville'], 12) ?: 'N/A').'</p>
                </div>
</a>

            </div>';
    }
} else {
    echo '<p>No more places found.</p>';
}

$conn->close();
