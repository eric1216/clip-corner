import { MouseEvent, useState } from 'react';
import { useGroups } from '../Providers/GroupsProvider';
import { useUserGroupMembership } from '../Providers/UserGroupMembershipProvider';
import { useUsers } from '../Providers/UsersProvider';
import '../css/group-item.css';

export function GroupItemComponent() {
  const { groups, areGroupsLoading, groupsError, activeGroup, setActiveGroup, leaveGroup } =
    useGroups();
  const { memberships } = useUserGroupMembership();
  const { activeUser } = useUsers();
  const [popupVisible, setPopupVisible] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const options = ['Leave Corner'];

  if (areGroupsLoading) return 'Loading...';

  if (groupsError) return 'Could not fetch groups: ' + groupsError;

  const groupsUserIsIn = memberships
    .filter((membership) => membership.user_id === activeUser?.id)
    .map((membership) => membership.group_id);

  const sortedGroups = groups
    .filter((group) => groupsUserIsIn.includes(group.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  const handleGroupContextClick = (e: MouseEvent, groupId: string) => {
    e.preventDefault();
    const { clientX, clientY } = e;
    setPopupPosition({ x: clientX, y: clientY });
    setPopupVisible(groupId);
  };

  const handleMouseLeave = () => {
    setPopupVisible(null);
  };

  const handleOptionClick = (option: string, clickedGroupId: string) => {
    if (option === 'Leave Corner') {
      leaveGroup(clickedGroupId);
      setPopupVisible(null);
    }
    setPopupVisible(null);
  };

  return (
    <>
      <h1 className='section-title'>Corners</h1>
      {sortedGroups.length > 0 ? (
        sortedGroups.map((group) => {
          const isActive = group.id === activeGroup;

          return (
            <div
              key={group.id}
              className={`group-item ${isActive ? 'active-group' : ''}`}
              onClick={() => {
                setActiveGroup(group.id);
                localStorage.setItem('activeGroup', group.id);
              }}
              onContextMenu={(e) => handleGroupContextClick(e, group.id)}
            >
              <h3>{group.name}</h3>
              {popupVisible === group.id && (
                <div
                  className='group-popup-menu'
                  style={{
                    position: 'absolute',
                    top: `${popupPosition.y}px`,
                    left: `${popupPosition.x + 10}px`,
                  }}
                  onMouseLeave={handleMouseLeave}
                >
                  <ul>
                    {options.map((option, index) => (
                      <li
                        key={index}
                        onClick={() => handleOptionClick(option, group.id)}
                        style={option === 'Leave Corner' ? { color: '#F24042' } : {}}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p>You are not part of any Corners</p>
      )}
    </>
  );
}
