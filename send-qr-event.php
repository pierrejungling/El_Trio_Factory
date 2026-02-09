<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Génération d'une frontière unique pour le multipart
$boundary = md5(time());

// Récupération des données du formulaire
$typeEvenement = $_POST['type_evenement'] ?? 'Non renseigné';
$nomEntreprise = $_POST['nom_entreprise'] ?? '';
$nom = $_POST['nom'] ?? '';
$prenom = $_POST['prenom'] ?? '';
$email = $_POST['email'] ?? '';
$telephone = $_POST['telephone'] ?? '';
$dateEvenement = $_POST['date_evenement'] ?? 'Non renseigné';
$lieu = $_POST['lieu'] ?? 'Non renseigné';
$participants = $_POST['participants'] ?? 'Non renseigné';
$theme = $_POST['theme'] ?? 'Non renseigné';
$formule = $_POST['formule'] ?? 'Non renseignée';
$cartePerso = $_POST['carte_personnalisee'] ?? 'Non renseigné';
$carteSupport = $_POST['carte_support_type'] ?? 'Non renseigné';
$listeCocktails = $_POST['liste_cocktails'] ?? 'Non renseignée';
$mocktails = $_POST['mocktails'] ?? 'Non renseigné';
$barMobile = $_POST['bar_mobile'] ?? 'Non renseigné';
$mangeDebout = $_POST['mange_debout'] ?? 'Non renseigné';
$verrerie = $_POST['verrerie'] ?? 'Non renseignée';
$supportsPerso = $_POST['supports_personnalises'] ?? 'Non renseigné';
$supportsDetails = $_POST['supports_personnalises_details'] ?? 'Non renseigné';
$infosComplementaires = $_POST['infos_complementaires'] ?? 'Non renseigné';

// Construction du sujet
$subject = "Nouveau formulaire QR Event - $typeEvenement";

// En-têtes de l'email avec l'adresse d'envoi configurée sur le serveur
$headers = "From: eltriofactorycom@webhosting.be\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Corps du message
$emailContent = "--$boundary\r\n";
$emailContent .= "Content-Type: text/plain; charset=utf-8\r\n\r\n";

// Construction du corps du message
$emailBody = "Nouvelle demande QR Event :\n\n";
$emailBody .= "Type d'événement : $typeEvenement\n";
if (!empty($nomEntreprise)) {
    $emailBody .= "Entreprise : $nomEntreprise\n";
}
$emailBody .= "Nom : $prenom $nom\n";
$emailBody .= "Email : $email\n";
$emailBody .= "Téléphone : $telephone\n\n";
$emailBody .= "Date : $dateEvenement\n";
$emailBody .= "Lieu : $lieu\n";
$emailBody .= "Participants : $participants\n";
$emailBody .= "Thème : $theme\n\n";
$emailBody .= "Formule : $formule\n\n";
$emailBody .= "Carte personnalisée : $cartePerso\n";
$emailBody .= "Support carte : $carteSupport\n";
$emailBody .= "Liste cocktails : $listeCocktails\n";
$emailBody .= "Mocktails : $mocktails\n\n";
$emailBody .= "Bar mobile : $barMobile\n";
$emailBody .= "Mange debout : $mangeDebout\n";
$emailBody .= "Verrerie : $verrerie\n\n";
$emailBody .= "Supports personnalisés : $supportsPerso\n";
$emailBody .= "Détails supports : $supportsDetails\n\n";
$emailBody .= "Informations complémentaires :\n$infosComplementaires\n";

$emailContent .= $emailBody;
$emailContent .= "\r\n--$boundary--";

// Envoi de l'email
$to = "info@eltriofactory.com";

if (mail($to, $subject, $emailContent, $headers)) {
    echo json_encode(['success' => true]);
} else {
    error_log("Erreur d'envoi de mail: " . error_get_last()['message']);
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi du mail']);
}
?>
