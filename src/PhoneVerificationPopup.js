import React, { useState, useEffect, useRef } from 'react';
import './PhoneVerificationPopup.css';

function PhoneVerificationPopup() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPopup, setShowPopup] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Add event listener to capture paste events and auto-fill OTP inputs
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  function handlePaste(e) {
    e.preventDefault();
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text');
    if (pastedData.length === 6 && /^[0-9]+$/.test(pastedData)) {
      setOtp(pastedData.split(''));
    }
  }

  function buttonClick(e){
    e.preventDefault();
    alert("Verified succesfully");
  }

  function handleChange(e, index) {
    const value = e.target.value;
    if (/^[0-9]+$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== '' && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        inputRefs.current[index - 1].focus();
      }
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const enteredOtp = otp.join('');
    // Handle verification logic here
    console.log('OTP entered:', enteredOtp);
    // Reset OTP inputs
    setOtp(['', '', '', '', '', '']);
    setShowPopup(false);
  }

  return (
    <div className="phone-verification-popup">
      <button className="phone-verification-button" onClick={() => setShowPopup(true)}>
        Verify Phone
      </button>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2 className="popup-title">Enter OTP</h2>
            <form className="otp-form" onSubmit={handleSubmit}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  maxLength={1}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  className="otp-input"
                />
              ))}
              <button type="submit" className="verify-button" onClick={buttonClick}>
                Verify 
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PhoneVerificationPopup;
