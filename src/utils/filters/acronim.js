export default function acronim(value) {
    if (!value || value === 'null null') {
        return '';
    }
    const words = value.split(' ');
    const secondtLetter = x => {
        if (x && x[1]) {
            return x[1].toLowerCase();
        }
        return '';
    };
    const firsttLetter = x => {
        if (x && x[0]) {
            return x[0].toUpperCase();
        }
        return '';
    };
    if (words[0] && !words[1]) {
        const acr = firsttLetter(words[0]) + secondtLetter(words[0]);
        return acr;
    }
    let acr = '';
    acr = value
        .split(' ')
        .map(firsttLetter)
        .join('');
    return acr.slice(0, 3);
}
