<?php
include 'connexion.php';

$city = $_GET['city'] ?? 'Casablanca'; // Default to Casablanca if no city is provided

// Fetch the location of the selected city
$sql = "SELECT lat, lng FROM markers WHERE name = '$city' LIMIT 1";
$result = $conn->query($sql);

$defaultLocation = $result->fetch_assoc();

$conn->close();

echo json_encode($defaultLocation);
?>