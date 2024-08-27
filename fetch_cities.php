<?php
include 'Server/connexion.php';

$search = $_GET['search'] ?? '';

$sql = "SELECT DISTINCT Villee FROM immo_infos_with_gps WHERE Villee LIKE '%$search%' ORDER BY Villee ASC";
$result = $conn->query($sql);

$cities = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $cities[] = $row['Villee'];
    }
}

echo json_encode($cities);
?>