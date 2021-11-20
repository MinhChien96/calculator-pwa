import React, { useContext } from 'react';
import {
    CALCULATOR_SCREEN,
    HISTORY_SCREEN,
    // QRCODE_SCREEN,
    THEME_ID,
} from 'configs/constants';
import themes from 'configs/theme';
import { ThemeContext } from 'utilities/ThemeProvider';
import historyIcon from 'assets/images/history_icon.png';
import editIcon from 'assets/images/edit_icon.png';
import closeIcon from 'assets/images/close_icon.png';
import saveIcon from 'assets/images/save_icon.png';
import backIcon from 'assets/images/back_icon.png';

import './style.scss';

function Navigation({
    screen,
    onClickChangeTheme,
    showChangeTheme,
    onBack,
    onClickShowHistory,
    closeWebview,
}) {
    const { theme, changeTheme } = useContext(ThemeContext);

    const handleSaveTheme = () => {
        localStorage.setItem(THEME_ID, theme.id);
        onBack();
    };

    const handleUnsaveTheme = () => {
        const themeId = localStorage.getItem(THEME_ID);
        const themeSave =
            themes.find((theme) => theme.id == themeId) || themes[0];
        changeTheme(themeSave);
        onBack();
    };

    if (screen === CALCULATOR_SCREEN) {
        return showChangeTheme ? (
            <div className="navigation flex justify-between">
                <div
                    className="navigation_button flex justify-center items-center"
                    onClick={handleUnsaveTheme}
                >
                    <img alt="" src={closeIcon} />
                </div>
                <div
                    className="navigation_button flex justify-center items-center"
                    onClick={handleSaveTheme}
                >
                    <img alt="" src={saveIcon} />
                </div>
            </div>
        ) : (
            <>
                <div className="navigation flex justify-end">
                    <div className="flex">
                        <div
                            className="navigation_button flex justify-center items-center"
                            onClick={onClickShowHistory}
                        >
                            <img alt="" src={historyIcon} />
                        </div>
                        <div
                            className="navigation_button flex justify-center items-center"
                            onClick={onClickChangeTheme}
                        >
                            <img alt="" src={editIcon} />
                        </div>
                    </div>
                </div>
                <div className="navigation-close">
                    <div
                        className="navigation-close_button flex justify-center items-center"
                        onClick={closeWebview}
                    >
                        <img alt="" src={backIcon} />
                    </div>
                </div>
            </>
        );
    }

    // if (screen === QRCODE_SCREEN) {
    //     return (
    //         <div className="navigation flex justify-end">
    //             <div className="navigation_button flex justify-center items-center">
    //                 <img alt="" src={closeIcon} />
    //             </div>
    //         </div>
    //     );
    // }

    if (screen === HISTORY_SCREEN) {
        return (
            <div className="navigation flex justify-start">
                <div
                    className="navigation_button flex justify-center items-center"
                    onClick={onBack}
                    style={{ zIndex: 5 }}
                >
                    <img alt="" src={backIcon} />
                </div>
                <div className="navigation_title flex items-center justify-center">
                    Lịch sử đơn hàng
                </div>
            </div>
        );
    }

    return null;
}

Navigation.defaultProps = {
    onClickChangeTheme: () => {},
    showChangeTheme: () => {},
    onBack: () => {},
};

export default Navigation;
