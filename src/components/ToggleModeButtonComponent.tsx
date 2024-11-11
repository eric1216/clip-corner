import { TToggleModeButton } from '../types';
import '../css/toggle-button.css';

export function ToggleModeButton({ label, onClick }: TToggleModeButton) {
  return (
    <button className='toggle-button' onClick={onClick}>
      {label}
    </button>
  );
}
