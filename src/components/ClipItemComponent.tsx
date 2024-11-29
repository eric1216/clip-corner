import { useClips } from '../Providers/ClipsProvider';
import { useGroups } from '../Providers/GroupsProvider';
import { useLikes } from '../Providers/LikesProvider';
import { useUserGroupMembership } from '../Providers/UserGroupMembershipProvider';
import { useUsers } from '../Providers/UsersProvider';
import emptyHeart from '/heart-empty.svg';
import filledHeart from '/heart-fill.svg';
import '../css/clip-item.css';
import { useState } from 'react';
import { ViewClipPage } from '../pages/ViewClipPage';

export function ClipItemComponent() {
  const { users, activeUser } = useUsers();
  const { activeGroup } = useGroups();
  const { clips } = useClips();
  const { likes, postLike, deleteLike } = useLikes();
  const { memberships } = useUserGroupMembership();
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  const handleLikeToggle = (e: React.MouseEvent, clipId: string, isLikedByUser: boolean) => {
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

  function getYouTubeThumbnailUrl(videoUrl: string): string {
    const videoIdMatch = videoUrl.match(
      // eslint-disable-next-line no-useless-escape
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    return videoId
      ? `https://img.youtube.com/vi/${videoId}/0.jpg`
      : 'https://via.placeholder.com/168x94?text=Video+Not+Available';
  }

  if (selectedClipId) {
    return <ViewClipPage clipId={selectedClipId} onBack={() => setSelectedClipId(null)} />;
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
        .reverse()
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
            <div
              key={clip.id}
              className='clip-item'
              onClick={() => {
                setSelectedClipId(clip.id);
              }}
            >
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
                    onClick={(e) => handleLikeToggle(e, clip.id, isLikedByUser)}
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
