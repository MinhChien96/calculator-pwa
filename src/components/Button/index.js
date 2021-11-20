import React from 'react';
import styled from 'styled-components';

const ContentButton = styled.button`
    font-weight: bold;
    font-size: 2.4rem;
    text-align: center;
    color: #9a9a9a;
    padding-top: 2rem;
    padding-bottom: 2rem;
    width: 25%;
    outline: 0;
    border: none;
`;

function Button({ clickHandler, name }) {
    const handleClick = () => {
        clickHandler(name);
    };

    return (
        <ContentButton onClick={handleClick}>
            <span>{name}</span>
        </ContentButton>
    );
}

export default Button;
