import * as React from 'react';

import './page.css';
import App from "../App";

export const Page: React.FC = () => {
    const handleSubmit = (data) => {
        console.log('handleSubmit', data);
    }
    return (
        <div>
            <App />
        </div>
    );
};
