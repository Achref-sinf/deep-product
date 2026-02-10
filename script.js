// Configuration du produit// =======================================================
// CONFIGURATION DU PRODUIT
// =======================================================
const PRODUCT = {
    name: "Montre Élégante Classique",
    price: 15000, // Prix en DA
    deliveryHome: 200, // Frais de livraison à domicile
    deliveryOffice: 0 // Frais de livraison au bureau
};

// Liste des wilayas
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

// =======================================================
// VARIABLES GLOBALES
// =======================================================
let totalPrice = PRODUCT.price;
let currentDeliveryCost = PRODUCT.deliveryHome;
let orderReference = generateOrderReference();

// =======================================================
// INITIALISATION AU CHARGEMENT DE LA PAGE
// =======================================================
document.addEventListener('DOMContentLoaded', () => {
    initWilayasDropdown();
    initEventListeners();
    updateTotalPrice();
});

// =======================================================
// DROPDOWN WILAYAS
// =======================================================
function initWilayasDropdown() {
    const wilayaSelect = document.getElementById('wilaya');
    WILAYAS.sort();
    WILAYAS.forEach(w => {
        const option = document.createElement('option');
        option.value = w;
        option.textContent = w;
        wilayaSelect.appendChild(option);
    });
}

// =======================================================
// LISTENERS
// =======================================================
function initEventListeners() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    
    quantityInput.addEventListener('input', updateTotalPrice);
    decreaseBtn.addEventListener('click', () => {
        let val = parseInt(quantityInput.value);
        if (val > 1) { quantityInput.value = val - 1; updateTotalPrice(); }
    });
    increaseBtn.addEventListener('click', () => {
        let val = parseInt(quantityInput.value);
        quantityInput.value = val + 1; updateTotalPrice();
    });

    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    deliveryOptions.forEach(opt => opt.addEventListener('change', updateTotalPrice));

    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', handleFormSubmit);

    const closeModalBtns = document.querySelectorAll('.close-modal, .btn-close-modal');
    const successModal = document.getElementById('success-modal');
    closeModalBtns.forEach(btn => btn.addEventListener('click', () => { successModal.style.display = 'none'; }));
    window.addEventListener('click', e => { if (e.target === successModal) successModal.style.display = 'none'; });
}

// =======================================================
// CALCUL PRIX TOTAL
// =======================================================
function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const unitPrice = PRODUCT.price;
    const deliveryType = document.querySelector('input[name="delivery"]:checked').value;
    currentDeliveryCost = deliveryType === "Livraison à domicile" ? PRODUCT.deliveryHome : PRODUCT.deliveryOffice;
    totalPrice = (unitPrice * quantity) + currentDeliveryCost;
    document.getElementById('total-price').textContent = formatPrice(totalPrice) + " DA";
    document.getElementById('price-breakdown').textContent = `Montre: ${formatPrice(unitPrice*quantity)} DA, Livraison: ${formatPrice(currentDeliveryCost)} DA`;
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// =======================================================
// GENERER REFERENCE
// =======================================================
function generateOrderReference() {
    const ts = Date.now().toString().slice(-6);
    const rnd = Math.floor(Math.random()*1000).toString().padStart(3,"0");
    return `CMD-${ts}${rnd}`;
}

// =======================================================
// VALIDATION FORMULAIRE
// =======================================================
function validateForm(data) {
    let isValid = true;
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    if (!data.name || data.name.trim().length<3) { document.getElementById('name-error').textContent='Nom invalide'; isValid=false; }
    const phoneRegex = /^(05|06|07)\d{8}$/;
    if (!data.phone || !phoneRegex.test(data.phone)) { document.getElementById('phone-error').textContent='Téléphone invalide'; isValid=false; }
    if (!data.wilaya) { document.getElementById('wilaya-error').textContent='Sélectionnez votre wilaya'; isValid=false; }
    if (!data.address || data.address.trim().length<10) { document.getElementById('address-error').textContent='Adresse trop courte'; isValid=false; }
    if (!data.quantity || data.quantity<1) { document.getElementById('quantity-error').textContent='Quantité invalide'; isValid=false; }

    return isValid;
}

// =======================================================
// ENVOI FORMULAIRE
// =======================================================
async function handleFormSubmit(event) {
    event.preventDefault();
    const formData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        wilaya: document.getElementById('wilaya').value,
        address: document.getElementById('address').value.trim(),
        delivery: document.querySelector('input[name="delivery"]:checked').value,
        quantity: parseInt(document.getElementById('quantity').value),
        totalPrice: totalPrice,
        product: PRODUCT.name,
        orderDate: new Date().toISOString(),
        orderReference: orderReference
    };

    if (!validateForm(formData)) return;

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

    try {
        await sendToGoogleSheets(formData);
        document.getElementById('order-ref').textContent = orderReference;
        document.getElementById('success-modal').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('order-form').reset();
            document.getElementById('quantity').value = 1;
            updateTotalPrice();
            orderReference = generateOrderReference();
        }, 3000);

    } catch (error) {
        console.error('Erreur d\'envoi:', error);
        alert('Une erreur est survenue lors de l\'envoi. Vérifiez la console pour détails.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Commander maintenant';
    }
}

// =======================================================
// FONCTION GOOGLE SHEETS
// =======================================================
async function sendToGoogleSheets(formData) {
    // Remplacez par votre URL de déploiement Web App
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxhtIC9yJg_ymu50X8hUvPknAVYSQsunbwdYXbmTjc5mVUs3M-_QqMM1nr7uYlSBFx7/exec';

    const response = await fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Erreur inconnue');
    return result;
}


