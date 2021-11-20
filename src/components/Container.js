import React, { useContext } from 'react';
import styled from 'styled-components';
import { ThemeContext } from 'utilities/ThemeProvider';

const Container = styled.div`
    height: 100vh;
    background: url(${(props) => props.background});
    background-size: cover;
    background-repeat: no-repeat;
    overflow-y: scroll;
    padding: 7rem 2.4rem 0;

    &::-webkit-scrollbar {
        display: none;
    }
`;

function Background({ children, className }) {
    const themeContext = useContext(ThemeContext);
    return (
        <Container
            background={themeContext.theme.background}
            className={className}
        >
            {children}
        </Container>
    );
}

export default Background;
