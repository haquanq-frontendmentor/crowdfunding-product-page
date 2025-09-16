import { createModal } from "../helpers/createModal";

export const setupSuccessModal = () => {
    const successModal = document.querySelector(".success-modal") as HTMLElement;
    const successModalContainer = document.querySelector(".success-modal__container") as HTMLElement;
    const successModalCloseButton = document.querySelector(".success-modal__close-btn") as HTMLButtonElement;

    const modal = createModal({
        wrapper: successModal,
        container: successModalContainer,
    });

    successModalCloseButton.addEventListener("click", () => {
        modal.closeModal();
    });

    modal.subscribe("open", (container) => {
        container.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    });

    return {
        closeModal: modal.closeModal,
        openModal: modal.openModal,
    };
};
