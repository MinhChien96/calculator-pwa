import Big from 'big.js';

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function isNumber(item) {
    return /[0-9]+/.test(item);
}

export function round(number) {
    return Big(number).round().toString();
}
