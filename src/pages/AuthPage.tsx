import { useState } from 'react';
import { ToggleModeButton } from '../components/ToggleModeButtonComponent';
import { LoginComponent } from '../components/LoginComponent';
import { RegisterComponent } from '../components/RegisterComponent';
import '../css/auth-page.css';

export function AuthPage() {
  const [loginMode, setLoginMode] = useState(true);

  return (
    <div className='auth-container'>
      <h1>Clip Corner</h1>
      {loginMode ? <LoginComponent /> : <RegisterComponent />}
      <ToggleModeButton
        onClick={() => {
          setLoginMode(!loginMode);
        }}
        label={loginMode ? 'Create a new account?' : 'Already have an account?'}
      />
    </div>
  );
}
