import React from 'react';
import { numberWithCommas } from 'utilities/Number';

import './style.scss';

function SelectAccount({
    onChangeAccount,
    listAccount,
    selectedAccount,
    onNext,
}) {
    return (
        <div className="select-account open-screen">
            <div className="select-account_title">Chọn số tài khoản nhận</div>
            <div className="account-list">
                {listAccount.map((acc) => (
                    <div
                        key={acc.accID}
                        className="account flex flex-row"
                        onClick={() => onChangeAccount(acc)}
                    >
                        <div className="account_button flex justify-center items-center">
                            {selectedAccount.accID === acc.accID && (
                                <div className="account_button--dot"></div>
                            )}
                        </div>
                        <div className="">
                            <p className="account_name">
                                {acc.accID} / {acc.name}
                            </p>
                            <p className="account_money">
                                {numberWithCommas(acc.accBalance)} VNĐ
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="select-account_button" onClick={onNext}>
                Tiếp tục
            </div>
        </div>
    );
}

export default SelectAccount;
