import React, { useState } from 'react';
import InputMask from 'react-input-mask';

const MaskedInput = () => {
    const [value, setValue] = useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <InputMask
            mask="999-99-9999" // Example mask (for SSN)
            value={value} // Pass the value prop
            onChange={handleChange} // Handle change to update state
        >
            {(inputProps) => (
                <input
                    {...inputProps} // Spread the input props (includes onChange, onFocus, etc.)
                    placeholder="Enter SSN"
                    required
                />
            )}
        </InputMask>
    );
};

export default MaskedInput;
