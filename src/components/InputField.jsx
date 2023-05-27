import React from 'react';
import './InputField.css';

const InputField = ({type = "text", valueInput, onChange, id, valueLabel, className, placeholder}) => {
    return (
        <div className="input-field__block">
            {valueLabel ? <label htmlFor={id}>{valueLabel}</label> : ""}
            <input
                type={type}
                id={id}
                value={valueInput}
                onChange={onChange}
                className={className}
                placeholder={placeholder}
            />
        </div>
    );
};

export default InputField;