import { useComments } from '../Providers/CommentsProvider';
import { useUsers } from '../Providers/UsersProvider';
import '../css/comment-item.css';

type TCLipCommentsComponent = {
  clipId: string;
};

export function ClipCommentsComponent({ clipId }: TCLipCommentsComponent) {
  const { comments, areCommentsLoading, commentsError } = useComments();
  const { users } = useUsers();

  if (areCommentsLoading) return <p>Loading comments...</p>;

  if (commentsError) return <p>Could not fetch comments: {String(commentsError)}</p>;

  const filteredComments = [...comments.filter((comment) => comment.clip_id === clipId)].reverse();

  return (
    <div className='comments-list'>
      {filteredComments.length === 0 ? (
        <p>Be the first to comment!</p>
      ) : (
        filteredComments.map((comment) => {
          const user = users.find((user) => user.id === comment.user_id);

          return (
            <div key={comment.id} className='comment-item'>
              <div className='comment-details'>
                <h4>{user ? user.username : 'Unknown User'}</h4>
                <span className='comment-date'>
                  {new Date(comment.comment_date).toLocaleDateString()}
                </span>
              </div>
              <p>{comment.content}</p>
            </div>
          );
        })
      )}
    </div>
  );
}
