import { useState } from 'react';
import { TextInputComponent } from '../components/TextInputComponent';
import { useUsers } from '../Providers/UsersProvider';
import { SubmitButton } from '../components/SubmitButtonComponent';
import '../css/auth-page.css';

const noUserWithThatNameErrorMessage = 'No user found with that name';
const incorrectPasswordMessage = 'Password does not match';

export function LoginComponent() {
  const { setUserCredentials, setLoginStatus, isUsernameUnique, doesUserPasswordMatch } =
    useUsers();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const doesUsernameExist = isUsernameUnique(usernameInput);
  const isPasswordCorrect = doesUserPasswordMatch(usernameInput, passwordInput);

  const shouldShowUsernameFoundError = isSubmitted && doesUsernameExist;
  const shouldShowIncorrectPasswordError = isSubmitted && !isPasswordCorrect;

  const allInputsValid = () => !doesUsernameExist && isPasswordCorrect;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (allInputsValid()) {
      setIsSubmitted(false);
      setLoginStatus(true);
      setUserCredentials(usernameInput, passwordInput);
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <TextInputComponent
        labelText='Username'
        inputProps={{
          type: 'text',
          placeholder: 'Username',
          value: usernameInput,
          onChange: (e) => {
            setUsernameInput(e.target.value);
            setIsSubmitted(false);
          },
          autoComplete: 'off',
        }}
        errorMessage={noUserWithThatNameErrorMessage}
        shouldErrorShow={shouldShowUsernameFoundError}
      />
      <TextInputComponent
        labelText='Password'
        inputProps={{
          type: 'password',
          placeholder: 'Password',
          value: passwordInput,
          onChange: (e) => {
            setPasswordInput(e.target.value);
            setIsSubmitted(false);
          },
          autoComplete: 'off',
        }}
        errorMessage={incorrectPasswordMessage}
        shouldErrorShow={shouldShowIncorrectPasswordError}
      />
      <SubmitButton inputProps={{ value: 'Login' }} />
    </form>
  );
}
