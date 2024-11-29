import { FormEvent, useState } from 'react';
import { TextInputComponent } from '../components/TextInputComponent';
import '../css/modal-page.css';
import '../css/upload-form.css';
import { useClips } from '../Providers/ClipsProvider';
import { useUsers } from '../Providers/UsersProvider';
import { isValidYouTubeURL } from '../utils/validations';

const invalidClipURLErrorMessage = 'Link to clip is invalid';
const invalidTitleErrorMessage = 'Please provide a title';

export function UploadClipPage() {
  const { setShowUploadForm, areClipsLoading, postClip } = useClips();
  const { activeUser } = useUsers();
  const [clipUrlInput, setClipUrlInput] = useState<string>('');
  const [titleInput, setTitleInput] = useState<string>('');
  const [descriptionInput, setDescriptionInput] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isValidClipLink = isValidYouTubeURL(clipUrlInput);
  const isTitleValid = titleInput.length > 0;

  const shouldShowClipURLError = isSubmitted && !isValidClipLink;
  const shouldShowTitleError = isSubmitted && !isTitleValid;

  const handleUpload = (e: FormEvent) => {
    e.preventDefault();
    if (allInputsValid()) {
      postClip({
        title: titleInput,
        description: descriptionInput,
        video_url: clipUrlInput,
        upload_date: new Date(),
        user_id: activeUser?.id,
        game_id: 'League of Legends',
      });
      setShowUploadForm(false);
    } else {
      setIsSubmitted(true);
    }
  };

  const allInputsValid = () => isValidClipLink && isTitleValid;

  const extractYouTubeVideoId = (url: string): string | null => {
    const match = url.match(
      // eslint-disable-next-line no-useless-escape
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const videoId = extractYouTubeVideoId(clipUrlInput);

  return (
    <div className='modal-window' onClick={() => setShowUploadForm(false)}>
      <div
        className='modal-content'
        style={{
          width: '60rem',
          minHeight: '35rem',
          textAlign: 'left',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h1>Upload New Clip</h1>
        <form
          className='upload-form'
          onSubmit={(e) => {
            handleUpload(e);
          }}
        >
          <div className='clip-form-container'>
            <div className='clip-details'>
              <TextInputComponent
                labelText='Clip URL'
                inputProps={{
                  type: 'text',
                  placeholder: 'url',
                  value: clipUrlInput,
                  onChange: (e) => {
                    setClipUrlInput(e.target.value);
                  },
                  autoComplete: 'off',
                  disabled: areClipsLoading,
                }}
                errorMessage={invalidClipURLErrorMessage}
                shouldErrorShow={shouldShowClipURLError}
              />

              <div className='clip-preview'>
                {videoId ? (
                  <iframe
                    className='clip-preview-iframe'
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title='YouTube video preview'
                    allow='accelerometer; clipboard-write; encrypted-media; gyroscope;'
                  ></iframe>
                ) : (
                  <div className='clip-preview-placeholder'>
                    <span>Clip Preview</span>
                  </div>
                )}
              </div>
            </div>

            <div className='clip-description'>
              <TextInputComponent
                labelText='Title'
                inputProps={{
                  type: 'text',
                  placeholder: 'title',
                  value: titleInput,
                  onChange: (e) => {
                    setTitleInput(e.target.value);
                  },
                  autoComplete: 'off',
                  disabled: areClipsLoading,
                }}
                errorMessage={invalidTitleErrorMessage}
                shouldErrorShow={shouldShowTitleError}
              />

              <div className='upload-textarea'>
                <label htmlFor='description'>Description</label>
                <textarea
                  id='description'
                  name='description'
                  rows={4}
                  cols={50}
                  placeholder='description (optional)'
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>

          <div className='upload-submit-button-container'>
            <button type='submit' className='upload-submit-button'>
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
