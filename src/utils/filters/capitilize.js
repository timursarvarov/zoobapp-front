export default function capitalize(value) {
    if (!value) return '';
    const nvalue = value.toString();
    return nvalue.charAt(0).toUpperCase() + nvalue.slice(1);
}
