export const formatNumber = (num: number) => {
    const roundedNum = num.toFixed(2);
    const [whole, decimal] = roundedNum.split('.');
    const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `${formattedWhole}.${decimal}`;
}

export const roundToDecimals = (num: number) => {
    return Number(num.toFixed(2));
};
