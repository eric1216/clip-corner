import '../css/upload.css';
import { UploadClipPage } from '../pages/UploadClipPage';
import { useClips } from '../Providers/ClipsProvider';
import uploadIcon from '/upload.svg';

export function UploadSection() {
  const { showUploadForm, setShowUploadForm } = useClips();

  return (
    <div className='upload-container'>
      <div className='upload-button' onClick={() => setShowUploadForm(true)}>
        <img src={uploadIcon} className='upload-icon-container' alt='settings' />
        <h2>Upload</h2>
      </div>
      {showUploadForm && <UploadClipPage />}
    </div>
  );
}
