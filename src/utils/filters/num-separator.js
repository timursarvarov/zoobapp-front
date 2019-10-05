export default function numSeparator(value) {
    if (!value || value === 'null') {
        return '';
    }
    const num = parseFloat(value);
    if (typeof num !== 'number') {
        return value;
    } else {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
}
