import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import './App.css';
import { useUsers } from './Providers/UsersProvider';

function App() {
  const { loginStatus, areUsersLoading, usersError } = useUsers();

  if (areUsersLoading) return 'LOADING APPLICATION! PLEASE WAIT PATIENTLY!';

  if (usersError) return '404';

  return <>{loginStatus ? <HomePage /> : <AuthPage />}</>;
}

export default App;
