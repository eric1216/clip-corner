import { useState } from 'react';
import { JoinGroupComponent } from '../components/JoinGroupComponent';
import { CreateGroupComponent } from '../components/CreateGroupComponent';
import { ToggleModeButton } from '../components/ToggleModeButtonComponent';
import { useGroups } from '../Providers/GroupsProvider';
import '../css/modal-page.css';

export function GroupFormPage() {
  const [joinGroupMode, setJoinGroupMode] = useState(true);
  const { setShowGroupFormPage } = useGroups();

  return (
    <div className='modal-window' onClick={() => setShowGroupFormPage(false)}>
      <div
        className='modal-content'
        style={{
          width: '20rem',
          minHeight: '30rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {joinGroupMode ? <JoinGroupComponent /> : <CreateGroupComponent />}
        <ToggleModeButton
          onClick={() => {
            setJoinGroupMode(!joinGroupMode);
          }}
          label={joinGroupMode ? 'Create a new group?' : 'Join an existing group?'}
        />
      </div>
    </div>
  );
}
