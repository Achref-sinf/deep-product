// Configuration du produit
const PRODUCT = {
    name: "Montre Élégante Classique",
    price: 15000, // Prix en DA
    deliveryHome: 200, // Frais de livraison à domicile
    deliveryOffice: 0 // Frais de livraison au bureau
};

// Liste des 58 wilayas algériennes
const WILAYAS = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna",
    "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
    "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou",
    "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
    "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine",
    "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
    "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès",
    "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
    "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma",
    "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
    "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt",
    "Djanet", "El M'Ghair", "El Menia"
];

// Variables globales
let totalPrice = PRODUCT.price;
let currentDeliveryCost = PRODUCT.deliveryHome;
let orderReference = generateOrderReference();

// Initialisation lorsque la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    initWilayasDropdown();
    initEventListeners();
    updateTotalPrice();
});

// Remplir le dropdown des wilayas
function initWilayasDropdown() {
    const wilayaSelect = document.getElementById('wilaya');
    
    // Trier les wilayas par ordre alphabétique
    WILAYAS.sort();
    
    // Ajouter chaque wilaya comme option
    WILAYAS.forEach(wilaya => {
        const option = document.createElement('option');
        option.value = wilaya;
        option.textContent = wilaya;
        wilayaSelect.appendChild(option);
    });
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
    // Changement de quantité
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    
    quantityInput.addEventListener('input', updateTotalPrice);
    quantityInput.addEventListener('change', updateTotalPrice);
    
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
            updateTotalPrice();
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
        updateTotalPrice();
    });
    
    // Changement du type de livraison
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    deliveryOptions.forEach(option => {
        option.addEventListener('change', updateTotalPrice);
    });
    
    // Soumission du formulaire
    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', handleFormSubmit);
    
    // Gestion du modal
    const closeModalBtns = document.querySelectorAll('.close-modal, .btn-close-modal');
    const successModal = document.getElementById('success-modal');
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
    });
    
    // Fermer le modal en cliquant à l'extérieur
    window.addEventListener('click', (event) => {
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
    });
}

// Mettre à jour le prix total
function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const unitPrice = PRODUCT.price;
    
    // Vérifier le type de livraison sélectionné
    const deliveryType = document.querySelector('input[name="delivery"]:checked').value;
    
    // Déterminer les frais de livraison
    if (deliveryType === "Livraison à domicile") {
        currentDeliveryCost = PRODUCT.deliveryHome;
    } else {
        currentDeliveryCost = PRODUCT.deliveryOffice;
    }
    
    // Calculer le prix total
    totalPrice = (unitPrice * quantity) + currentDeliveryCost;
    
    // Mettre à jour l'affichage
    document.getElementById('total-price').textContent = formatPrice(totalPrice);
    
    // Mettre à jour la décomposition du prix
    const priceBreakdown = `Montre: ${formatPrice(unitPrice * quantity)} DA, Livraison: ${formatPrice(currentDeliveryCost)} DA`;
    document.getElementById('price-breakdown').textContent = priceBreakdown;
}

// Formater le prix (séparateur de milliers)
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Générer une référence de commande unique
function generateOrderReference() {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CMD-${timestamp}${randomNum}`;
}

// Valider le formulaire
function validateForm(formData) {
    let isValid = true;
    
    // Réinitialiser les messages d'erreur
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    // Valider le nom
    if (!formData.name || formData.name.trim().length < 3) {
        document.getElementById('name-error').textContent = 'Veuillez entrer un nom complet (minimum 3 caractères)';
        isValid = false;
    }
    
    // Valider le téléphone
    const phoneRegex = /^(05|06|07)\d{8}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone)) {
        document.getElementById('phone-error').textContent = 'Veuillez entrer un numéro de téléphone algérien valide (ex: 0550123456)';
        isValid = false;
    }
    
    // Valider la wilaya
    if (!formData.wilaya) {
        document.getElementById('wilaya-error').textContent = 'Veuillez sélectionner votre wilaya';
        isValid = false;
    }
    
    // Valider l'adresse
    if (!formData.address || formData.address.trim().length < 10) {
        document.getElementById('address-error').textContent = 'Veuillez entrer une adresse complète (minimum 10 caractères)';
        isValid = false;
    }
    
    // Valider la quantité
    if (!formData.quantity || formData.quantity < 1) {
        document.getElementById('quantity-error').textContent = 'La quantité doit être au moins 1';
        isValid = false;
    }
    
    return isValid;
}

// Gérer la soumission du formulaire
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Récupérer les données du formulaire
    const formData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        wilaya: document.getElementById('wilaya').value,
        address: document.getElementById('address').value.trim(),
        delivery: document.querySelector('input[name="delivery"]:checked').value,
        quantity: parseInt(document.getElementById('quantity').value),
        totalPrice: totalPrice,
        product: PRODUCT.name,
        orderDate: new Date().toLocaleString('fr-FR'),
        orderReference: orderReference
    };
    
    // Valider le formulaire
    if (!validateForm(formData)) {
        return;
    }
    
    // Désactiver le bouton de soumission
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    
    try {
        // Envoyer les données à Google Sheets (via Google Apps Script)
        await sendToGoogleSheets(formData);
        
        // Afficher le modal de confirmation
        document.getElementById('order-ref').textContent = orderReference;
        document.getElementById('success-modal').style.display = 'flex';
        
        // Réinitialiser le formulaire après un délai
        setTimeout(() => {
            document.getElementById('order-form').reset();
            document.getElementById('quantity').value = 1;
            updateTotalPrice();
            
            // Générer une nouvelle référence pour la prochaine commande
            orderReference = generateOrderReference();
        }, 3000);
        
    } catch (error) {
        alert('Une erreur est survenue lors de l\'envoi de votre commande. Veuillez réessayer ou nous contacter par téléphone.');
        console.error('Erreur d\'envoi:', error);
    } finally {
        // Réactiver le bouton de soumission
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Commander maintenant';
    }
}

// ============================================================================
// INTÉGRATION GOOGLE SHEETS - GOOGLE APPS SCRIPT
// ============================================================================

/*
INSTRUCTIONS POUR CONFIGURER GOOGLE SHEETS:

1. Créez une nouvelle feuille Google Sheets:
   - Allez sur https://sheets.google.com
   - Créez une nouvelle feuille de calcul
   - Nommez-la "Commandes Montre Élégante"

2. Ajoutez les en-têtes de colonnes (première ligne):
   Date, Référence, Nom, Téléphone, Wilaya, Adresse, Livraison, Quantité, Produit, Prix Total

3. Créez le script Google Apps Script:
   - Dans le menu, cliquez sur "Extensions" > "Apps Script"
   - Supprimez tout le code existant et collez le code ci-dessous
   - Enregistrez le projet (donnez-lui un nom comme "TraitementCommandes")

4. Déployez le script en tant qu'application web:
   - Cliquez sur "Déployer" > "Nouveau déploiement"
   - Choisissez "Type de déploiement" > "Application Web"
   - Donnez une description (ex: "API de commandes")
   - Exécutez en tant que: "Moi"
   - Qui a accès: "Tout le monde" (si vous voulez que n'importe qui puisse soumettre des commandes)
   - Cliquez sur "Déployer"
   - Autorisez l'accès lorsque demandé
   - Copiez l'URL de l'application web générée (elle ressemble à: https://script.google.com/macros/s/.../exec)

5. Configurez votre site web avec l'URL:
   - Remplacez 'VOTRE_URL_APPS_SCRIPT' dans la fonction sendToGoogleSheets() ci-dessous
   - Utilisez l'URL que vous avez copiée à l'étape précédente

CODE GOOGLE APPS SCRIPT À COLLER DANS L'ÉDITEUR:

function doPost(e) {
  try {
    // Récupérer les données envoyées
    const data = JSON.parse(e.postData.contents);
    
    // Ouvrir la feuille de calcul
    const sheet = SpreadsheetApp.openById('VOTRE_ID_FEUILLE').getActiveSheet();
    
    // Préparer les données à ajouter
    const rowData = [
      data.orderDate,
      data.orderReference,
      data.name,
      data.phone,
      data.wilaya,
      data.address,
      data.delivery,
      data.quantity,
      data.product,
      data.totalPrice
    ];
    
    // Ajouter la nouvelle ligne
    sheet.appendRow(rowData);
    
    // Retourner une réponse de succès
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "Commande enregistrée" }))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // En cas d'erreur, retourner un message d'erreur
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

REMARQUE: Remplacez 'VOTRE_ID_FEUILLE' par l'ID de votre feuille Google Sheets.
Pour trouver l'ID: regardez l'URL de votre feuille - c'est la longue chaîne de caractères entre "/d/" et "/edit".
Exemple: https://docs.google.com/spreadsheets/d/ABC123XYZ/edit#gid=0 → l'ID est "ABC123XYZ"
*/

// Fonction pour envoyer les données à Google Sheets
async function sendToGoogleSheets(formData) {
    // REMPLACEZ CETTE URL PAR L'URL DE VOTRE APPLICATION WEB APPS SCRIPT
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxhtIC9yJg_ymu50X8hUvPknAVYSQsunbwdYXbmTjc5mVUs3M-_QqMM1nr7uYlSBFx7/exec';
    
    const response = await fetch(scriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (!result.success) {
        throw new Error(result.error || 'Erreur inconnue');
    }
    
    return result;
}

// Fonction de démonstration pour le développement (à utiliser si vous n'avez pas configuré Google Sheets)
async function sendToGoogleSheetsDemo(formData) {
    console.log('Données de commande à envoyer à Google Sheets:', formData);
    
    // Simulation d'un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Pour le développement, vous pouvez simuler une réponse réussie
    // En production, remplacez cette fonction par la vraie fonction sendToGoogleSheets
    return { success: true, message: "Commande enregistrée (mode démo)" };
}

// Pour utiliser la version démo pendant le développement, remplacez l'appel à sendToGoogleSheets

// par sendToGoogleSheetsDemo dans la fonction handleFormSubmit

