// Données des produits
const products = [
    {
        id: 'el-trio-des-bermudes',
        name: 'EL TRIO DES BERMUDES',
        category: 'Rum',
        price: '50,00€',
        description: 'Rum aux saveurs épicées de vanille et cannelle, issu de cannes mauriciennes et finalisé en Belgique.',
        image: 'assets/images/products/rum-bottle.JPG',
        images: ['assets/images/products/rum-bottle.JPG'],
        features: [
            'Rum d\'origine mauricienne',
            'Saveurs épicées de vanille et cannelle',
            'Finalisé en Belgique',
            'Produit artisanal'
        ]
    },
    {
        id: 'liquor-cannelle',
        name: 'LIQUOR CANNELLE',
        category: 'Liqueur',
        price: '25,00€',
        description: 'Liqueur de caractère au goût authentique de cannelle, à l\'origine de la création d\'El Trio Factory.',
        image: 'assets/images/products/liqueur-bottle.jpg',
        images: ['assets/images/products/liqueur-bottle.jpg'],
        features: [
            'Goût authentique de cannelle',
            'À l\'origine d\'El Trio Factory',
            'Produit artisanal',
            'Parfait pour vos soirées'
        ]
    },
    {
        id: 'the-spiced-gin',
        name: 'THE SPICED GIN',
        category: 'Gin',
        price: '35,00€',
        description: 'Gin unique aux saveurs de piment et vanille, créé avec passion et expertise.',
        image: 'assets/images/products/gin-bottle.jpg',
        images: ['assets/images/products/gin-bottle.jpg'],
        features: [
            'Saveurs de piment et vanille',
            'Gin artisanal',
            'Créé avec passion',
            'Produit unique'
        ]
    },
    {
        id: 'coffret-degustation',
        name: 'COFFRET DÉGUSTATION EL TRIO FACTORY',
        category: 'Coffret',
        price: '49,00€',
        description: 'Offrez ou offrez-vous un voyage gustatif unique avec notre coffret dégustation. Ce pack élégant comprend notre Rum, Liqueur, Gin et une fiole de poivre long de Java.',
        image: 'assets/images/products/coffret-degustation-1.jpg',
        images: [
            'assets/images/products/coffret-degustation-1.jpg',
            'assets/images/products/coffret-degustation-2.jpg'
        ],
        features: [
            'Rum El Trio des Bermudes',
            'Liqueur Liquor Cannelle',
            'Gin The Spiced Gin',
            'Fiole de poivre long de Java',
            'Coffret élégant et soigné'
        ]
    },
    {
        id: 'pack-el-trio',
        name: 'LE PACK EL TRIO',
        category: 'Pack',
        price: '100,00€',
        description: 'Vous pourrez commencer avec un Gin aux saveurs de vanille et de piment, ensuite continuer avec une Liqueur aux notes de cannelle et terminer avec un Rum qui vous fera voyager entre l\'île Maurice et la Belgique.',
        image: 'assets/images/products/pack-el-trio.jpg',
        images: ['assets/images/products/pack-el-trio.jpg'],
        features: [
            'Gin The Spiced Gin',
            'Liqueur Liquor Cannelle',
            'Rum El Trio des Bermudes',
            'Pack complet des trois produits',
            'Voyage gustatif unique'
        ]
    }
];

// Fonction pour mettre à jour l'URL
function updateURL(productId = null) {
    const url = new URL(window.location);
    if (productId) {
        url.searchParams.set('product', productId);
    } else {
        url.searchParams.delete('product');
    }
    window.history.pushState({}, '', url);
}

// Fonction pour obtenir l'ID du produit depuis l'URL
function getProductFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('product');
}

// Fonction pour créer le popup d'un produit
function createProductPopup(product) {
    const popup = document.createElement('div');
    popup.className = 'product-popup';
    
    const imageSource = product.images ? product.images[0] : product.image;
    const hasMultipleImages = product.images && product.images.length > 1;
    
    popup.innerHTML = `
        <div class="popup-content">
            <button class="close-popup">&times;</button>
            <div class="popup-gallery">
                <div class="popup-image-container">
                    <img src="${imageSource}" alt="${product.name}" class="popup-main-image">
                    ${hasMultipleImages ? `
                    <button class="popup-nav prev">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>
                    <button class="popup-nav next">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                    ` : ''}
                </div>
                ${hasMultipleImages ? `
                <div class="popup-thumbnails">
                    ${product.images.map((img, index) => `
                         <img src="${img}" 
                              alt="${product.name} - Image ${index + 1}" 
                              class="popup-thumbnail ${index === 0 ? 'active' : ''}"
                              data-index="${index}">
                    `).join('')}
                </div>
                ` : ''}
            </div>
            <div class="popup-info">
                <h2>${product.name}</h2>
                <div class="popup-price">${product.price}</div>
                <div class="popup-description">${product.description}</div>
                ${product.features ? `
                <div class="popup-features">
                    <h3>Caractéristiques :</h3>
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                <button class="btn btn-primary btn-popup-commander" data-product="${product.name}" data-price="${product.price}" data-category="${product.category}">Commander</button>
            </div>
        </div>
    `;

    // Fonction pour fermer le popup et mettre à jour l'URL
    const closePopupAndUpdateURL = () => {
        popup.classList.remove('active');
        updateURL();
        setTimeout(() => {
            popup.remove();
            document.body.classList.remove('popup-open');
            document.body.style.overflow = '';
        }, 300);
    };

    // Gestion de la fermeture
    const closeButton = popup.querySelector('.close-popup');
    closeButton.addEventListener('click', closePopupAndUpdateURL);
    
    // Fermer en cliquant en dehors
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopupAndUpdateURL();
        }
    });

    // Gestion du bouton Commander
    const orderButton = popup.querySelector('.btn-popup-commander');
    orderButton.addEventListener('click', (e) => {
        e.stopPropagation();
        popup.remove();
        document.body.classList.remove('popup-open');
        document.body.style.overflow = '';
        updateURL();
        
        // Ouvrir le popup de commande
        const orderPopup = document.getElementById('orderPopup');
        const productName = orderButton.getAttribute('data-product');
        document.getElementById('orderProduct').value = productName;
        orderPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Gestion des images multiples
    if (hasMultipleImages) {
        const mainImage = popup.querySelector('.popup-main-image');
        const thumbnails = popup.querySelectorAll('.popup-thumbnail');
        const prevButton = popup.querySelector('.popup-nav.prev');
        const nextButton = popup.querySelector('.popup-nav.next');
        let currentImageIndex = 0;

        function updateImage(index) {
            mainImage.src = product.images[index];
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            thumbnails[index].classList.add('active');
            currentImageIndex = index;
        }
        
        prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
            updateImage(currentImageIndex);
        });

        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex + 1) % product.images.length;
            updateImage(currentImageIndex);
        });

        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', (e) => {
                e.stopPropagation();
                updateImage(index);
            });
        });

        // Gestion du swipe sur mobile
        let touchStartX = 0;
        let touchEndX = 0;
        const imageContainer = popup.querySelector('.popup-image-container');
        
        imageContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        imageContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    currentImageIndex = (currentImageIndex + 1) % product.images.length;
                } else {
                    currentImageIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
                }
                updateImage(currentImageIndex);
            }
        }, { passive: true });
    }
    
    return popup;
}

// Fonction pour ouvrir le popup d'un produit
function openProductPopup(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const popup = createProductPopup(product);
    document.body.appendChild(popup);
    document.body.classList.add('popup-open');
    document.body.style.overflow = 'hidden';
    
    // Animation
    setTimeout(() => {
        popup.classList.add('active');
    }, 10);
    
    // Mettre à jour l'URL
    updateURL(productId);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Rendre les cartes produits cliquables
    const productCards = document.querySelectorAll('.shop-product-card');
    
    productCards.forEach(card => {
        // Trouver le produit correspondant via data-product-id ou le nom
        const productId = card.getAttribute('data-product-id');
        let product = null;
        
        if (productId) {
            product = products.find(p => p.id === productId);
        } else {
            // Fallback : chercher par nom
            const productName = card.querySelector('h4')?.textContent.trim();
            if (productName) {
                product = products.find(p => p.name === productName);
            }
        }
        
        if (product) {
            // Rendre la carte cliquable (sauf les boutons et liens)
            card.addEventListener('click', (e) => {
                // Ne pas déclencher si on clique sur un bouton, un lien, ou la galerie
                if (!e.target.closest('.btn') && 
                    !e.target.closest('a') && 
                    !e.target.closest('.product-gallery') &&
                    !e.target.closest('.product-gallery-nav')) {
                    openProductPopup(product.id);
                }
            });
        }
    });

    // Vérifier s'il y a un produit à afficher depuis l'URL
    const productId = getProductFromURL();
    if (productId) {
        setTimeout(() => {
            openProductPopup(productId);
        }, 100);
    }

    // Gérer le bouton retour du navigateur
    window.addEventListener('popstate', () => {
        const productId = getProductFromURL();
        const existingPopup = document.querySelector('.product-popup');
        
        if (productId && !existingPopup) {
            openProductPopup(productId);
        } else if (!productId && existingPopup) {
            existingPopup.classList.remove('active');
            setTimeout(() => {
                existingPopup.remove();
                document.body.classList.remove('popup-open');
                document.body.style.overflow = '';
            }, 300);
        }
    });
});

