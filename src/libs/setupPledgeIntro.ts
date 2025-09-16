import { Pledge, pledges } from "../data";
import { formatPrice } from "../utils";

export const setupPledgeIntro = () => {
    const pledgeIntroList = document.querySelector(".pledge-intro__list") as HTMLElement;

    const pledgeIntroItemTemplate = pledgeIntroList.querySelector("& > template") as HTMLTemplateElement;
    pledgeIntroItemTemplate.remove();

    const createPledgeIntroItem = (pledge: Pledge) => {
        const cloned = pledgeIntroItemTemplate.content.cloneNode(true) as HTMLElement;

        const item = cloned.querySelector(".pledge-intro__item") as HTMLElement;
        const title = cloned.querySelector(".pledge-intro__item-title--main") as HTMLElement;
        const subtitle = cloned.querySelector(".pledge-intro__item-title--sub") as HTMLElement;
        const description = cloned.querySelector(".pledge-intro__item-description") as HTMLElement;
        const stockCount = cloned.querySelector(".pledge-intro__stock--count") as HTMLElement;
        const selectButton = cloned.querySelector(".pledge-intro__select-btn") as HTMLButtonElement;

        title.textContent = pledge.name;
        subtitle.textContent = `Pledge ${formatPrice(pledge.minPledgeAmount)} or more`;
        description.textContent = pledge.description;
        stockCount.textContent = pledge.inStock.toString();

        if (pledge.inStock === 0) {
            item.setAttribute("out-stock", "");
            selectButton.disabled = true;
        }

        pledgeIntroList.appendChild(item);
    };

    pledges.slice(1, 4).forEach((pledge) => {
        createPledgeIntroItem(pledge);
    });
};
