import '../css/error-message.css';

export function ErrorMessage({ message, show }: { message: string; show: boolean }) {
  return show ? <div className='error-message'>{message}</div> : <div></div>;
}
