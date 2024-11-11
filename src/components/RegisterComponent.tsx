import { useState } from 'react';
import { TextInputComponent } from '../components/TextInputComponent';
import { useUsers } from '../Providers/UsersProvider';
import { SubmitButton } from '../components/SubmitButtonComponent';
import '../css/auth-page.css';
import { isInputOfLengthThree, isPasswordStrong } from '../utils/validations';

const usernameLengthErrorMessage = 'Must be at least 3 characters';
const usernameAlreadyTakenErrorMessage = 'Username is already taken';
const weakPasswordErrorMessage =
  'Must be at least 3 characters\n' + 'Contain one uppercase letter\n' + 'Contain one number';

export function RegisterComponent() {
  const { createUser, isUsernameUnique } = useUsers();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isUsernameLengthValid = isInputOfLengthThree(usernameInput);
  const isUsernameInputUnique = isUsernameUnique(usernameInput);
  const isPasswordInputStrong = isPasswordStrong(passwordInput);

  const shouldShowUsernameError = isSubmitted && (isUsernameLengthValid || isUsernameInputUnique);
  const shouldShowWeakPasswordError = isSubmitted && !isPasswordInputStrong;

  const usernameErrorMessage = () => {
    if (!isUsernameLengthValid) {
      return usernameLengthErrorMessage;
    }
    if (!isUsernameInputUnique) {
      return usernameAlreadyTakenErrorMessage;
    }
    return '';
  };

  const allInputsValid = () =>
    isUsernameLengthValid && isUsernameInputUnique && isPasswordInputStrong;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (allInputsValid()) {
      createUser({ username: usernameInput, password: passwordInput });
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
          },
          autoComplete: 'off',
        }}
        errorMessage={usernameErrorMessage()}
        shouldErrorShow={shouldShowUsernameError}
      />
      <TextInputComponent
        labelText='Password'
        inputProps={{
          type: 'password',
          placeholder: 'Password',
          value: passwordInput,
          onChange: (e) => {
            setPasswordInput(e.target.value);
          },
          autoComplete: 'off',
        }}
        errorMessage={weakPasswordErrorMessage}
        shouldErrorShow={shouldShowWeakPasswordError}
      />
      <SubmitButton inputProps={{ value: 'Register' }} />
    </form>
  );
}
