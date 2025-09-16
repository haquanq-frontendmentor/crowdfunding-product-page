import { createFocusTrap } from "../helpers/createFocusTrap";

export const setupMobileMenu = () => {
    const mobileMenuButton = document.querySelector(".nav__menu-btn") as HTMLButtonElement;
    const mobileMenu = document.querySelector(".nav__menu") as HTMLElement;
    const mobileMenuList = document.querySelector(".nav__list") as HTMLElement;

    const isMobileMenuOpened = () => mobileMenuButton.getAttribute("aria-expanded") === "true";

    let focusTrapDestroyer: null | (() => void) = null;

    const openMobileMenu = () => {
        document.body.style.overflow = "hidden";
        mobileMenuButton.setAttribute("aria-expanded", "true");
        mobileMenu.setAttribute("tabIndex", "-1");
        mobileMenu.focus();

        focusTrapDestroyer = createFocusTrap(mobileMenuList);
    };

    const closeMobileMenu = () => {
        document.body.removeAttribute("style");
        mobileMenuButton.setAttribute("aria-expanded", "false");
        mobileMenu.removeAttribute("tabIndex");
        if (focusTrapDestroyer) focusTrapDestroyer();
    };

    mobileMenuButton.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isMobileMenuOpened()) closeMobileMenu();
        else openMobileMenu();
    });

    mobileMenuList.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    mobileMenu.addEventListener("click", () => {
        closeMobileMenu();
    });

    mobileMenu.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMobileMenu();
    });

    window.addEventListener("resize", () => {
        const mediaQuery = window.matchMedia("(min-width: 48em)");
        if (mediaQuery.matches && isMobileMenuOpened()) closeMobileMenu();
    });
};
