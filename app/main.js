const app = {
    activeComponentStack: [],
    removeFromComponentStack(idx) {
        this.activeComponentStack.splice(idx, 1);
    },
    appendComponentStack(ob) {
        return this.activeComponentStack.push(ob);
    },
    init() {
        document.querySelectorAll(".main__reward__select-btn").forEach((element, index) => {
            element.addEventListener("click", () => {
                pledgeModal.open(index);
            });
        });

        document.querySelector(".intro__action__cta-btn").addEventListener("click", (e) => {
            pledgeModal.open();
        });

        window.addEventListener("keydown", (e) => {
            if (this.activeComponentStack.length == 0) return;
            if (e.key == "Escape") {
                this.activeComponentStack.pop().close();
            }
        });

        window.addEventListener("resize", (e) => {
            const matches = window.matchMedia("(min-width: 48em)").matches;
            if (matches) {
                menuModal.close();
            }
        });
    },
};

const pledgeModal = {
    modalContainer: document.querySelector(".pledge-modal__container"),
    modalClosebtn: document.querySelector(".pledge-modal__close-btn"),

    minPledges: [0, 25, 25, 200],
    pledgeOptions: [],
    pledgeForm: document.querySelector(".pledge__form"),
    pledgeWrapper: document.querySelector(".pledge__wrapper"),
    pledgeSuccessWrapper: document.querySelector(".pledge-success__wrapper"),
    pledgeSuccessDismissBtn: document.querySelector(".pledge-success__dismiss-btn"),

    activePldegeOptionIndex: null,
    activeComponentIndex: null,
    busy: false,

    open(idx) {
        if (this.busy) return;

        this.activeComponentIndex = app.appendComponentStack(this);
        this.activePldegeOptionIndex = null;

        requestAnimationFrame(() => {
            document.querySelector("body").style.overflow = "hidden";
            this.modalContainer.removeAttribute("hidden");

            requestAnimationFrame(() => {
                if (idx !== undefined) {
                    this.pledgeOptions[idx].pledgeRadiobox.focus();
                    this._showPledgeInput(idx, true);
                } else {
                    this.pledgeWrapper.setAttribute("tabindex", "0");
                    this.pledgeWrapper.focus();
                }
            });
        });
    },
    close() {
        app.removeFromComponentStack(this.activeComponentIndex);
        this._dismissSuccessMessage();

        this.pledgeWrapper.removeAttribute("tabindex");

        document.querySelector("body").style.overflow = null;
        this.modalContainer.setAttribute("hidden", "");

        if (this.activePldegeOptionIndex !== null) {
            this._hidePledgeInput(this.activePldegeOptionIndex);
        }
    },

    _showSuccessMessage() {
        this.pledgeWrapper.setAttribute("hidden", "");
        this.pledgeSuccessWrapper.removeAttribute("hidden");
        requestAnimationFrame(() => {
            this.pledgeSuccessWrapper.setAttribute("tabindex", "0");
            this.pledgeSuccessWrapper.focus();
        });
    },

    _dismissSuccessMessage() {
        this.pledgeWrapper.removeAttribute("hidden");
        this.pledgeSuccessWrapper.removeAttribute("tabindex");
        this.pledgeSuccessWrapper.setAttribute("hidden", "");
    },

    _showPledgeError(idx, msg) {
        const { pledgeInput, pledgeInputLabel, pledgeInputHint } = this.pledgeOptions[idx];
        pledgeInput.setAttribute("aria-invalid", "true");
        pledgeInputLabel.style.opacity = "0";
        pledgeInputLabel.style.position = "absolute";
        pledgeInputHint.textContent = msg;
    },

    _hidePledgeError(idx) {
        const { pledgeInput, pledgeInputLabel, pledgeInputHint } = this.pledgeOptions[idx];
        pledgeInput.setAttribute("aria-invalid", "false");
        pledgeInputLabel.style.opacity = "";
        pledgeInputLabel.style.position = "";
        pledgeInputHint.textContent = "";
    },

    _showPledgeInput(idx, noAnimate = false) {
        const { pledgeElement, pledgeRadiobox } = this.pledgeOptions[idx];
        let fromHeight = 0;
        let toHeight = 0;

        pledgeRadiobox.checked = true;

        if (this.activePldegeOptionIndex !== null) {
            this._hidePledgeInput(this.activePldegeOptionIndex, noAnimate);
        }

        this.activePldegeOptionIndex = idx;

        if (noAnimate) {
            pledgeElement.removeAttribute("hidden");
            pledgeElement.setAttribute("data-showing", "");
            pledgeElement.style.transition = "";
            pledgeElement.style.height = ``;
            return;
        }

        this.busy = true;

        pledgeElement.removeAttribute("hidden");
        pledgeElement.setAttribute("data-showing", "");

        fromHeight = pledgeElement.clientHeight;
        pledgeElement.style.height = "auto";
        toHeight = pledgeElement.clientHeight;

        if (this.pledgeOptions[idx].requestingFrameId !== null) {
            cancelAnimationFrame(this.pledgeOptions[idx].requestingFrameId);
            this.pledgeOptions[idx].requestingFrameId = null;
            pledgeElement.style.height = `${fromHeight}px`;
        } else {
            pledgeElement.style.height = "0";
        }

        let startTime = null;
        const cleanUp = (t) => {
            if (!startTime) startTime = t;
            if (t - startTime >= 400) {
                pledgeElement.style.transition = "";
                pledgeElement.style.height = ``;
                this.pledgeOptions[idx].requestingFrameId = null;
                this.busy = false;
                return;
            }
            this.pledgeOptions[idx].requestingFrameId = requestAnimationFrame(cleanUp);
        };
        requestAnimationFrame(() => {
            pledgeElement.style.transition = "height 400ms ease";
            pledgeElement.style.height = `${toHeight}px`;

            this.pledgeOptions[idx].requestingFrameId = requestAnimationFrame(cleanUp);
        });
    },

    _hidePledgeInput(idx, noAnimate = false) {
        const { pledgeElement, pledgeInput, pledgeRadiobox } = this.pledgeOptions[idx];
        pledgeInput.value = "";
        pledgeRadiobox.checked = false;
        this._hidePledgeError(idx);

        if (noAnimate) {
            pledgeElement.setAttribute("hidden", "");
            pledgeElement.style.transition = "";
            pledgeElement.style.height = ``;
            return;
        }

        this.busy = true;

        pledgeElement.removeAttribute("data-showing");

        if (this.pledgeOptions[idx].requestingFrameId !== null) {
            cancelAnimationFrame(this.pledgeOptions[idx].requestingFrameId);
            this.pledgeOptions[idx].requestingFrameId = null;
        }

        pledgeElement.style.height = `${pledgeElement.clientHeight}px`;
        pledgeElement.style.transition = "height 400ms ease";

        let startTime = null;
        const cleanUp = (t) => {
            if (!startTime) startTime = t;
            if (t - startTime >= 400) {
                pledgeElement.setAttribute("hidden", "");
                pledgeElement.style.transition = "";
                pledgeElement.style.height = ``;
                this.pledgeOptions[idx].requestingFrameId = null;
                this.busy = false;
                return;
            }
            this.pledgeOptions[idx].requestingFrameId = requestAnimationFrame(cleanUp);
        };

        requestAnimationFrame(() => {
            pledgeElement.style.height = `0`;
            this.pledgeOptions[idx].requestingFrameId = requestAnimationFrame(cleanUp);
        });
    },
    init() {
        document.querySelectorAll(".pledge__option__item").forEach((pledgeItem, i) => {
            const pledgeRadiobox = pledgeItem.querySelector(".pledge__option__radiobox__input");

            pledgeRadiobox.addEventListener("change", (e) => {
                if (e.target.checked) {
                    this._showPledgeInput(i);
                }
            });

            this.pledgeOptions.push({
                pledgeElement: pledgeItem.querySelector(".pledge__option__action"),
                pledgeRadiobox: pledgeRadiobox,
                pledgeInput: pledgeItem.querySelector(".pledge__option__action__input"),
                pledgeInputLabel: pledgeItem.querySelector(".pledge__option__action__label-main"),
                pledgeInputHint: pledgeItem.querySelector(".pledge__option__action__label-hint"),
                requestingFrameId: null,
            });
        });

        this.modalClosebtn.addEventListener("click", () => {
            this.close();
        });

        this.pledgeForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const activeIdx = this.activePldegeOptionIndex;
            const minPledge = this.minPledges[this.activePldegeOptionIndex];

            if (activeIdx === null) return;

            const { pledgeInput } = this.pledgeOptions[activeIdx];

            if (pledgeInput.value == "") {
                this._showPledgeError(activeIdx, "Can't be empty");
                return;
            } else if (parseFloat(pledgeInput.value) < minPledge) {
                this._showPledgeError(activeIdx, `Must be atleast ${minPledge} dollars`);
                return;
            }

            pledgeInput.value = "";

            this._showSuccessMessage();
        });

        this.pledgeSuccessDismissBtn.addEventListener("click", (e) => {
            this._dismissSuccessMessage();
            this.close();
        });

        this.modalContainer.addEventListener("click", (e) => {
            this.close();
        });
        this.pledgeWrapper.addEventListener("click", (e) => {
            e.stopPropagation();
        });
        this.pledgeSuccessWrapper.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        document.addEventListener("keydown", (e) => {
            const firstElement = this.pledgeWrapper;
            const lastElement = this.modalClosebtn;

            if (document.activeElement === lastElement && !e.shiftKey) {
                event.preventDefault();
                firstElement.focus();
            }

            if (document.activeElement === firstElement && e.shiftKey) {
                event.preventDefault();
                lastElement.focus();
            }
        });
    },
};

const menuModal = {
    modalContainer: document.querySelector(".menu-modal__container"),
    menuWrapper: document.querySelector(".menu-modal__wrapper"),
    menuBtn: document.querySelector("#mobile-menu-btn"),
    activeComponentIndex: null,
    opening: false,

    open() {
        document.querySelector("body").style.overflow = "hidden";
        this.modalContainer.removeAttribute("hidden");
        this.menuBtn.classList.add("opened");
        this.menuWrapper.setAttribute("tabindex", "0");
        this.activeComponentIndex = app.appendComponentStack(this);
        requestAnimationFrame(() => {
            this.menuWrapper.focus();
        });
        this.opening = true;
    },
    close() {
        app.removeFromComponentStack(this.activeComponentIndex);
        document.querySelector("body").style.overflow = "";
        this.menuBtn.classList.remove("opened");
        this.menuWrapper.removeAttribute("tabindex");
        this.modalContainer.setAttribute("hidden", "");
        this.opening = false;
    },

    init() {
        this.menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (this.opening) this.close();
            else this.open();
        });

        this.modalContainer.addEventListener("click", (e) => {
            this.close();
        });
        this.menuWrapper.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        document.addEventListener("keydown", (e) => {
            const firstElement = this.menuWrapper;
            const lastElement = this.menuWrapper.querySelector("li:last-child a");

            if (document.activeElement === lastElement && !e.shiftKey) {
                event.preventDefault();
                firstElement.focus();
            }

            if (document.activeElement === firstElement && e.shiftKey) {
                event.preventDefault();
                lastElement.focus();
            }
        });
    },
};

app.init();
menuModal.init();
pledgeModal.init();
