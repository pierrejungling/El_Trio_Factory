document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');

    // Fonction pour créer et afficher le popup
    function showSuccessPopup() {
        // Supprimer tout popup existant
        const existingPopups = document.querySelectorAll('.popup-overlay');
        existingPopups.forEach(popup => popup.remove());
        
        const popup = document.createElement('div');
        popup.className = 'popup-overlay confirmation-popup';
        
        popup.innerHTML = `
            <div class="popup-content">
                <div class="logo-container">
                    <img src="assets/logo-el-trio-factory.png" alt="Logo El Trio Factory" class="popup-logo" onerror="this.style.display='none';">
                </div>
                <h3 class="popup-title">Merci pour votre message !</h3>
                <p class="popup-message">Nous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais.</p>
                <button class="popup-close">Fermer</button>
            </div>
        `;

        document.body.appendChild(popup);

        // Animation d'entrée
        setTimeout(() => {
            popup.classList.add('active');
        }, 10);

        // Gestionnaire pour fermer le popup
        const closeButton = popup.querySelector('.popup-close');
        const closePopup = () => {
            popup.classList.remove('active');
            setTimeout(() => {
                popup.remove();
            }, 300);
        };

        closeButton.addEventListener('click', closePopup);
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closePopup();
            }
        });
    }

    // Modification du gestionnaire de soumission du formulaire
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        
        // Ajout des fichiers
        const fileInput = document.querySelector('.file-input');
        if (fileInput && fileInput.files.length > 0) {
            Array.from(fileInput.files).forEach((file, index) => {
                formData.append('attachments[]', file);
            });
        }

        try {
            const response = await fetch('send-mail.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                showSuccessPopup();
                contactForm.reset();
                const selectedFiles = document.querySelector('.selected-files');
                if (selectedFiles) {
                    selectedFiles.textContent = '';
                }
            } else {
                throw new Error(result.message || 'Erreur lors de l\'envoi du message');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert(error.message || 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
        }
    });

    const dropZone = document.querySelector('.file-drop-zone');
    const fileInput = document.querySelector('.file-input');
    const selectedFiles = document.querySelector('.selected-files');
    
    if (dropZone && fileInput && selectedFiles) {
        // Empêche la propagation du clic sur la liste des fichiers
        selectedFiles.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // Ouvre le sélecteur de fichiers au clic sur la zone
        dropZone.addEventListener('click', () => {
            // Sauvegarde des fichiers existants
            const existingFiles = Array.from(fileInput.files);
            
            // Création d'un gestionnaire d'événement temporaire pour le changement de fichiers
            const handleFileInputChange = function() {
                // Création d'un objet DataTransfer pour fusionner les fichiers
                const dt = new DataTransfer();
                
                // Ajout des fichiers existants
                existingFiles.forEach(file => {
                    dt.items.add(file);
                });
                
                // Ajout des nouveaux fichiers
                Array.from(fileInput.files).forEach(file => {
                    dt.items.add(file);
                });
                
                // Mise à jour de l'input file avec tous les fichiers
                fileInput.files = dt.files;
                
                // Suppression du gestionnaire d'événement temporaire
                fileInput.removeEventListener('change', handleFileInputChange);
            };
            
            // Ajout du gestionnaire d'événement temporaire
            fileInput.addEventListener('change', handleFileInputChange);
            
            // Ouverture du sélecteur de fichiers
            fileInput.click();
        });

        // Gestion du drag & drop
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            
            // Création d'un objet DataTransfer pour fusionner les fichiers
            const dt = new DataTransfer();
            
            // Ajout des fichiers existants
            if (fileInput.files.length > 0) {
                Array.from(fileInput.files).forEach(file => {
                    dt.items.add(file);
                });
            }
            
            // Ajout des nouveaux fichiers
            Array.from(e.dataTransfer.files).forEach(file => {
                dt.items.add(file);
            });
            
            // Mise à jour de l'input file avec tous les fichiers
            fileInput.files = dt.files;
            updateFileList();
        });

        // Mise à jour de la liste des fichiers
        fileInput.addEventListener('change', updateFileList);

        // Constante pour la taille maximale de fichier (5 Mo)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo en octets
        
        // Créer un élément pour afficher les erreurs
        const errorMessage = document.createElement('p');
        errorMessage.className = 'file-error-message';
        errorMessage.style.color = '#ff4444';
        errorMessage.style.display = 'none';
        dropZone.appendChild(errorMessage);

        function updateFileList() {
            selectedFiles.innerHTML = '';
            errorMessage.style.display = 'none';
            
            if (fileInput.files.length > 0) {
                const fileList = document.createElement('ul');
                fileList.className = 'file-list';
                
                let hasOversizedFiles = false;
                
                Array.from(fileInput.files).forEach((file, index) => {
                    // Vérifier la taille du fichier
                    if (file.size > MAX_FILE_SIZE) {
                        hasOversizedFiles = true;
                    }
                    
                    const fileItem = document.createElement('li');
                    fileItem.className = 'file-item';
                    
                    const fileName = document.createElement('span');
                    fileName.className = 'file-name';
                    fileName.textContent = file.name;
                    
                    // Ajouter une classe pour les fichiers trop volumineux
                    if (file.size > MAX_FILE_SIZE) {
                        fileName.style.color = '#ff4444';
                    }
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'file-remove';
                    removeBtn.innerHTML = '&times;';
                    removeBtn.dataset.index = index;
                    
                    removeBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        removeFile(parseInt(this.dataset.index));
                    });
                    
                    fileItem.appendChild(fileName);
                    fileItem.appendChild(removeBtn);
                    fileList.appendChild(fileItem);
                    
                    // Empêche la propagation du clic sur l'élément de fichier
                    fileItem.addEventListener('click', function(e) {
                        e.stopPropagation();
                    });
                });
                
                selectedFiles.appendChild(fileList);
                
                // Afficher le message d'erreur si des fichiers sont trop volumineux
                if (hasOversizedFiles) {
                    errorMessage.textContent = 'Attention : Certains fichiers dépassent la limite de 5 Mo. Veuillez les supprimer ou les remplacer.';
                    errorMessage.style.display = 'block';
                }
            }
        }
        
        function removeFile(index) {
            const dt = new DataTransfer();
            const files = Array.from(fileInput.files);
            
            files.forEach((file, i) => {
                if (i !== index) {
                    dt.items.add(file);
                }
            });
            
            fileInput.files = dt.files;
            updateFileList();
        }
    }
});

