import { createFocusTrap } from "./createFocusTrap";

type ModalProps<T extends HTMLElement> = {
    wrapper: T;
    container: T;
};

type ModalEventType = "open" | "close";

type ModalEventListener<T extends HTMLElement> = (wrapper: T) => void;

type ModalEventListenerRegistry<T extends HTMLElement> = Record<ModalEventType, Array<ModalEventListener<T>>>;

type Modal<T extends HTMLElement> = {
    openModal: () => void;
    closeModal: () => void;
    subscribe: (type: ModalEventType, callback: ModalEventListener<T>) => () => void;
};

export const createModal = <T extends HTMLElement>(props: ModalProps<T>): Modal<T> => {
    const listenerRegistry: ModalEventListenerRegistry<T> = {
        open: [],
        close: [],
    };

    props.container.setAttribute("tabIndex", "-1");

    props.container.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    const handleClickOutside = () => {
        closeModal();
    };

    const handlePressEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeModal();
    };

    let focusTrapDestroyer: () => void;

    const openModal = () => {
        document.body.style.overflow = "hidden";
        props.wrapper.setAttribute("data-open", "true");
        props.wrapper.addEventListener("keydown", handlePressEscape);
        props.wrapper.addEventListener("click", handleClickOutside);
        props.container.focus();
        listenerRegistry.open.forEach((fn) => fn(props.wrapper));
        focusTrapDestroyer = createFocusTrap(props.container);
    };

    const closeModal = () => {
        document.body.style = "";
        props.wrapper.setAttribute("data-open", "false");
        props.wrapper.removeEventListener("keydown", handlePressEscape);
        props.wrapper.removeEventListener("click", handleClickOutside);
        listenerRegistry.close.forEach((fn) => fn(props.wrapper));
        focusTrapDestroyer();
    };

    const subscribe = (type: ModalEventType, callback: (wrapper: T) => void) => {
        listenerRegistry[type].push(callback);
        return () => {
            listenerRegistry[type] = [];
        };
    };

    return { openModal, closeModal, subscribe };
};
