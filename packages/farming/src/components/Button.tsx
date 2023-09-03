import * as React from "react";
import {ButtonHTMLAttributes} from "react";

export const Button: React.FC<ButtonHTMLAttributes<any>> = (props) => {
    const className = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded".concat(props.className ? ` ${props.className}` : '')
    return <button
        {...props}
        className={className}
    />;
}