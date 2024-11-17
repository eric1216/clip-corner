import { useClips } from '../Providers/ClipsProvider';
import { useGroups } from '../Providers/GroupsProvider';
import { useLikes } from '../Providers/LikesProvider';
import { useUserGroupMembership } from '../Providers/UserGroupMembershipProvider';
import { useUsers } from '../Providers/UsersProvider';
import emptyHeart from '/heart-empty.svg';
import filledHeart from '/heart-fill.svg';
import '../css/clip-item.css';

export function ClipItemComponent() {
  const { users, activeUser } = useUsers();
  const { activeGroup } = useGroups();
  const { clips } = useClips();
  const { likes } = useLikes();
  const { memberships } = useUserGroupMembership();

  function getYouTubeThumbnailUrl(videoUrl: string): string {
    const videoIdMatch = videoUrl.match(
      /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([a-zA-Z0-9_-]{11})/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    return videoId
      ? `https://img.youtube.com/vi/${videoId}/0.jpg`
      : 'https://via.placeholder.com/168x94?text=Video+Not+Available';
  }

  return (
    <>
      {clips
        ?.filter((clip) => {
          const groupMemberUserIds = memberships
            .filter((membership) => membership.group_id === activeGroup)
            .map((membership) => membership.user_id);
          return groupMemberUserIds.includes(clip.user_id);
        })
        .map((clip) => {
          const thumbnailUrl = getYouTubeThumbnailUrl(clip.video_url);
          const poster = users.find((user) => clip.user_id === user.id);
          const isLikedByUser = likes.some(
            (like) => like.clip_id === clip.id && like.user_id === activeUser!.id
          );
          const numberOfLikes = likes.reduce((acc, like) => {
            if (like.clip_id === clip.id) {
              return acc + 1;
            }
            return acc;
          }, 0);

          return (
            <div key={clip.id} className='clip-item' onClick={() => console.log(clip.id)}>
              <img src={thumbnailUrl} alt='clip thumbnail' className='clip-thumbnail' />
              <div className='video-details'>
                <div className='description'>
                  <h4>{clip.title}</h4>
                  <p>{poster?.username}</p>
                </div>
                <div className='likes-container'>
                  <img
                    src={isLikedByUser ? filledHeart : emptyHeart}
                    className='heart-container'
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                  <p>{numberOfLikes}</p>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
}
