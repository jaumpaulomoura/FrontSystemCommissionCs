import React, { useState } from 'react';
import InputMask from 'react-input-mask';

const MaskedInput = () => {
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <InputMask
            mask="999-99-9999" 
            value={value} 
            onChange={handleChange} 
        >
            {(inputProps) => (
                <input
                    {...inputProps} 
                    placeholder="Enter SSN"
                    required
                />
            )}
        </InputMask>
    );
};

export default MaskedInput;
