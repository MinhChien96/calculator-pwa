import React, { useState, useEffect, useRef } from 'react';
import {
    CALCULATOR_SCREEN,
    HISTORY_SCREEN,
    QRCODE_SCREEN,
    SELECT_ACCOUNT_SCREEN,
} from 'configs/constants';
import { ToastContainer, toast } from 'react-toastify';
import queryString from 'query-string';
import ThemeProvider from 'utilities/ThemeProvider';
import Big from 'big.js';
import SplashScreen from 'components/SplashScreen';
import Loading from 'components/Loading';
import Navigation from 'components/Navigation';
import CalculatorScreen from 'screen/Calculator';
import SelectAccount from 'screen/SelectAccount';
import QRCode from 'screen/QRCode';
import History from 'screen/History';
import Theme from 'components/Theme';
import useGoogleAnalytics from 'hooks/useGoogleAnalytics';
import { ACCOUNT_SELECTED, AUTH_TOKEN } from 'configs/constants';
import calculate, { checkDivZero, isOperation } from 'logic/calculate';
import { round } from 'utilities/Number';
import {
    getListAccount,
    authentication,
    changeAccount,
    createBill,
} from 'services';

import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

function App() {
    const [firstLoading, setFirstLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showChangeTheme, setShowChangeTheme] = useState(false);

    const [listAccount, setListAccount] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(() => {
        const accID = localStorage.getItem(ACCOUNT_SELECTED);
        if (accID) return { accID };
        return {};
    });
    const [screenActive, setScreenActive] = useState(() => {
        const accID = localStorage.getItem(ACCOUNT_SELECTED);
        if (accID) return CALCULATOR_SCREEN;
        return SELECT_ACCOUNT_SCREEN;
    });

    const [calculation, setCalculation] = useState({
        total: '0',
        expression: ['0'],
    });

    const [invoiceCode, setInvoiceCode] = useState('');
    const [errorGenCode, setErrorGenCode] = useState('');
    const [errorDivZero, setErrorDivZero] = useState('');
    const [hasSubmitGenCode, setHasSubmitGenCode] = useState(false);
    const hasClickEqual = useRef(false);

    useGoogleAnalytics(screenActive);

    useEffect(() => {
        fetchInformation();
    }, []);

    useEffect(() => {
        const total = Big(calculation.total);

        if (
            total.toString() === '0' &&
            calculation.expression.length <= 1 &&
            calculation.expression[0].length === 1 &&
            !hasClickEqual.current
        ) {
            setErrorGenCode('Vui lòng nhập số tiền');
        } else if (total.lt(1)) {
            setErrorGenCode('Số tiền nhỏ nhất là 1');
        } else if (round(calculation.total)?.length > 13) {
            setErrorGenCode('Số tiền vượt quá giới hạn cho phép');
        } else setErrorGenCode('');

        if (!checkDivZero(calculation.expression)) {
            setErrorDivZero('');
        }
    }, [calculation]);

    const fetchInformation = async () => {
        try {
            // await getToken();
            // await fetchAccount();
            setFirstLoading(false);
        } catch (error) {
            toast.error('Có lỗi xảy ra, hãy thử lại sau');
        }
    };

    const getToken = async () => {
        if (localStorage.getItem(AUTH_TOKEN))
            localStorage.removeItem(AUTH_TOKEN);

        const { token = '' } = queryString.parse(window.location.search);

        try {
            const res = await authentication(token);
            const calculatorToken = res.data?.mbToken;
            if (calculatorToken) {
                localStorage.setItem(AUTH_TOKEN, calculatorToken);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const fetchAccount = async () => {
        try {
            const res = await getListAccount();

            const { accountList, accountDefault, fullName, customerCif } =
                res.data;

            if (!accountList) throw new Error();

            const accFullInfo = accountList?.map((acc) => ({
                accID: acc,
                name: fullName,
                accBalance: '400000',
                customerCif,
            }));

            const accSave = accFullInfo?.find(
                (acc) => acc.accID === selectedAccount?.accID,
            );

            if (!accSave && accountList.length > 1) {
                localStorage.removeItem(ACCOUNT_SELECTED);
                setScreenActive(SELECT_ACCOUNT_SCREEN);
            } else {
                localStorage.setItem(ACCOUNT_SELECTED, accountDefault);
                setScreenActive(CALCULATOR_SCREEN);
            }

            setListAccount(accFullInfo || []);
            setSelectedAccount({
                accID: accountDefault,
                name: fullName,
                accBalance: '400000',
                customerCif,
            });
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const saveAccountSelected = async (account) => {
        try {
            const { accID, customerCif } = account;
            const params = { account: accID, customerCif };
            await changeAccount(params);
        } catch (error) {
            toast.error('Có lỗi xảy ra, hãy thử lại sau');
        }
    };

    const addBill = async () => {
        try {
            setLoading(true);
            const params = {
                money: round(calculation.total),
            };
            const res = await createBill(params);
            const { code } = res.data;
            setInvoiceCode(code);
            setScreenActive(QRCODE_SCREEN);
        } catch (error) {
            toast.error('Có lỗi xảy ra, hãy thử lại sau');
        } finally {
            setLoading(false);
        }
    };

    const handleClick = (buttonName) => {
        setHasSubmitGenCode(false);

        if (buttonName === '=' && calculation.expression.length > 1) {
            hasClickEqual.current = true;
        } else hasClickEqual.current = false;

        if (
            (isOperation(buttonName) || buttonName === '=') &&
            checkDivZero(calculation.expression)
        ) {
            setErrorDivZero('Không thể thực hiện phép tính chia cho 0');
            return;
        } else {
            setErrorDivZero('');
        }

        setCalculation(calculate(calculation, buttonName));
    };

    const handleSelectAccount = (account) => {
        saveAccountSelected(account);
        setSelectedAccount(account);
        // localStorage.setItem(ACCOUNT_SELECTED, account.accID);
    };

    const gotoCalculatorScreen = () => {
        setScreenActive(CALCULATOR_SCREEN);
        localStorage.setItem(ACCOUNT_SELECTED, selectedAccount.accID);
    };

    const handleEditAccount = () => {
        setScreenActive(SELECT_ACCOUNT_SCREEN);
    };

    const handleGenCode = () => {
        setHasSubmitGenCode(true);
        const price = Big(calculation.total);
        if (
            price.gte(1) &&
            round(calculation.total).length < 14 &&
            !errorDivZero
        ) {
            addBill();
        }
    };

    const handleBackCalculator = () => {
        setScreenActive(CALCULATOR_SCREEN);
        setCalculation({
            total: '0',
            expression: ['0'],
        });
        setInvoiceCode('');
        setHasSubmitGenCode(false);
    };

    const handleShowChangeTheme = () => {
        setShowChangeTheme(true);
    };

    const handleBackNavigation = () => {
        setShowChangeTheme(false);
        setScreenActive(CALCULATOR_SCREEN);
    };

    const closeWebview = () => {
        if (window.ReactNativeWebView) {
            window?.ReactNativeWebView?.postMessage(
                JSON.stringify({
                    type: 'GO_BACK',
                }),
            );
        }
    };

    const renderScreen = () => {
        switch (screenActive) {
            case CALCULATOR_SCREEN:
                return (
                    <CalculatorScreen
                        selectedAccount={selectedAccount}
                        calculation={calculation}
                        clickHandler={handleClick}
                        onEditAccount={handleEditAccount}
                        onClickGenCode={handleGenCode}
                        errorGenCode={errorGenCode}
                        hasSubmitGenCode={hasSubmitGenCode}
                        errorDivZero={errorDivZero}
                    />
                );

            case SELECT_ACCOUNT_SCREEN:
                return (
                    <SelectAccount
                        listAccount={listAccount}
                        selectedAccount={selectedAccount}
                        onChangeAccount={handleSelectAccount}
                        onNext={gotoCalculatorScreen}
                    />
                );

            case QRCODE_SCREEN:
                return (
                    <QRCode
                        selectedAccount={selectedAccount}
                        total={calculation.total}
                        invoiceCode={invoiceCode}
                        onClose={handleBackCalculator}
                    />
                );

            case HISTORY_SCREEN:
                return <History />;

            default:
                break;
        }
    };

    const renderContent = () => {
        return (
            <>
                <Navigation
                    screen={screenActive}
                    onClickChangeTheme={handleShowChangeTheme}
                    showChangeTheme={showChangeTheme}
                    onBack={handleBackNavigation}
                    onClickShowHistory={() => setScreenActive(HISTORY_SCREEN)}
                    closeWebview={closeWebview}
                />
                {renderScreen()}
                {showChangeTheme && <Theme />}
            </>
        );
    };

    return (
        <ThemeProvider>
            {firstLoading ? <SplashScreen /> : renderContent()}
            {loading && <Loading />}
            <ToastContainer
                key="toast"
                hideProgressBar
                pauseOnHover={false}
                pauseOnFocusLoss={false}
                closeButton={false}
                autoClose={4000}
                position={toast.POSITION.TOP_CENTER}
                limit={3}
            />
        </ThemeProvider>
    );
}

export default App;
