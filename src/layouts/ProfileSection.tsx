import { SettingsComponent } from '../components/SettingsComponent';
import { useUsers } from '../Providers/UsersProvider';
import '../css/profile.css';

export function ProfileSection() {
  const { activeUser } = useUsers();

  return (
    <div className='profile-container'>
      <p className='profile-display-name'>{activeUser?.username}</p>
      <SettingsComponent />
    </div>
  );
}
