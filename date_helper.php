<?php
function calculateDateDifference($date) {
    if ($date) {
        // Convert the date string into a DateTime object
        $dateTime = new DateTime(substr($date, 0, 10));
        $now = new DateTime();

        // Calculate the difference between the current date and the given date
        $interval = $now->diff($dateTime);

        if ($interval->y > 0) {
            // Display the difference in years if greater than zero
            return $interval->y . ' year' . ($interval->y > 1 ? 's' : '') . ' ago';
        } elseif ($interval->m > 0) {
            // Display the difference in months if greater than zero
            return $interval->m . ' month' . ($interval->m > 1 ? 's' : '') . ' ago';
        } elseif ($interval->d > 0) {
            // Display the difference in days if greater than zero
            return $interval->d . ' day' . ($interval->d > 1 ? 's' : '') . ' ago';
        } else {
            return 'Today';
        }
    } else {
        return 'N/A';
    }
}
?>
