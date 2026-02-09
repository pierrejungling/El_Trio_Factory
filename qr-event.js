const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

const eventCards = document.querySelectorAll(".event-card");
const eventForms = document.querySelectorAll(".event-form");

const setActiveEvent = (target) => {
    eventCards.forEach((card) => {
        card.classList.toggle("active", card.dataset.target === target);
    });
    eventForms.forEach((form) => {
        form.classList.toggle("active", form.dataset.event === target);
    });
};

const updateConditionalFields = (form) => {
    const toggles = form.querySelectorAll("[data-toggle]");
    toggles.forEach((toggle) => {
        const target = toggle.dataset.toggle;
        const inputTarget = form.querySelector(`[data-toggle-target="${target}"]`);
        if (!inputTarget) return;
        if (toggle.checked && toggle.value === "Oui") {
            inputTarget.classList.remove("hidden");
        } else if (toggle.checked && toggle.value === "Non") {
            inputTarget.classList.add("hidden");
            const inputs = inputTarget.querySelectorAll("input, textarea, select");
            inputs.forEach((input) => {
                if (input.type === "radio" || input.type === "checkbox") {
                    input.checked = false;
                } else {
                    input.value = "";
                }
            });
        }
    });
};

const updateFormulaSelection = (form) => {
    const cards = form.querySelectorAll(".formula-card");
    cards.forEach((card) => {
        const input = card.querySelector('input[type="radio"]');
        card.classList.toggle("selected", Boolean(input && input.checked));
    });
};

const markRequiredFields = (form) => {
    const requiredFields = form.querySelectorAll("input[required], select[required], textarea[required]");
    requiredFields.forEach((input) => {
        const container = input.closest(".field, .question-row");
        if (container) {
            container.classList.add("is-required");
        }
    });
};

const clearFieldError = (container) => {
    if (!container) return;
    container.classList.remove("has-error");
    const error = container.querySelector(".field-error");
    if (error) error.remove();
};

const setFieldError = (container, message) => {
    if (!container) return;
    container.classList.add("has-error");
    if (container.querySelector(".field-error")) return;
    const error = document.createElement("span");
    error.className = "field-error";
    error.textContent = message;
    container.appendChild(error);
};

const isContainerValid = (container) => {
    const inputs = container.querySelectorAll("input, textarea, select");
    return Array.from(inputs).every((input) => input.checkValidity());
};

const popup = document.getElementById("info-popup");
const popupTitle = popup?.querySelector(".popup-title");
const popupImage = popup?.querySelector(".popup-image");
const popupText = popup?.querySelector(".popup-text");
const popupClose = popup?.querySelector(".popup-close");
const infoButtons = document.querySelectorAll(".info-button");

const openPopup = (title, text, imageSrc, htmlContent) => {
    if (!popup || !popupTitle || !popupText) return;
    popupTitle.textContent = title;
    if (htmlContent) {
        popupText.innerHTML = htmlContent;
    } else {
        popupText.textContent = text;
    }
    if (popupImage) {
        if (imageSrc) {
            popupImage.src = imageSrc;
            popupImage.alt = title || "Illustration";
            popupImage.classList.remove("hidden");
        } else {
            popupImage.src = "";
            popupImage.alt = "";
            popupImage.classList.add("hidden");
        }
    }
    popup.classList.add("active");
    popup.setAttribute("aria-hidden", "false");
};

const closePopup = () => {
    if (!popup) return;
    popup.classList.remove("active");
    popup.setAttribute("aria-hidden", "true");
};

infoButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openPopup(
            button.dataset.popupTitle || "Info",
            button.dataset.popupText || "",
            button.dataset.popupImage || "",
            button.dataset.popupHtml || ""
        );
    });
});

popupClose?.addEventListener("click", closePopup);
popup?.addEventListener("click", (event) => {
    if (event.target === popup) {
        closePopup();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closePopup();
    }
});

eventCards.forEach((card) => {
    card.addEventListener("click", () => {
        setActiveEvent(card.dataset.target);
    });
});

eventForms.forEach((form) => {
    form.addEventListener("change", () => {
        updateConditionalFields(form);
        updateFormulaSelection(form);
    });
    updateConditionalFields(form);
    updateFormulaSelection(form);
    markRequiredFields(form);

    form.addEventListener("input", (event) => {
        const container = event.target.closest(".field, .question-row");
        if (!container) return;
        if (isContainerValid(container)) {
            clearFieldError(container);
        }
    });

    form.addEventListener("change", (event) => {
        const container = event.target.closest(".field, .question-row");
        if (!container) return;
        if (isContainerValid(container)) {
            clearFieldError(container);
        }
    });
});

document.addEventListener("click", (event) => {
    const toggle = event.target.closest(".toggle-pill");
    if (!toggle) return;
    if (event.target.closest("label") || event.target.matches("input")) return;

    const radios = Array.from(toggle.querySelectorAll('input[type="radio"]'));
    if (radios.length !== 2) return;

    const checkedIndex = radios.findIndex((radio) => radio.checked);
    const nextIndex = checkedIndex === 0 ? 1 : 0;
    const targetIndex = checkedIndex === -1 ? 0 : nextIndex;

    radios[targetIndex].checked = true;
    radios[targetIndex].dispatchEvent(new Event("change", { bubbles: true }));
});

if (window.emailjs) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

const handleSubmit = (form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        form.querySelectorAll(".field, .question-row").forEach((container) => {
            clearFieldError(container);
        });

        if (!form.checkValidity()) {
            const invalidInputs = Array.from(form.querySelectorAll("input, textarea, select")).filter(
                (input) => !input.checkValidity()
            );
            const uniqueContainers = new Set(
                invalidInputs
                    .map((input) => input.closest(".field, .question-row"))
                    .filter(Boolean)
            );
            uniqueContainers.forEach((container) => {
                setFieldError(container, "Veuillez compléter ce champ.");
            });
            form.reportValidity();
            return;
        }

        const confirmSend = window.confirm("Confirmer l'envoi de ce formulaire ?");
        if (!confirmSend) {
            return;
        }

        const status = form.querySelector(".status");
        if (!status) return;

        status.className = "status";
        status.textContent = "Envoi en cours...";
        status.style.display = "block";

        if (!window.emailjs || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
            status.classList.add("error");
            status.textContent = "Veuillez configurer EmailJS avant l'envoi.";
            return;
        }

        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
            .then(() => {
                status.classList.add("success");
                status.textContent = "Merci ! Votre demande a bien été envoyée.";
                form.reset();
                updateConditionalFields(form);
            })
            .catch(() => {
                status.classList.add("error");
                status.textContent = "Une erreur est survenue. Merci de réessayer.";
            });
    });
};

eventForms.forEach((form) => {
    if (form.id !== "form-mariage") {
        handleSubmit(form);
    }
});
