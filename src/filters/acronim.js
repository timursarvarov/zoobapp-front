export default function acronim(value) {
    if (!value) { return ''; }
    const words = value.split(' ');
    const firstLetter = (x) => { if (x) { return x[0]; } return ''; };
    const secondtLetter = (x) => { if (x) { return x[0] + x[1]; } return ''; };
    if (words[0] && !words[1]) {
        let acr = '';
        acr = value.split(' ').map(secondtLetter).join('');
        acr = acr.charAt(0).toUpperCase() + acr.charAt(1).toLowerCase();
        return acr;
    }
        let acr = value.split(' ').map(firstLetter).join('');
        if (acr.length > 2) {
            acr = acr.slice(0, 2);
        }
        return acr.toUpperCase();
}
