import { GroupItemComponent } from '../components/GroupItemComponent';
import { GroupFormButtonComponent } from '../components/GroupFormButtonComponent';
import { GroupFormPage } from '../pages/GroupFormPage';
import { useGroups } from '../Providers/GroupsProvider';

export function GroupsSection() {
  const { showGroupFormPage } = useGroups();

  return (
    <div className='groups-container'>
      <GroupItemComponent />
      <GroupFormButtonComponent />
      {showGroupFormPage && <GroupFormPage />}
    </div>
  );
}
