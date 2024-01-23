<?php
$name = $_POST["name"];
$email = $_POST["email"];
$subject = $_POST["subject"];
$message = $_POST["message"];

$content = "From: $name ($email) <br> Message : $message";

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "
                <script>
                    alert('Invalid e-mail address!');
                    setTimeout(function(){
                    window.location.href = '/contactMe'; 
                    }, 1);
                </script>";
        exit;
    }

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/src/Exception.php';
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';

if (isset($_POST["send"])) {
    $mail = new PHPMailer(true);

    $mail -> isSMTP();
    $mail -> Host = 'smtp.gmail.com';
    $mail -> SMTPAuth = true;
    $mail -> Username = 'n.gokcenguner@gmail.com';
    $mail -> Password = '****';
    $mail -> SMTPSecure = 'ssl';
    $mail -> Port = 465;
    
    $mail -> CharSet = 'UTF-8';
    
    $mail -> addReplyTo($email, $name);

    $mail -> setFrom("noreply@flowcalculator.xyz", "flowcalculator");
    
    $mail -> addAddress('n.gokcenguner@gmail.com');

    $mail -> isHTML(true);

    $mail -> Subject = "From flowcalculator:  $subject";
    $mail -> Body = $content;
    
    $mail -> send();

    header("Location: /thankyou");
}
?>