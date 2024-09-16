/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

const PasswordValidator = ({ password, setIsPasswordValid }) => {
  const [validations, setValidations] = useState({
    lowercase: false,
    uppercase: false,
    digit: false,
    symbol: false,
    length: false,
  });

  useEffect(() => {
    setValidations({
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      digit: /\d/.test(password),
      symbol: /[!@#$%^&*(),.?"]/.test(password),
      length: password.length >= 8,
    });
  }, [password]);

  const ValidationItem = ({ isValid, text }) => (
    <li
      className={`flex items-center text-[12px] ${
        isValid ? 'text-green-600' : 'text-gray-500'
      }`}
    >
      {isValid ? (
        <Check className='h-4 w-4 mr-2' />
      ) : (
        <X className='h-4 w-4 mr-2' />
      )}
      {text}
    </li>
  );

  useEffect(() => {
    const allValidationsPassed = Object.values(validations).every(Boolean);
    if (allValidationsPassed) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  }, [setIsPasswordValid, validations]);

  return (
    <div className='mt-2'>
      <p className='text-[12px] font-medium text-gray-400 mb-1'>
        Password must include:
      </p>
      <ul className='text-sm space-y-1'>
        <ValidationItem
          isValid={validations.lowercase}
          text='Lowercase letter'
        />
        <ValidationItem
          isValid={validations.uppercase}
          text='Uppercase letter'
        />
        <ValidationItem isValid={validations.digit} text='Number' />
        <ValidationItem
          isValid={validations.symbol}
          text='Symbol(!@#$%^&*(),.?")'
        />
        <ValidationItem
          isValid={validations.length}
          text='At least 8 characters'
        />
      </ul>
    </div>
  );
};

export default PasswordValidator;
