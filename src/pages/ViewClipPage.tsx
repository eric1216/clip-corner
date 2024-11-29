import { FormEvent, useState } from 'react';
import { TextInputComponent } from '../components/TextInputComponent';
import '../css/clip-page.css';
import '../css/modal-page.css';
import { useClips } from '../Providers/ClipsProvider';
import emptyHeart from '/heart-empty.svg';
import filledHeart from '/heart-fill.svg';
import { useComments } from '../Providers/CommentsProvider';
import { ClipCommentsComponent } from '../components/ClipCommentsComponent';
import { useUsers } from '../Providers/UsersProvider';
import { useLikes } from '../Providers/LikesProvider';

type TViewClipPage = {
  clipId: string;
  onBack: () => void;
};

export function ViewClipPage({ clipId, onBack }: TViewClipPage) {
  const { clips } = useClips();
  const { activeUser } = useUsers();
  const { areCommentsLoading, postComment } = useComments();
  const { postLike, likes, deleteLike } = useLikes();
  const [commentInput, setCommentInput] = useState<string>('');
  const clip = clips.find((clip) => clip.id === clipId);

  const handlePostingComment = (e: FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      postComment({
        clip_id: clipId,
        user_id: activeUser?.id,
        content: commentInput,
        comment_date: new Date(),
      });
      setCommentInput('');
    }
  };

  const isLikedByUser = likes.some(
    (like) => like.clip_id === clipId && like.user_id === activeUser?.id
  );

  const numberOfLikes = likes.reduce((acc, like) => {
    if (like.clip_id === clipId) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.stopPropagation();
    if (isLikedByUser) {
      const likeToDelete = likes.find(
        (like) => like.clip_id === clipId && like.user_id === activeUser?.id
      );

      if (likeToDelete) {
        deleteLike(likeToDelete.id);
      }
    } else {
      postLike({ user_id: activeUser?.id, clip_id: clipId });
    }
  };

  const extractYouTubeVideoId = (url: string): string | null => {
    const match = url.match(
      // eslint-disable-next-line no-useless-escape
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const videoId = extractYouTubeVideoId(clip!.video_url);

  return (
    <div className='modal-window' onClick={onBack}>
      <div
        className='modal-content'
        style={{
          width: '80rem',
          minHeight: '45rem',
          maxHeight: '45rem',
          textAlign: 'left',
          flexDirection: 'row',
          gap: '1rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='video-section'>
          <h1 className='clip-title'>{clip?.title}</h1>
          <iframe
            className='view-clip-iframe'
            src={`https://www.youtube.com/embed/${videoId}`}
            title='YouTube video preview'
            allow='accelerometer; clipboard-write; encrypted-media; gyroscope;'
            allowFullScreen
          ></iframe>
          <div className='clip-bio'>
            <p className='clip-bio-description'>{clip?.description}</p>
            <div style={{ gap: '0.6rem' }} className='likes-container'>
              <img
                style={{
                  height: '2rem',
                  width: '2rem',
                }}
                src={isLikedByUser ? filledHeart : emptyHeart}
                className='heart-container'
                onClick={handleLikeToggle}
              />
              <span style={{ fontSize: '2rem' }}>{numberOfLikes}</span>
            </div>
          </div>
        </div>
        <div className='comment-section'>
          <h1>Comments</h1>
          <form onSubmit={(e) => handlePostingComment(e)} className='comment-input-form'>
            <TextInputComponent
              labelText=''
              inputProps={{
                type: 'text',
                placeholder: 'add a comment...',
                value: commentInput,
                onChange: (e) => {
                  setCommentInput(e.target.value);
                },
                autoComplete: 'off',
                disabled: areCommentsLoading,
              }}
              errorMessage={'placeHolder'}
              shouldErrorShow={false}
            />
            <div className='post-comment-container'>
              <button type='submit' className='post-comment-button'>
                comment
              </button>
            </div>
          </form>

          <ClipCommentsComponent clipId={clipId} />
        </div>
      </div>
    </div>
  );
}
