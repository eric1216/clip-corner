import cogwheel from '/cogwheel.svg';
import { PopupMenuComponent } from './PopupMenuComponent';
import { useState } from 'react';
import '../css/settings.css';
import { useUsers } from '../Providers/UsersProvider';
import { useGroups } from '../Providers/GroupsProvider';

export function SettingsComponent() {
  const { setLoginStatus } = useUsers();
  const { setActiveGroup } = useGroups();
  const [isPopupVisible, setPopupVisible] = useState<boolean>(false);

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

  const options = ['Log Out'];

  return (
    <div style={{ position: 'relative' }}>
      <img src={cogwheel} className='cogwheel-container' alt='settings' onClick={handleIconClick} />
      {isPopupVisible && (
        <PopupMenuComponent
          options={options}
          onOptionClick={handleOptionClick}
          setPopupVisible={setPopupVisible}
        />
      )}
    </div>
  );
}
