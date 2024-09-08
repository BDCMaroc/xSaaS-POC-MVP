<?php
include 'connexion.php';  // Include the database connection

// Retrieve and sanitize the input parameters using filter_input for security
$lat_min = filter_input(INPUT_GET, 'lat_min', FILTER_VALIDATE_FLOAT);
$lat_max = filter_input(INPUT_GET, 'lat_max', FILTER_VALIDATE_FLOAT);
$lng_min = filter_input(INPUT_GET, 'lng_min', FILTER_VALIDATE_FLOAT);
$lng_max = filter_input(INPUT_GET, 'lng_max', FILTER_VALIDATE_FLOAT);

// Validate the input parameters
if ($lat_min === false || $lat_max === false || $lng_min === false || $lng_max === false) {
    echo json_encode(['error' => 'Invalid input parameters']);
    exit;
}

// Define the SQL query to select the needed fields from the database
$sql = "SELECT Latitude, Longitude, Prix, Url, Superficie, Images_url, Telephone , Type_de_bien , Transaction , Ville, Date , Étage, Terrasse, Balcon , Parking , id , Nb_de_façades
        FROM immo_infos_with_gps 
        WHERE Latitude BETWEEN ? AND ? AND Longitude BETWEEN ? AND ? 
        LIMIT 1000"; // Limit the results to avoid overwhelming the client

$stmt = $conn->prepare($sql); // Prepare the SQL statement

// Error handling for failed statement preparation
if ($stmt === false) {
    echo json_encode(['error' => 'Internal Server Error - unable to prepare statement']);
    exit;  // Exit if the statement preparation fails
}

// Bind parameters to the prepared SQL statement
$stmt->bind_param("dddd", $lat_min, $lat_max, $lng_min, $lng_max);

// Execute the statement and handle any execution errors
if (!$stmt->execute()) {
    echo json_encode(['error' => 'Internal Server Error - unable to execute statement']);
    exit;  // Exit if execution fails
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
