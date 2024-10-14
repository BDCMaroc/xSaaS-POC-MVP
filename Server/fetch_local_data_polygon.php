<?php
include 'connexion.php';  // Include the database connection

// Retrieve and decode the input parameters
$input = json_decode(file_get_contents('php://input'), true);
$coordinates = $input['coordinates'];

// Prepare the SQL query
$sql = "SELECT Latitude, Longitude, Prix, Url, Superficie, Images_url, Telephone, Type_de_bien , Transaction , Ville, Date , Étage, Terrasse, Balcon , Parking , id , Nb_de_façades , id 
        FROM immo_infos_with_gps 
        WHERE ST_CONTAINS(ST_GeomFromText('POLYGON((";

foreach ($coordinates as $coordinate) {
    $sql .= $coordinate['lng'] . ' ' . $coordinate['lat'] . ',';
}

// Close the polygon by adding the first point at the end
$sql .= $coordinates[0]['lng'] . ' ' . $coordinates[0]['lat'];

$sql .= "))'), POINT(Longitude, Latitude)) ";

$result = $conn->query($sql);
$data = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($data);
?>
