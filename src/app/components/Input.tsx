import React from 'react';
import Button from './Button';

interface FlexibleInputProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  isValid: boolean;
  error: string;
  placeholder?: string;
  onSave?: () => void;
  onCancel?: () => void;
  className?: string;
  disabled?: boolean; // New prop for disabling the entire component
}

const FlexibleInput: React.FC<FlexibleInputProps> = ({
  value,
  onChange,
  isEditing,
  setIsEditing,
  isValid,
  error,
  placeholder = 'Enter value',
  onSave,
  onCancel,
  className = '',
  disabled = false, // Default to not disabled
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSave = () => {
    if (isValid && !disabled) {
      setIsEditing(false);
      if (onSave) onSave();
    }
  };

  const handleEdit = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    if (!disabled) {
      setIsEditing(true);
      if (onCancel) onCancel();
    }
  };

  return (
    <div className={`bg-black text-white flex flex-col ${className}`}>
      <div>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={!isEditing || disabled}
          className={`w-full p-3 text-center bg-inherit border border-white hover:border-gray-700 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
      <div className="flex flex-row m-2 gap-2 place-items-center justify-evenly">
        {isEditing ? (
          <>
            {isValid && (
              <Button
                state='success'
                onClick={handleSave}
                disabled={!isValid || disabled}
                className='flex w-28 p-2'
              >
                Save
              </Button>
            )}
            {value && (
              <Button
                onClick={handleCancel}
                disabled={!value || disabled}
                state='error'
                className='flex w-28 p-2'
              >
                Cancel
              </Button>
            )}
          </>
        ) : (
          <Button
            onClick={handleEdit}
            disabled={disabled}
            className="font-bold py-2 px-4 rounded"
          >
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default FlexibleInput;
