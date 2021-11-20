import React, { useMemo, useEffect, useRef } from 'react';
import crc16ccitt from 'crc/crc16ccitt';
import Container from 'components/Container';
import QRComponent from 'qrcode.react';
import { numberWithCommas, round } from 'utilities/Number';
import vietQRIcon from 'assets/images/vietqr.png';
import napasIcon from 'assets/images/napas.png';
import mbIcon from 'assets/images/mb_horizontal_icon.png';

import './style.scss';

function QRCode({ onClose, total, selectedAccount, invoiceCode }) {
    const timeout = useRef(null);

    const content = useMemo(() => {
        const roundTotal = round(total);
        //
        const payloadFormatIndicator = '000201';
        //
        const pointOfInitiationMethod = '010212';

        const GUID = '0010A000000727';
        const infoOrganization = `000697042201${selectedAccount.accID.length}${selectedAccount.accID}`;
        const organizationPay = `01${infoOrganization.length}${infoOrganization}`;
        const serviceCode = '0208QRIBFTTA';
        const prevMerchantAccountInformatio = `${GUID}${organizationPay}${serviceCode}`;
        //
        const merchantAccountInformation = `38${prevMerchantAccountInformatio.length}${prevMerchantAccountInformatio}`;

        //
        const transactionCurrency = '5303704';
        //
        const transactionAmount = `54${
            roundTotal.length < 10 ? `0${roundTotal.length}` : roundTotal.length
        }${roundTotal}`;
        //
        const countryCode = '5802VN';

        // const contentTransaction = `${selectedAccount.accID} thanh toan don hang`;
        const contentTransaction = `Thanh toan hoa don ma ${invoiceCode}`;
        const purposeOfTransaction = `08${contentTransaction.length}${contentTransaction}`;
        //
        const additionalDataFieldTemplate = `62${purposeOfTransaction.length}${purposeOfTransaction}`;

        const prevData = `${payloadFormatIndicator}${pointOfInitiationMethod}${merchantAccountInformation}${transactionCurrency}${transactionAmount}${countryCode}${additionalDataFieldTemplate}6304`;

        const CRC = crc16ccitt(prevData).toString(16);

        return `${prevData}${CRC}`;
    }, [total, selectedAccount.accID, invoiceCode]);

    useEffect(() => {
        timeout.current = setTimeout(() => {
            onClose();
        }, 300000);
        return () => {
            clearTimeout(timeout.current);
        };
    }, []);

    return (
        <Container className="open-screen">
            <div className="qrcode">
                <div className="qrcode_code flex flex-col items-center">
                    <img className="vietqr" src={vietQRIcon} alt="" />
                    <div className="content-code">
                        <QRComponent
                            value={content}
                            size={180}
                            bgColor={'#ffffff'}
                            fgColor={'#000000'}
                            level={'L'}
                            includeMargin={false}
                            renderAs={'svg'}
                        />
                    </div>
                    <div className="flex justify-between items-center content-icons">
                        <img src={napasIcon} alt="" className="napas-icon" />
                        <img src={mbIcon} alt="" className="mb-icon" />
                    </div>
                    <div className="qrcode_account">
                        STK: {selectedAccount.accID}
                    </div>
                </div>
                <div className="qrcode_invoice">
                    <p className="label">Mã hóa đơn</p>
                    <p className="invoice_code">{invoiceCode}</p>
                </div>
                <div className="qrcode_payment">
                    <p className="money">Số tiền</p>
                    <p className="amount">{numberWithCommas(round(total))}</p>
                    <p className="unit">VNĐ</p>
                </div>
                <div className="qrcode_button_home" onClick={onClose}>
                    Về trang chủ
                </div>
            </div>
        </Container>
    );
}

export default QRCode;
