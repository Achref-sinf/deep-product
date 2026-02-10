// Configuration du produit// =======================================================const PRODUCT = {// =======================================================
// Configuration du produit
// =======================================================
const PRODUCT = {
    name: "Montre Élégante Classique",
    price: 15000, // Prix en DA
    deliveryHome: 300, // Frais de livraison à domicile
    deliveryOffice: 0 // Livraison au bureau gratuite
};

// Liste des 58 wilayas
const WILAYAS = [
    "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna",
    "Béjaïa","Biskra","Béchar","Blida","Bouira",
    "Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou",
    "Alger","Djelfa","Jijel","Sétif","Saïda",
    "Skikda","Sidi Bel Abbès","Annaba","Guelma","Constantine",
    "Médéa","Mostaganem","M'Sila","Mascara","Ouargla",
    "Oran","El Bayadh","Illizi","Bordj Bou Arréridj","Boumerdès",
    "El Tarf","Tindouf","Tissemsilt","El Oued","Khenchela",
    "Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma",
    "Aïn Témouchent","Ghardaïa","Relizane","Timimoun","Bordj Badji Mokhtar",
    "Ouled Djellal","Béni Abbès","In Salah","In Guezzam","Touggourt",
    "Djanet","El M'Ghair","El Menia"
];

// Variables globales
let totalPrice = PRODUCT.price;
let currentDeliveryCost = PRODUCT.deliveryHome;
let orderReference = generateOrderReference();

// =======================================================
// Initialisation après chargement du DOM
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    initWilayasDropdown();
    initEventListeners();
    updateTotalPrice();
});

// =======================================================
// Remplir le dropdown des wilayas
// =======================================================
function initWilayasDropdown() {
    const wilayaSelect = document.getElementById('wilaya');
    WILAYAS.sort().forEach(wilaya => {
        const option = document.createElement('option');
        option.value = wilaya;
        option.textContent = wilaya;
        wilayaSelect.appendChild(option);
    });
}

// =======================================================
// Gestion des événements
// =======================================================
function initEventListeners() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-qty');
    const increaseBtn = document.getElementById('increase-qty');
    const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
    const orderForm = document.getElementById('order-form');
    const closeModalBtns = document.querySelectorAll('.close-modal, .btn-close-modal');
    const successModal = document.getElementById('success-modal');

    decreaseBtn.addEventListener('click', () => {
        let val = parseInt(quantityInput.value);
        if (val > 1) quantityInput.value = val - 1;
        updateTotalPrice();
    });
    increaseBtn.addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
        updateTotalPrice();
    });
    quantityInput.addEventListener('input', updateTotalPrice);
    quantityInput.addEventListener('change', updateTotalPrice);

    deliveryOptions.forEach(opt => opt.addEventListener('change', updateTotalPrice));

    orderForm.addEventListener('submit', handleFormSubmit);

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target === successModal) successModal.style.display = 'none';
    });
}

// =======================================================
// Calcul du prix total
// =======================================================
function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const deliveryType = document.querySelector('input[name="delivery"]:checked').value;
    currentDeliveryCost = (deliveryType === "Livraison à domicile") ? PRODUCT.deliveryHome : PRODUCT.deliveryOffice;
    totalPrice = (PRODUCT.price * quantity) + currentDeliveryCost;

    document.getElementById('total-price').textContent = formatPrice(totalPrice) + " DA";
    document.getElementById('price-breakdown').textContent = `Montre: ${formatPrice(PRODUCT.price * quantity)} DA, Livraison: ${formatPrice(currentDeliveryCost)} DA`;
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// =======================================================
// Génération de référence unique
// =======================================================
function generateOrderReference() {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CMD-${timestamp}${randomNum}`;
}

// =======================================================
// Validation du formulaire
// =======================================================
function validateForm(data) {
    let isValid = true;
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    if (!data.name || data.name.trim().length < 3) {
        document.getElementById('name-error').textContent = 'Nom invalide';
        isValid = false;
    }
    if (!data.phone || !/^(05|06|07)\d{8}$/.test(data.phone)) {
        document.getElementById('phone-error').textContent = 'Téléphone invalide';
        isValid = false;
    }
    if (!data.wilaya) {
        document.getElementById('wilaya-error').textContent = 'Sélectionnez votre wilaya';
        isValid = false;
    }
    if (!data.address || data.address.trim().length < 10) {
        document.getElementById('address-error').textContent = 'Adresse invalide';
        isValid = false;
    }
    if (!data.quantity || data.quantity < 1) {
        document.getElementById('quantity-error').textContent = 'Quantité invalide';
        isValid = false;
    }
    return isValid;
}

// =======================================================
// Soumission du formulaire
// =======================================================
async function handleFormSubmit(e) {
    e.preventDefault();

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

    if (!validateForm(formData)) return;

    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

    try {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxhtIC9yJg_ymu50X8hUvPknAVYSQsunbwdYXbmTjc5M-_QqMM1nr7uYlSBFx7/exec'; // ← ton Apps Script
        const response = await fetch(scriptURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (!result.success) throw new Error(result.error || "Erreur inconnue");

        document.getElementById('order-ref').textContent = orderReference;
        document.getElementById('success-modal').style.display = 'flex';

        setTimeout(() => {
            document.getElementById('order-form').reset();
            document.getElementById('quantity').value = 1;
            updateTotalPrice();
            orderReference = generateOrderReference();
        }, 3000);

    } catch (err) {
        alert("Une erreur est survenue lors de l'envoi. Vérifiez la console pour détails.");
        console.error("Erreur d'envoi:", err);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Commander maintenant';
    }
}


