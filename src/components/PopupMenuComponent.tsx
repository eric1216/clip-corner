import { Dispatch, SetStateAction } from 'react';
import '../css/popup-menu.css';

interface PopupMenuProps {
  options: string[];
  onOptionClick: (option: string) => void;
  setPopupVisible: Dispatch<SetStateAction<boolean>>;
}

export const PopupMenuComponent = ({ options, onOptionClick, setPopupVisible }: PopupMenuProps) => {
  const handleMouseLeave = () => {
    setPopupVisible(false);
  };

  return (
    <div className='popup-menu' onMouseLeave={handleMouseLeave}>
      <ul>
        {options.map((option, index) => (
          <li
            key={index}
            onClick={() => onOptionClick(option)}
            style={option === 'Log Out' ? { color: '#F24042' } : {}}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};
