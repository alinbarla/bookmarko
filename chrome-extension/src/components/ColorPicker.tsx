import React, { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PASTEL_COLORS = [
  '#FFB5B5', // Pastel Red
  '#FFD1B5', // Pastel Orange
  '#FFEAB5', // Pastel Yellow
  '#D1FFB5', // Pastel Green
  '#B5FFE4', // Pastel Mint
  '#B5D1FF', // Pastel Blue
  '#D4B5FF', // Pastel Purple
  '#FFB5E8', // Pastel Pink
];

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-dark-primary hover:opacity-80 transition-opacity"
        aria-label="Change column color"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 p-3 bg-dark-card rounded-lg shadow-lg z-50" style={{ width: '150px' }}>
            <div className="grid grid-cols-4 gap-2">
              {PASTEL_COLORS.map((color) => (
                <div
                  key={color}
                  className="w-7 h-7 p-[0.3rem] rounded-full bg-dark-card"
                >
                  <button
                    onClick={() => {
                      onChange(color);
                      setIsOpen(false);
                    }}
                    className={`w-full h-full rounded-full hover:scale-110 transition-transform ${
                      color === value ? 'ring-2 ring-dark-text ring-offset-1 ring-offset-dark-card' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorPicker; 