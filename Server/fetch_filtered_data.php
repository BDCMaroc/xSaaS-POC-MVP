<?php
include 'connexion.php';  // Include the database connection

// Retrieve and sanitize the input parameters
$lat_min = filter_input(INPUT_GET, 'lat_min', FILTER_VALIDATE_FLOAT);
$lat_max = filter_input(INPUT_GET, 'lat_max', FILTER_VALIDATE_FLOAT);
$lng_min = filter_input(INPUT_GET, 'lng_min', FILTER_VALIDATE_FLOAT);
$lng_max = filter_input(INPUT_GET, 'lng_max', FILTER_VALIDATE_FLOAT);
$min_price = filter_input(INPUT_GET, 'min_price', FILTER_VALIDATE_INT);
$max_price = filter_input(INPUT_GET, 'max_price', FILTER_VALIDATE_INT);
$min_superficie = filter_input(INPUT_GET, 'min_superficie', FILTER_VALIDATE_INT);
$max_superficie = filter_input(INPUT_GET, 'max_superficie', FILTER_VALIDATE_INT);
$type_de_bien = filter_input(INPUT_GET, 'type_de_bien', FILTER_SANITIZE_STRING);

// Validate the input parameters
if ($lat_min === false || $lat_max === false || $lng_min === false || $lng_max === false) {
    echo json_encode(['error' => 'Invalid geographical parameters']);
    exit;
}

$conditions = [
    'Latitude BETWEEN ? AND ?',
    'Longitude BETWEEN ? AND ?'
];
$params = [$lat_min, $lat_max, $lng_min, $lng_max];
$types = "dddd";

// Add price filter conditions
if ($min_price !== null && $min_price > 0) {
    $conditions[] = 'Prix >= ?';
    $params[] = $min_price;
    $types .= 'i';
}
if ($max_price !== null && $max_price > 0) {
    $conditions[] = 'Prix <= ?';
    $params[] = $max_price;
    $types .= 'i';
}

// Add superficie filter conditions
if ($min_superficie !== null && $min_superficie > 0) {
    $conditions[] = 'Superficie >= ?';
    $params[] = $min_superficie;
    $types .= 'i';
}
if ($max_superficie !== null && $max_superficie > 0) {
    $conditions[] = 'Superficie <= ?';
    $params[] = $max_superficie;
    $types .= 'i';
}

// Add type de bien filter condition
if ($type_de_bien !== null && $type_de_bien !== '') {
    $conditions[] = 'Type_de_bien = ?';
    $params[] = $type_de_bien;
    $types .= 's';
}

// Build the SQL query
$sql = "SELECT Latitude, Longitude, Prix, Url, Superficie, Images_url, Telephone, Type_de_bien , Transaction , Ville, Date , Étage, Terrasse , id , Balcon 
        FROM immo_infos_with_gps 
        WHERE " . implode(' AND ', $conditions) . " 
        LIMIT 1000";

// Debugging: log the query and parameters
error_log("Executing SQL: $sql with parameters: " . implode(', ', $params));

// Prepare the SQL statement
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    error_log("SQL Error: " . $conn->error);
    echo json_encode(['error' => 'Internal Server Error - unable to prepare statement']);
    exit;
}

// Bind parameters dynamically
if (!$stmt->bind_param($types, ...$params)) {
    error_log("Bind Param Error: " . $stmt->error);
    echo json_encode(['error' => 'Internal Server Error - unable to bind parameters']);
    exit;
}

// Execute the statement and handle any execution errors
if (!$stmt->execute()) {
    error_log("Execute Error: " . $stmt->error);
    echo json_encode(['error' => 'Internal Server Error - unable to execute statement']);
    exit;
}

$result = $stmt->get_result();  // Get the result of the executed statement
$data = array();

// Fetch each row and add it to the data array
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

$stmt->close();  // Close the statement
$conn->close();  // Close the database connection

header('Content-Type: application/json');  // Set the header to return JSON content
echo json_encode($data);  // Encode the data as JSON and output it
?>
