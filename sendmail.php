<?php
/**
 * GROUP PRESTIGE SERVICES SRL - Traitement d'envoi d'emails sécurisé
 * Compatible hébergement One.com (PHP mail() natif avec en-têtes SPF/DKIM conformes)
 */

// Configuration des en-têtes HTTP (JSON pour requêtes AJAX)
header('Content-Type: application/json; charset=utf-8');

// Configuration destinataire
$to_email = 'info@groupprestiges.be';
$to_name  = 'Samir CHIHAB - GROUP PRESTIGE SERVICES SRL';

// Vérification de la méthode de requête
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Méthode non autorisée. Seules les requêtes POST sont acceptées.'
    ]);
    exit;
}

// 1. Protection Anti-Spam Honeypot (si ce champ caché est rempli, c'est un robot)
if (!empty($_POST['website_hp'])) {
    // Réponse silencieuse positive pour tromper le bot
    echo json_encode([
        'status' => 'success',
        'message' => 'Message envoyé avec succès.'
    ]);
    exit;
}

// 2. Récupération et nettoyage sécurisé des données
$source = isset($_POST['form_source']) ? trim(strip_tags($_POST['form_source'])) : 'Formulaire de Contact';
$name = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$phone = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$email = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$service = isset($_POST['service']) ? trim(strip_tags($_POST['service'])) : 'Non spécifié';
$surface = isset($_POST['surface']) ? trim(strip_tags($_POST['surface'])) : '';
$frequency = isset($_POST['frequency']) ? trim(strip_tags($_POST['frequency'])) : '';
$commune = isset($_POST['commune']) ? trim(strip_tags($_POST['commune'])) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// 3. Validation des champs obligatoires
if (empty($name) || (empty($phone) && empty($email))) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Veuillez renseigner votre nom ainsi qu\'un numéro de téléphone ou une adresse email valide.'
    ]);
    exit;
}

if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'L\'adresse email saisie n\'est pas valide.'
    ]);
    exit;
}

// 4. Objet de l'email
$subject = "Nouvelle demande de devis : {$name}";
if (!empty($service) && $service !== 'Non spécifié') {
    $subject .= " - {$service}";
}

// 5. Corps de l'email en HTML élégant
$html_content = "
<!DOCTYPE html>
<html lang='fr'>
<head>
  <meta charset='UTF-8'>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #07192f 0%, #0070f3 100%); color: #ffffff; padding: 25px; text-align: center; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; }
    .header p { margin: 5px 0 0; font-size: 13px; color: #38bdf8; }
    .content { padding: 30px; }
    .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
    .info-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .info-table td.label { font-weight: bold; color: #64748b; width: 35%; }
    .info-table td.val { color: #0f172a; font-weight: 600; }
    .message-box { background: #f8fafc; border-left: 4px solid #0070f3; padding: 15px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 25px; }
    .cta-box { text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
    .btn { display: inline-block; background: #0070f3; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; margin: 5px; }
    .btn-wa { background: #25d366; }
    .footer { background: #07192f; color: #94a3b8; font-size: 12px; text-align: center; padding: 15px; }
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h1>GROUP PRESTIGE SERVICES SRL</h1>
      <p>Demande reçue via le site officiel groupprestiges.be</p>
    </div>
    <div class='content'>
      <span class='badge'>Origine : " . htmlspecialchars($source) . "</span>
      
      <table class='info-table'>
        <tr>
          <td class='label'>Nom complet :</td>
          <td class='val'>" . htmlspecialchars($name) . "</td>
        </tr>
        <tr>
          <td class='label'>Téléphone :</td>
          <td class='val'><a href='tel:" . urlencode($phone) . "'>" . htmlspecialchars($phone) . "</a></td>
        </tr>
        <tr>
          <td class='label'>Adresse Email :</td>
          <td class='val'>" . (!empty($email) ? "<a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a>" : "Non renseigné") . "</td>
        </tr>
        <tr>
          <td class='label'>Prestation :</td>
          <td class='val'><strong>" . htmlspecialchars($service) . "</strong></td>
        </tr>";

if (!empty($surface)) {
    $html_content .= "
        <tr>
          <td class='label'>Surface estimée :</td>
          <td class='val'>" . htmlspecialchars($surface) . " m²</td>
        </tr>";
}

if (!empty($frequency)) {
    $html_content .= "
        <tr>
          <td class='label'>Fréquence souhaitée :</td>
          <td class='val'>" . htmlspecialchars($frequency) . "</td>
        </tr>";
}

if (!empty($commune)) {
    $html_content .= "
        <tr>
          <td class='label'>Commune / Ville :</td>
          <td class='val'>" . htmlspecialchars($commune) . "</td>
        </tr>";
}

$html_content .= "
      </table>";

if (!empty($message)) {
    $html_content .= "
      <p style='font-size: 13px; font-weight: bold; color: #64748b; margin-bottom: 6px;'>Message / Précisions du client :</p>
      <div class='message-box'>
        " . nl2br(htmlspecialchars($message)) . "
      </div>";
}

$clean_phone = preg_replace('/[^0-9+]/', '', $phone);
$html_content .= "
      <div class='cta-box'>
        <a href='tel:" . htmlspecialchars($clean_phone) . "' class='btn'>📞 Appeler le client</a>
        " . (!empty($clean_phone) ? "<a href='https://wa.me/" . ltrim($clean_phone, '+') . "' class='btn btn-wa'>💬 Échanger sur WhatsApp</a>" : "") . "
        " . (!empty($email) ? "<a href='mailto:" . htmlspecialchars($email) . "?subject=" . urlencode("Group Prestige Services - Votre demande de devis") . "' class='btn'>✉️ Répondre par Email</a>" : "") . "
      </div>
    </div>
    <div class='footer'>
      GROUP PRESTIGE SERVICES SRL &bull; BCE BE 1035.365.627 &bull; Rue du Ruisseau, 4430 Ans
    </div>
  </div>
</body>
</html>";

// 6. En-têtes SMTP conformes One.com
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';
// One.com exige que le From soit du même domaine que l'hébergement
$headers[] = 'From: GROUP PRESTIGE SERVICES <info@groupprestiges.be>';

// Le Reply-To permet à Samir de répondre directement au client en 1 clic
if (!empty($email)) {
    $headers[] = "Reply-To: {$name} <{$email}>";
}

$headers[] = 'X-Mailer: PHP/' . phpversion();

// 7. Envoi de l'email
$sent = @mail($to_email, '=?UTF-8?B?' . base64_encode($subject) . '?=', $html_content, implode("\r\n", $headers));

if ($sent) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Votre demande a bien été envoyée à Samir CHIHAB. Nous vous répondrons dans les plus brefs délais.'
    ]);
} else {
    // Si la fonction mail() locale échoue (ex: test sur machine locale sans serveur SMTP)
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Erreur technique lors de l\'envoi direct. Veuillez utiliser WhatsApp au +32 492 96 99 96 ou nous écrire à info@groupprestiges.be.'
    ]);
}

