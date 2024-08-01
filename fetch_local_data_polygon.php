<?php
include 'connexion.php';

$data = json_decode(file_get_contents("php://input"), true);
$coordinates = $data['coordinates'];

if (!is_array($coordinates) || empty($coordinates)) {
    echo json_encode(['error' => 'Invalid input parameters']);
    exit;
}

$poly = array_map(function($coord) {
    return "POINT({$coord['lng']} {$coord['lat']})";
}, $coordinates);

$polyString = implode(',', $poly);
$sql = "SELECT Latitude, Longitude, Prix, Url, Superficie, Images_url, Telephone
        FROM immo_infos_with_gps
        WHERE ST_CONTAINS(ST_GEOMFROMTEXT('POLYGON(({$polyString}))'), POINT(Longitude, Latitude))
        LIMIT 1000";

$result = $conn->query($sql);
$data = array();
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($data);
?>
