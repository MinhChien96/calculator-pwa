import Big from 'big.js';
import operate from './operate';
import { isNumber } from 'utilities/Number';

Big.NE = -200;
Big.PE = 200;
Big.DP = 200;

export const isOperation = (string) => {
    const arr = ['+', '-', 'x', '/'];
    return arr.includes(string);
};

export default function calculate(obj, buttonName) {
    //clear
    if (
        buttonName === 'C' ||
        (obj.expression.length === 0 &&
            (buttonName === '+' ||
                buttonName === '-' ||
                buttonName === 'x' ||
                buttonName === '/' ||
                buttonName === 'Del' ||
                buttonName === '000' ||
                buttonName === 'Del' ||
                buttonName === '=' ||
                buttonName === '%'))
    ) {
        return {
            total: '0',
            expression: ['0'],
        };
    }

    const expression = [...obj.expression];
    const lastExpression = expression[expression.length - 1];

    // number
    if (isNumber(buttonName)) {
        // first number
        if (expression.length === 0) {
            expression.push(buttonName);
            return {
                total: buttonName,
                expression,
            };
        }

        if (lastExpression) {
            if (isOperation(lastExpression)) expression.push(buttonName);
            else {
                expression.pop();
                expression.push(
                    `${
                        lastExpression === '0' ? '' : lastExpression
                    }${buttonName}`,
                );
            }
        }
    }

    if (buttonName === '.') {
        if (lastExpression) {
            if (isOperation(lastExpression) || lastExpression.includes('.'))
                return obj;

            expression.pop();
            expression.push(`${lastExpression}${buttonName}`);
        } else {
            expression.push('0.');
            return { ...obj, expression };
        }
    }

    //Big(result).div(Big('100')).toString(),
    // operate(obj.total, obj.next, obj.operation);

    if (
        buttonName === '/' ||
        buttonName === 'x' ||
        buttonName === '+' ||
        buttonName === '-'
    ) {
        if (lastExpression) {
            if (isOperation(lastExpression)) {
                expression.pop();
                expression.push(buttonName);
                return {
                    ...obj,
                    expression,
                };
            }
            expression.push(buttonName);
        }
    }

    if (buttonName === '000') {
        if (lastExpression) {
            if (isOperation(lastExpression)) {
                return obj;
            }
            expression.pop();

            expression.push(Big(lastExpression).times(Big('1000')).toString());
        }
    }

    if (buttonName === '%') {
        if (lastExpression) {
            if (isOperation(lastExpression)) {
                return obj;
            }
            expression.pop();
            expression.push(Big(lastExpression).div(Big('100')).toString());
        }
    }

    if (buttonName === 'Del') {
        if (lastExpression) {
            const el = expression.pop();
            if (isOperation(el)) {
                return {
                    ...obj,
                    expression,
                };
            } else {
                const newNum = el.slice(0, -1);
                if (newNum) {
                    expression.push(newNum);
                } else if (expression.length === 0) expression.push('0');
            }
        }
    }

    if (buttonName === '=') {
        return {
            ...obj,
            expression: [obj.total],
        };
    }

    return {
        expression,
        total: execute(expression),
    };
}

const execute = (expression = []) => {
    const sumExpression = [];
    let total = 0;

    for (let index = 0; index < expression.length; index++) {
        const element = expression[index];
        if (
            (element === '/' || element === 'x') &&
            index < expression.length - 1
        ) {
            let result = 0;
            const prev = sumExpression.pop();
            const next = expression[++index];
            result = operate(prev, next, element);
            sumExpression.push(result);
        } else sumExpression.push(element);
    }

    total = sumExpression[0];
    for (let index = 1; index < sumExpression.length; index++) {
        const element = sumExpression[index];
        if (
            (element === '+' || element === '-') &&
            index < sumExpression.length - 1
        ) {
            const next = sumExpression[++index];
            total = operate(total, next, element);
        }
    }

    return Big(total).round(3, Big.roundHalfUp).toString();
};

export const checkDivZero = (expression = []) => {
    let hasDivZero = false;
    expression.forEach((item, index) => {
        if (
            item === '/' &&
            index < expression.length - 1 &&
            Big(expression[index + 1]).toString() === '0'
        ) {
            hasDivZero = true;
        }
    });
    return hasDivZero;
};
