<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Génération d'une frontière unique pour le multipart
    $boundary = md5(time());
    
    // Récupération des données du formulaire
    $product_name = $_POST['product-name'] ?? '';
    $quantity = $_POST['quantity'] ?? '1';
    $firstname = $_POST['firstname'] ?? '';
    $lastname = $_POST['lastname'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $street = $_POST['street'] ?? '';
    $postal = $_POST['postal'] ?? '';
    $city = $_POST['city'] ?? '';
    $country = $_POST['country'] ?? '';
    $message = $_POST['message'] ?? '';
    $newsletter = isset($_POST['newsletter']) ? 'Oui' : 'Non';
    $terms = isset($_POST['terms']) ? 'Acceptées' : 'Non acceptées';

    // Construction du sujet
    $subject = "Nouvelle commande - $product_name - El Trio Factory";

    // En-têtes de l'email avec l'adresse d'envoi configurée sur le serveur
    $headers = "From: eltriofactory@webhosting.be\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    // Construction du corps du message
    $emailBody = "Nouvelle commande reçue :\n\n";
    $emailBody .= "Produit : $product_name\n";
    $emailBody .= "Quantité : $quantity\n\n";
    $emailBody .= "Informations client :\n";
    $emailBody .= "Nom : $firstname $lastname\n";
    $emailBody .= "Email : $email\n";
    $emailBody .= "Téléphone : $phone\n\n";
    $emailBody .= "Adresse de livraison :\n";
    $emailBody .= "$street\n";
    $emailBody .= "$postal $city\n";
    $emailBody .= "$country\n\n";
    $emailBody .= "Newsletter : $newsletter\n";
    $emailBody .= "Conditions générales : $terms\n\n";
    
    if (!empty($message)) {
        $emailBody .= "Remarques supplémentaires :\n$message\n";
    }

    // Envoi de l'email
    $to = "info@eltriofactory.com";
    
    if(mail($to, $subject, $emailBody, $headers)) {
        echo json_encode(['success' => true]);
    } else {
        error_log("Erreur d'envoi de mail: " . error_get_last()['message']);
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi du mail']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
}
?>

