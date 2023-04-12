import React from 'react';

const Button = ({value, onClick, className, backgroundColor, fontSize}) => {

    const style = {
        width: "100%",
        maxWidth: "400px",
        height: "62px",
        border: 'none',
        borderRadius: "9px",
        fontWeight: "800",
        fontSize: fontSize ? fontSize : "16px",
        backgroundColor: backgroundColor ? backgroundColor : "#FF87C8",
        color: backgroundColor ? "#1B445F" : "#fff",
        cursor: 'pointer',

    }

    return (
        <button onClick={onClick} style={style} className={className}>{value}</button>
    );
};

export default Button;