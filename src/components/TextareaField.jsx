import React from 'react';
import './TextareaField.css';
const TextareaField = ({id, valueInput, valueLabel, onChange, className}) => {
 
    return (
        <div className="input-field__block">
            <label htmlFor={id}>{valueLabel}</label>
            <textarea
                id={id}
                onChange={onChange}
                className={className}
                style={{ height: "auto", resize: "none" }}
            >{valueInput}</textarea>
        </div>
    );
};

export default TextareaField;