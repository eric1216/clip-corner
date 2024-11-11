import { useGroups } from '../Providers/GroupsProvider';
import '../css/group-form-button.css';

export function GroupFormButtonComponent() {
  const { setShowGroupFormPage } = useGroups();
  return (
    <>
      <button className='group-form-button' onClick={() => setShowGroupFormPage(true)}>
        +
      </button>
    </>
  );
}
