import { pledges } from "../data";
import { createModal } from "../helpers/createModal";
import { setStyles, removeStyles, formatPrice } from "../utils";
import { setupSuccessModal } from "./setupSuccessModal";

const successModal = setupSuccessModal();

export const setupPledgeModal = () => {
    const backProjectButton = document.querySelector(".intro__pledge-btn") as HTMLButtonElement;
    const pledgeModal = document.querySelector(".pledge-modal") as HTMLElement;
    const pledgeModalContainer = document.querySelector(".pledge-modal__content") as HTMLElement;
    const pledgeModalCloseButton = document.querySelector(".pledge-modal__close-btn") as HTMLElement;
    const pledgeForm = document.querySelector(".pledge-form") as HTMLElement;
    const pledgeOptionList = document.querySelector(".pledge-options__list") as HTMLElement;
    const pledgeOptionTemplate = pledgeOptionList.querySelector("& > template") as HTMLTemplateElement;
    pledgeOptionTemplate.remove();

    let currentPledgeOptionIndex = -1;

    const pledgeModalController = createModal({
        wrapper: pledgeModal,
        container: pledgeModalContainer,
    });

    const pledgeOptions: Array<{
        item: HTMLElement;
        title: HTMLElement;
        subtitle: HTMLElement;
        description: HTMLElement;
        stock: HTMLElement;
        stockCount: HTMLElement;
        actionDrawer: HTMLElement;
        radioInput: HTMLInputElement;
        amountInput: HTMLInputElement;
        amountInputLabel: HTMLElement;
        amountInputHint: HTMLElement;
        requestingFrameId: number;
        animating: boolean;
    }> = [];

    pledges.forEach((pledge, index) => {
        const cloned = pledgeOptionTemplate.content.cloneNode(true) as HTMLElement;

        pledgeOptions.push({
            item: cloned.querySelector(".pledge-options__item") as HTMLElement,
            title: cloned.querySelector(".pledge-options__label--main") as HTMLElement,
            subtitle: cloned.querySelector(".pledge-options__label--sub") as HTMLElement,
            description: cloned.querySelector(".pledge-options__description") as HTMLElement,
            stock: cloned.querySelector(".pledge-options__stock") as HTMLElement,
            stockCount: cloned.querySelector(".pledge-options__stock--count") as HTMLElement,
            actionDrawer: cloned.querySelector(".pledge-options__action") as HTMLElement,
            radioInput: cloned.querySelector(".pledge-options__radio-input") as HTMLInputElement,
            amountInput: cloned.querySelector(".pledge-options__input") as HTMLInputElement,
            amountInputLabel: cloned.querySelector(".pledge-options__input-label--main") as HTMLElement,
            amountInputHint: cloned.querySelector(".pledge-options__input-label--hint") as HTMLElement,
            requestingFrameId: -1,
            animating: false,
        });

        const pledgeOption = pledgeOptions[index];

        pledgeOption.title.textContent = pledge.name;
        pledgeOption.subtitle.textContent = `Pledge ${formatPrice(pledge.minPledgeAmount)} or more`;
        pledgeOption.description.textContent = pledge.description;
        pledgeOption.stockCount.textContent = pledge.inStock.toString();

        pledgeOption.radioInput.name = "pledge-options";

        if (pledge.hasReward && pledge.inStock === 0) {
            pledgeOption.item.setAttribute("out-stock", "");
            pledgeOption.radioInput.disabled = true;
        }

        if (pledge.hasReward === false) {
            pledgeOption.stock.remove();
            pledgeOption.subtitle.remove();
        }

        const amountInputId = `pledge-input-id-${index}`;
        const amountInputHintId = `pledge-input-hint-id-${index}`;

        pledgeOption.amountInput.addEventListener("input", (e) => {
            const input = e.target as HTMLInputElement;
            input.value = input.value.replaceAll(/[^0-9]/g, "");
        });

        pledgeOption.amountInputLabel.setAttribute("for", amountInputId);
        pledgeOption.amountInput.id = amountInputId;
        pledgeOption.amountInput.setAttribute("aria-describedby", amountInputHintId);
        pledgeOption.amountInputHint.id = amountInputHintId;

        pledgeOptionList.appendChild(pledgeOption.item);
    });

    pledgeModalController.subscribe("close", () => {
        closeActionDrawer(currentPledgeOptionIndex, true);
        currentPledgeOptionIndex = -1;
    });

    backProjectButton.addEventListener("click", () => {
        pledgeModalController.openModal();
        openActionDrawer(0, true);
    });

    document.querySelectorAll(".pledge-intro__select-btn").forEach((element, index) => {
        element.addEventListener("click", () => {
            pledgeModalController.openModal();
            openActionDrawer(index + 1, true);
        });
    });

    pledgeModalCloseButton.addEventListener("click", () => {
        pledgeModalController.closeModal();
    });

    pledgeOptions.forEach(({ radioInput }, index) => {
        radioInput.addEventListener("change", () => {
            if (radioInput.checked) {
                openActionDrawer(index);
            }
        });
    });

    pledgeForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const { minPledgeAmount } = pledges[currentPledgeOptionIndex];
        const { amountInput } = pledgeOptions[currentPledgeOptionIndex];

        if (amountInput.value == "") {
            showPledgeAmountInputError(currentPledgeOptionIndex, "Can't be empty");
            return;
        } else if (parseFloat(amountInput.value) < minPledgeAmount) {
            showPledgeAmountInputError(currentPledgeOptionIndex, `Must be at least ${formatPrice(minPledgeAmount)}`);
            return;
        }

        resetPledgeAmountInput(currentPledgeOptionIndex);

        pledgeModalController.closeModal();
        successModal.openModal();
    });

    const cancelActionDrawerAnimation = (pledgeOptionIndex: number) => {
        const pledgeOption = pledgeOptions[pledgeOptionIndex];
        cancelAnimationFrame(pledgeOption.requestingFrameId);
        pledgeOption.requestingFrameId = -1;
    };

    const openActionDrawer = (pledgeOptionIndex: number, noAnimate: boolean = false) => {
        const pledgeOption = pledgeOptions[pledgeOptionIndex];
        pledgeOption.item.setAttribute("user-selected", "");
        pledgeOption.radioInput.checked = true;
        pledgeOption.radioInput.focus();
        pledgeOption.amountInput.disabled = false;
        pledgeOption.item.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });

        const finishOpening = () => {
            removeStyles(pledgeOption.actionDrawer);
            pledgeOption.requestingFrameId = -1;
            pledgeOption.animating = false;
        };

        if (currentPledgeOptionIndex !== -1) {
            closeActionDrawer(currentPledgeOptionIndex, noAnimate);
        }

        currentPledgeOptionIndex = pledgeOptionIndex;

        pledgeOption.actionDrawer.removeAttribute("hidden");

        if (noAnimate) {
            return finishOpening();
        }

        const currentHeight = pledgeOption.actionDrawer.clientHeight;
        setStyles(pledgeOption.actionDrawer, {
            height: "auto",
        });
        const targetHeight = pledgeOption.actionDrawer.clientHeight;

        if (pledgeOption.animating) {
            cancelActionDrawerAnimation(pledgeOptionIndex);
            setStyles(pledgeOption.actionDrawer, {
                height: `${currentHeight}px`,
            });
        } else {
            setStyles(pledgeOption.actionDrawer, {
                height: "0",
            });
        }

        pledgeOption.animating = true;

        requestAnimationFrame(() => {
            setStyles(pledgeOption.actionDrawer, {
                transition: "height 400ms ease",
                height: `${targetHeight}px`,
            });

            let startTime: null | number = null;
            const cleanUp = (currentTime: number) => {
                if (startTime === null) startTime = currentTime;

                if (currentTime - startTime >= 400) {
                    finishOpening();
                } else {
                    pledgeOption.requestingFrameId = requestAnimationFrame(cleanUp);
                }
            };

            pledgeOption.requestingFrameId = requestAnimationFrame(cleanUp);
        });
    };

    const closeActionDrawer = (pledgeOptionIndex: number, noAnimate = false) => {
        const pledgeOption = pledgeOptions[pledgeOptionIndex];
        pledgeOption.radioInput.checked = false;
        pledgeOption.amountInput.disabled = true;
        pledgeOption.item.removeAttribute("user-selected");
        resetPledgeAmountInput(pledgeOptionIndex);

        const finishClosing = () => {
            pledgeOption.actionDrawer.setAttribute("hidden", "");
            pledgeOption.animating = false;
            removeStyles(pledgeOption.actionDrawer);
        };

        if (noAnimate) {
            return finishClosing();
        }

        if (pledgeOption.requestingFrameId !== -1) {
            cancelAnimationFrame(pledgeOption.requestingFrameId);
            pledgeOption.requestingFrameId = -1;
        }

        pledgeOption.animating = true;

        setStyles(pledgeOption.actionDrawer, {
            height: `${pledgeOption.actionDrawer.clientHeight}px`,
            transition: "height 400ms ease",
        });

        requestAnimationFrame(() => {
            setStyles(pledgeOption.actionDrawer, {
                height: "0",
            });

            let startTime: null | number = null;
            const cleanUp = (currentTime: number) => {
                if (startTime === null) startTime = currentTime;

                if (currentTime - startTime >= 400) {
                    finishClosing();
                } else {
                    pledgeOption.requestingFrameId = requestAnimationFrame(cleanUp);
                }
            };

            pledgeOption.requestingFrameId = requestAnimationFrame(cleanUp);
        });
    };

    const showPledgeAmountInputError = (pledgeOptionIndex: number, message: string) => {
        const pledgeOption = pledgeOptions[pledgeOptionIndex];
        pledgeOption.amountInput.setAttribute("aria-invalid", "true");
        pledgeOption.amountInputHint.textContent = message;

        setStyles(pledgeOption.amountInputLabel, {
            opacity: "0",
            position: "absolute",
        });
    };

    const clearPledgeAmountInputError = (pledgeOptionIndex: number) => {
        const pledgeOption = pledgeOptions[pledgeOptionIndex];
        pledgeOption.amountInput.setAttribute("aria-invalid", "false");
        pledgeOption.amountInputHint.textContent = "";
        removeStyles(pledgeOption.amountInputLabel);
    };

    const resetPledgeAmountInput = (pledgeOptionIndex: number) => {
        clearPledgeAmountInputError(pledgeOptionIndex);
        pledgeOptions[pledgeOptionIndex].amountInput.value = "";
    };
};
