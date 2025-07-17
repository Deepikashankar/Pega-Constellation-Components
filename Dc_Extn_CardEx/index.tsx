import React, { useState } from 'react';
import Cards from 'react-credit-cards-2';
import type { PConnFieldProps } from './PConnProps';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

const CreditCardComponent = (props: PConnFieldProps) => {
  const pConnect = props.getPConnect();
  const pegaFields = {
    number: 'CardNumber',
    name: 'CardName',
    expiry: 'CardExpiry',
    cvc: 'CardCVC'
  };

  const [cardData, setCardData] = useState({
    number: pConnect.getValue(pegaFields.number) || '',
    name: pConnect.getValue(pegaFields.name) || '',
    expiry: pConnect.getValue(pegaFields.expiry) || '',
    cvc: pConnect.getValue(pegaFields.cvc) || '',
    focus: ''
  });

  const formatCardNumber = (value: string) => value.replace(/[^\d]/g, '').slice(0, 16);
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, '').slice(0, 4);
    return cleaned.length >= 3 ? cleaned.slice(0, 2) + '/' + cleaned.slice(2) : cleaned;
  };
  const formatCVC = (value: string) => value.replace(/[^\d]/g, '').slice(0, 4);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === 'number') formattedValue = formatCardNumber(value);
    if (name === 'expiry') formattedValue = formatExpiry(value);
    if (name === 'cvc') formattedValue = formatCVC(value);

    setCardData(prev => ({ ...prev, [name]: formattedValue }));

    const pegaFieldName = pegaFields[name as keyof typeof pegaFields];
    if (pegaFieldName) {
      pConnect.setValue(`.${pegaFieldName}`, formattedValue as unknown as { [key: string]: any });
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setCardData(prev => ({ ...prev, focus: e.target.name }));
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <Cards
        number={cardData.number}
        name={cardData.name}
        expiry={cardData.expiry}
        cvc={cardData.cvc}
        focused={cardData.focus as 'name' | 'number' | 'expiry' | 'cvc'}
      />
      <form>
        <input
          type="tel"
          name="number"
          placeholder="Card Number"
          value={cardData.number}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <input
          type="text"
          name="name"
          placeholder="Cardholder Name"
          value={cardData.name}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <input
          type="text"
          name="expiry"
          placeholder="MM/YY"
          value={cardData.expiry}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        <input
          type="text"
          name="cvc"
          placeholder="CVC"
          value={cardData.cvc}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
      </form>
    </div>
  );
};

export default CreditCardComponent;
