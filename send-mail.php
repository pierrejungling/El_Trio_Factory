<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Génération d'une frontière unique pour le multipart
    $boundary = md5(time());
    
    // Récupération des données du formulaire
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
    $subject = "Nouveau formulaire de contact - El Trio Factory";

    // En-têtes de l'email avec l'adresse d'envoi configurée sur le serveur
    $headers = "From: eltriofactory@webhosting.be\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    // Corps du message
    $emailContent = "--$boundary\r\n";
    $emailContent .= "Content-Type: text/plain; charset=utf-8\r\n\r\n";
    
    // Construction du corps du message
    $emailBody = "Nouveau message d'un visiteur du site :\n\n";
    $emailBody .= "Nom : $firstname $lastname\n";
    $emailBody .= "Email : $email\n";
    $emailBody .= "Téléphone : $phone\n\n";
    $emailBody .= "Adresse :\n";
    $emailBody .= "$street\n";
    $emailBody .= "$postal $city\n";
    $emailBody .= "$country\n\n";
    $emailBody .= "Newsletter : $newsletter\n";
    $emailBody .= "Conditions générales : $terms\n\n";
    $emailBody .= "Message :\n$message\n";

    $emailContent .= $emailBody;

    // Traitement des pièces jointes
    if (!empty($_FILES['attachments'])) {
        $files = $_FILES['attachments'];
        
        // Gestion de fichiers multiples
        if (is_array($files['name'])) {
            $totalSize = 0;
            
            for ($i = 0; $i < count($files['name']); $i++) {
                if ($files['error'][$i] === UPLOAD_ERR_OK) {
                    $fileName = $files['name'][$i];
                    $fileType = $files['type'][$i];
                    $fileSize = $files['size'][$i];
                    
                    // Vérification de la taille totale (max 20Mo pour tous les fichiers)
                    $totalSize += $fileSize;
                    if ($totalSize > 20 * 1024 * 1024) {
                        echo json_encode(['success' => false, 'message' => "La taille totale des fichiers dépasse la limite autorisée (20Mo)"]);
                        exit;
                    }
                    
                    // Vérification du type de fichier
                    $allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/svg+xml'];
                    if (!in_array($fileType, $allowedTypes)) {
                        echo json_encode(['success' => false, 'message' => "Le type de fichier de $fileName n'est pas autorisé"]);
                        exit;
                    }
                    
                    $fileContent = file_get_contents($files['tmp_name'][$i]);
                    $emailContent .= "\r\n--$boundary\r\n";
                    $emailContent .= "Content-Type: $fileType; name=\"$fileName\"\r\n";
                    $emailContent .= "Content-Disposition: attachment; filename=\"$fileName\"\r\n";
                    $emailContent .= "Content-Transfer-Encoding: base64\r\n\r\n";
                    $emailContent .= chunk_split(base64_encode($fileContent));
                }
            }
        }
    }

    $emailContent .= "\r\n--$boundary--";

    // Envoi de l'email
    $to = "info@eltriofactory.com";
    
    if(mail($to, $subject, $emailContent, $headers)) {
        echo json_encode(['success' => true]);
    } else {
        error_log("Erreur d'envoi de mail: " . error_get_last()['message']);
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi du mail']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
}
?>

