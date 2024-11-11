import { useUsers } from '../Providers/UsersProvider';

export function ProfileSection() {
  const { activeUser } = useUsers();

  return (
    <div className='profile-container'>
      <h1>{activeUser?.username}</h1>
    </div>
  );
}
