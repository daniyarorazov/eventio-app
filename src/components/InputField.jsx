import React from 'react';
import './InputField.css';

const InputField = ({type = "text", valueInput, onChange, id, valueLabel, className}) => {
    return (
        <div className="input-field__block">
            <label htmlFor={id}>{valueLabel}</label>
            <input
                type={type}
                id={id}
                value={valueInput}
                onChange={onChange}
                className={className}
            />
        </div>
    );
};

export default InputField;