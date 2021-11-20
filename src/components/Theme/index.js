import React, { useEffect, useContext } from 'react';
import themes from 'configs/theme';
import { ThemeContext } from 'utilities/ThemeProvider';

import './style.scss';

function Theme() {
    const { theme, changeTheme } = useContext(ThemeContext);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'visible';
        };
    }, []);

    return (
        <>
            <div className="theme_mask" />
            <div className="theme_content">
                <div className="flex wrap-content">
                    {themes.map((item) => {
                        return (
                            <div
                                className={`theme-item ${
                                    theme.id === item.id
                                        ? 'theme-item--active'
                                        : ''
                                }`}
                                key={item.id}
                                style={{
                                    backgroundImage: `url(${item.background})`,
                                }}
                                onClick={() => changeTheme(item)}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default Theme;
