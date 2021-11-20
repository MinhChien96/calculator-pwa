import React, { createContext, useState } from 'react';
import themes from 'configs/theme';
import { THEME_ID } from 'configs/constants';

export const ThemeContext = createContext();

const ThemeProvider = (props) => {
    const [theme, setTheme] = useState(() => {
        const themeId = localStorage.getItem(THEME_ID);
        const themeSave = themes.find((theme) => theme.id == themeId);
        if (themeSave) {
            return themeSave;
        } else {
            localStorage.setItem(THEME_ID, themes[0].id);
            return themes[0];
        }
    });

    const changeTheme = (theme) => {
        setTheme(theme);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                changeTheme,
            }}
        >
            {props.children}
        </ThemeContext.Provider>
    );
};
export default ThemeProvider;
