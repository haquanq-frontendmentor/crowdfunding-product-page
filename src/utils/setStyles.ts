export const setStyles = (element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void => {
    for (const [key, value] of Object.entries(styles)) {
        if (value !== undefined && value !== null) {
            // @ts-expect-error: index signature not strict in CSSStyleDeclaration
            element.style[key] = value;
        }
    }
};
