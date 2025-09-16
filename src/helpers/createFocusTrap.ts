import { focusableSelector } from "../constants/focusableSelector";

export const createFocusTrap = (container: HTMLElement) => {
    let focusableElements: HTMLElement[] = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));
    let firstFocusable: HTMLElement | null = focusableElements.at(0) || null;
    let lastFocusable: HTMLElement | null = focusableElements.at(-1) || null;

    firstFocusable?.focus();

    const handleKeydown = (event: KeyboardEvent) => {
        if (event.key !== "Tab") return;

        if (focusableElements.length === 1) {
            event.preventDefault();
            return;
        }

        if (event.shiftKey && document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable?.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable?.focus();
        }
    };

    container.addEventListener("keydown", handleKeydown);
    return () => {
        container.removeEventListener("keydown", handleKeydown);
    };
};
