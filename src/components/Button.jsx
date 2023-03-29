import React from 'react';

const Button = ({value, onClick, className}) => {

    const style = {
        width: "100%",
        maxWidth: "400px",
        height: "62px",
        border: 'none',
        borderRadius: "9px",
        fontWeight: "800",
        fontSize: "16px",
        backgroundColor: "#FF87C8",

    }

    return (
        <button onClick={onClick} style={style} className={className}>{value}</button>
    );
};

export default Button;