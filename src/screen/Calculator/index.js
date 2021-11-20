import React from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import mbIcon from 'assets/images/mb_icon.png';
import settingIcon from 'assets/images/setting_icon.png';
import { numberWithCommas } from 'utilities/Number';

import './style.scss';

function Calculator({
    selectedAccount,
    clickHandler,
    calculation,
    onEditAccount,
    onClickGenCode,
    errorGenCode,
    hasSubmitGenCode,
    errorDivZero,
}) {
    const { total, expression } = calculation;
    const handleClick = (buttonName) => {
        clickHandler(buttonName);
    };

    const renderDisplay = () => {
        if (expression.length === 0) return '0';
        else return expression.join(' ');
    };

    return (
        <Container className="open-screen">
            <div className="calculator">
                <div className="calculator_account flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="logo flex justify-center items-center">
                            <img alt="" src={mbIcon} />
                        </div>
                        <div className="user">
                            <p className="user_name">{selectedAccount.name}</p>
                            <p className="user_acc">{selectedAccount.accID}</p>
                        </div>
                    </div>
                    <div className="setting" onClick={onEditAccount}>
                        <img alt="" src={settingIcon} />
                    </div>
                </div>
            </div>
            <div className="calculator_result flex justify-end items-end">
                <p className="result">{numberWithCommas(total)}</p>
                <span className="unit">VNĐ</span>
            </div>
            {errorDivZero && (
                <div className="calculator_error calculator_error--total">
                    {errorDivZero}
                </div>
            )}

            <div></div>
            <div className="calculator_container">
                <div className="display">{renderDisplay()}</div>
                <div className="btns-container">
                    <Button name="C" clickHandler={handleClick} />
                    <Button name="%" clickHandler={handleClick} />
                    <Button name="000" clickHandler={handleClick} />
                    <Button name="Del" clickHandler={handleClick} />
                    <Button name="777" clickHandler={handleClick} />
                    <Button name="8" clickHandler={handleClick} />
                    <Button name="9" clickHandler={handleClick} />
                    <Button name="/" clickHandler={handleClick} />
                    <Button name="4" clickHandler={handleClick} />
                    <Button name="5" clickHandler={handleClick} />
                    <Button name="6" clickHandler={handleClick} />
                    <Button name="x" clickHandler={handleClick} />
                    <Button name="1" clickHandler={handleClick} />
                    <Button name="2" clickHandler={handleClick} />
                    <Button name="3" clickHandler={handleClick} />
                    <Button name="-" clickHandler={handleClick} />
                    <Button name="0" clickHandler={handleClick} />
                    <Button name="." clickHandler={handleClick} />
                    <Button name="=" clickHandler={handleClick} />
                    <Button name="+" clickHandler={handleClick} />
                </div>
            </div>
            {hasSubmitGenCode && errorGenCode && (
                <div className="calculator_error calculator_error--gencode text-center">
                    {errorGenCode}
                </div>
            )}
            <div className="calculator_create" onClick={onClickGenCode}>
                Tạo mã QR
            </div>
        </Container>
    );
}

export default Calculator;
