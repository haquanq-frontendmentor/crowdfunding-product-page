export const removeStyles = (element: HTMLElement, ...props: string[]): void => {
    if (props.length === 0) {
        element.removeAttribute("style");
        return;
    }
    for (const prop of props) {
        element.style.removeProperty(prop);
    }
};
