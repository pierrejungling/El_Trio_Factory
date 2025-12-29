document.addEventListener('DOMContentLoaded', () => {
    const orderPopup = document.getElementById('orderPopup');
    const orderForm = document.getElementById('orderForm');
    const closeBtn = document.querySelector('.order-popup-close');
    const commanderButtons = document.querySelectorAll('.btn-commander');
    const quantityInput = document.getElementById('orderQuantity');
    const quantityDecrease = document.getElementById('quantityDecrease');
    const quantityIncrease = document.getElementById('quantityIncrease');

    // Ouvrir le popup de commande
    commanderButtons.forEach(button => {
        button.addEventListener('click', () => {
            const product = button.getAttribute('data-product');
            const price = button.getAttribute('data-price');
            const category = button.getAttribute('data-category');
            
            document.getElementById('orderProduct').value = product;
            orderPopup.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Fermer le popup
    closeBtn.addEventListener('click', () => {
        orderPopup.classList.remove('active');
        document.body.style.overflow = '';
        orderForm.reset();
    });

    // Fermer en cliquant en dehors
    orderPopup.addEventListener('click', (e) => {
        if (e.target === orderPopup) {
            orderPopup.classList.remove('active');
            document.body.style.overflow = '';
            orderForm.reset();
        }
    });

    // Gestion de la quantité
    quantityDecrease.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    quantityIncrease.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });

    // Soumission du formulaire
    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = orderForm.querySelector('.order-form-submit');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours...';

        const formData = new FormData(orderForm);

        try {
            const response = await fetch('send-order.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                alert('Votre commande a été envoyée avec succès ! Nous vous contacterons bientôt.');
                orderPopup.classList.remove('active');
                document.body.style.overflow = '';
                orderForm.reset();
            } else {
                throw new Error(result.message || 'Erreur lors de l\'envoi de la commande');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert(error.message || 'Une erreur est survenue lors de l\'envoi de la commande. Veuillez réessayer.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
});

