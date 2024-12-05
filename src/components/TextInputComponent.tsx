import { ErrorMessage } from './ErrorMessageComponent';
import { TTextComponent } from '../types';
import '../css/text-input-component.css';

export function TextInputComponent({
  labelText,
  inputProps,
  errorMessage,
  shouldErrorShow,
}: TTextComponent) {
  return (
    <>
      <div className='input-wrap'>
        <label htmlFor={labelText}>{labelText}</label>
        <input id={labelText} {...inputProps} />
      </div>
      <ErrorMessage message={errorMessage} show={shouldErrorShow} />
    </>
  );
}
