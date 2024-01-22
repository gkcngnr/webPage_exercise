<?php
$name = $_POST["name"];
$email = $_POST["email"];
$subject = $_POST["subject"];
$message = $_POST["message"];

$content = "$name adlı kişiden gelen mesaj : $message";

$to = "goki_guner@hotmail.com";
$header = "From: $email";

$result = mail($to, $subject, $content, $header);



header("Location: thankyou.html");

?>