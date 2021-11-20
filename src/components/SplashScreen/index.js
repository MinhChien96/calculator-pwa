import React from 'react';
import './style.scss';

const SplashScreen = () => {
    return (
        <div className="loading-container flex flex-col justify-center content-center">
            <div>
                <div className="overlay">
                    <div className="spinner" />
                </div>
            </div>
            <p className="text-center">Đang xử lý dữ liệu...</p>
            <span className="text-center">Vui lòng chờ trong giây lát</span>
        </div>
    );
};

export default SplashScreen;
