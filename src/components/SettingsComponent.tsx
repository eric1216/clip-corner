import cogwheel from '/cogwheel.svg';
import { useState } from 'react';
import '../css/settings.css';
import { useUsers } from '../Providers/UsersProvider';
import { useGroups } from '../Providers/GroupsProvider';

export function SettingsComponent() {
  const { setLoginStatus } = useUsers();
  const { setActiveGroup } = useGroups();
  const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
  const options = ['Log Out'];

  const handleIconClick = () => {
    setPopupVisible(!isPopupVisible);
  };

  const handleOptionClick = (option: string) => {
    if (option === 'Log Out') {
      localStorage.removeItem('activeUser');
      localStorage.removeItem('activeGroup');
      setLoginStatus(false);
      setActiveGroup('');
    }
    setPopupVisible(false);
  };

  const handleMouseLeave = () => {
    setPopupVisible(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <img src={cogwheel} className='cogwheel-container' alt='settings' onClick={handleIconClick} />
      {isPopupVisible && (
        <div className='settings-popup-menu' onMouseLeave={handleMouseLeave}>
          <ul>
            {options.map((option, index) => (
              <li
                key={index}
                onClick={() => handleOptionClick(option)}
                style={option === 'Log Out' ? { color: '#F24042' } : {}}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
