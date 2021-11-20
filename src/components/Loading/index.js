import React, { useEffect } from 'react';
import './style.scss';

function Loading() {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'visible';
        };
    }, []);

    return (
        <div className="loading flex justify-center">
            <div className="spinner" />
        </div>
    );
}

export default Loading;
