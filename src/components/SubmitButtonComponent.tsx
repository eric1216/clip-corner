import { TSubmitButton } from '../types';
import '../css/submit-button.css';

export function SubmitButton({ inputProps }: TSubmitButton) {
  return <input type='submit' {...inputProps} />;
}
