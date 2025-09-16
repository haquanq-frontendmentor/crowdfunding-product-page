export type Pledge = {
    name: string;
    description: string;
    minPledgeAmount: number;
    inStock: number;
    hasReward: boolean;
};

export const pledges: Pledge[] = [
    {
        name: "Pledge with no reward",
        description:
            "Choose to support us without a reward if you simply believe in our project. As a backer, you will be signed up to receive product updates via email",
        minPledgeAmount: 0,
        inStock: 0,
        hasReward: false,
    },
    {
        name: "Bamboo Stand",
        description:
            "You get an ergonomic stand made of natural bamboo. You've helped us launch our promotional campaign, and you’ll be added to a special Backer member list.",
        minPledgeAmount: 25,
        inStock: 101,
        hasReward: true,
    },
    {
        name: "Black Edition Stand",
        description:
            "You get a Black Special Edition computer stand and a personal thank you. You'll be added to our Backer member list. Shipping is included.",
        minPledgeAmount: 75,
        inStock: 64,
        hasReward: true,
    },
    {
        name: "Mahogany Special Edition",
        description:
            "You get a Black Special Edition computer stand and a personal thank you. You'll be added to our Backer member list. Shipping is included.",
        minPledgeAmount: 200,
        inStock: 0,
        hasReward: true,
    },
];
