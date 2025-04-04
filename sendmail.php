<?php
// Configuration
$sendto = 'info@hypetribe.co.za';  // The email address to receive the form submission
$subject = 'Message from website Contact Form';  // Email subject

// Error and success messages
$errormessage = 'There seems to have been a problem. May we suggest:';
$thanks = "Thanks for the email! We'll get back to you as soon as possible!";
$emptyname = 'Entering your name?';
$emptyemail = 'Entering your email address?';
$emptymessage = 'Entering a message?';
$alertname = 'Entering your name using only the standard alphabet?';
$alertemail = 'Entering your email in this format: name@example.com?';
$alertmessage = "Making sure you aren't using any parenthesis or other escaping characters in the message?";

// Variables for validation
$alert = '';
$pass = 0;

// Function to sanitize input
function clean_var($variable)
{
    return strip_tags(stripslashes(trim(rtrim($variable))));
}

// Form validation
if (empty($_REQUEST['name'])) {
    $pass = 1;
    $alert .= "<li>" . $emptyname . "</li>";
} elseif (preg_match("/[{}()*+?.\\^$|]/", $_REQUEST['name'])) {
    $pass = 1;
    $alert .= "<li>" . $alertname . "</li>";
}

if (empty($_REQUEST['email'])) {
    $pass = 1;
    $alert .= "<li>" . $emptyemail . "</li>";
} elseif (!preg_match("/^[_a-z0-9-]+(\\.[_a-z0-9-]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)*(\\.[a-z]{2,3})$/", $_REQUEST['email'])) {
    $pass = 1;
    $alert .= "<li>" . $alertemail . "</li>";
}

if (empty($_REQUEST['message'])) {
    $pass = 1;
    $alert .= "<li>" . $emptymessage . "</li>";
} elseif (preg_match("/[][{}()*+?\\^$|]/", $_REQUEST['message'])) {
    $pass = 1;
    $alert .= "<li>" . $alertmessage . "</li>";
}

// If errors occurred, show error messages
if (1 == $pass) {
    echo "<script>jQuery('#contact_alert').removeClass('success').addClass('notice');</script>";
    echo $errormessage;
    echo '<ul class="no-margin-bottom">' . $alert . '</ul>';
} elseif (isset($_REQUEST['message'])) {
    // No errors, proceed with sending the email
    $name = clean_var($_REQUEST['name']);
    $email = clean_var($_REQUEST['email']);
    $message = clean_var($_REQUEST['message']);

    // Construct the message
    $msgBody = "From: " . $name . "\n";
    $msgBody .= "Email: " . $email . "\n";
    $msgBody .= "Message: \n" . $message;

    // Construct the email headers
    $header = 'From: ' . $email;

    // Send the email
    $success = mail($sendto, $subject, $msgBody, $header);

    // If the email was sent successfully
    if ($success) {
        echo "<script>jQuery('#contact_alert').removeClass('notice').addClass('success'); jQuery('#contact_form')[0].reset();</script>";
        echo $thanks;
    } else {
        echo "<script>jQuery('#contact_alert').removeClass('notice').addClass('error');</script>";
        echo "There was an issue sending your email. Please try again later.";
    }

    die();
}
?>