<?php
include 'connexion.php';

$lat = filter_input(INPUT_GET, 'lat', FILTER_VALIDATE_FLOAT);
$lng = filter_input(INPUT_GET, 'lng', FILTER_VALIDATE_FLOAT);
$radius = filter_input(INPUT_GET, 'radius', FILTER_VALIDATE_FLOAT);

if ($lat === false || $lng === false || $radius === false) {
    echo json_encode(['error' => 'Invalid input parameters']);
    exit;
}

$sql = "SELECT Latitude, Longitude, Prix, Url, Superficie, Images_url, Telephone,
        (6371 * acos(cos(radians(?)) * cos(radians(Latitude)) * cos(radians(Longitude) - radians(?)) + sin(radians(?)) * sin(radians(Latitude)))) AS distance
        FROM immo_infos_with_gps
        HAVING distance < ?
        ORDER BY distance
        LIMIT 1000";

$stmt = $conn->prepare($sql);
if ($stmt === false) {
    echo json_encode(['error' => 'Internal Server Error - unable to prepare statement']);
    exit;
}

$stmt->bind_param("dddi", $lat, $lng, $lat, $radius);
if (!$stmt->execute()) {
    echo json_encode(['error' => 'Internal Server Error - unable to execute statement']);
    exit;
}

$result = $stmt->get_result();
$data = array();
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($data);
?>
