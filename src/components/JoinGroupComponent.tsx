import { FormEvent, useState } from 'react';
import { TextInputComponent } from '../components/TextInputComponent';
import { useGroups } from '../Providers/GroupsProvider';
import { SubmitButton } from '../components/SubmitButtonComponent';
import { useUserGroupMembership } from '../Providers/UserGroupMembershipProvider';

const groupNameDNEErrorMessage = 'Group does not exist';
const userIsAlreadyAMemberErrorMessage = 'User is already a member of this group';
const groupPasswordErrorMessage = 'Password does not match';

export function JoinGroupComponent() {
  const {
    setShowGroupFormPage,
    doesGroupExist,
    isGroupPasswordCorrect,
    isUserAlreadyMember,
    areGroupsLoading,
    addUserToGroup,
  } = useGroups();
  const { areMembershipsLoading } = useUserGroupMembership();
  const [groupNameInput, setGroupNameInput] = useState('');
  const [groupPasswordInput, setGroupPasswordInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isGroupValid = doesGroupExist(groupNameInput);
  const isUserMember = isUserAlreadyMember(groupNameInput);
  const isPasswordValid = isGroupPasswordCorrect(groupNameInput, groupPasswordInput);

  const shouldShowGroupFoundError = isSubmitted && !isGroupValid;
  const shouldShowAlreadyInGroupError = isSubmitted && isUserMember;
  const shouldShowIncorrectPasswordError = isSubmitted && !isPasswordValid;

  const allInputsValid = () => isGroupValid && !isUserMember && isPasswordValid;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (allInputsValid()) {
      setIsSubmitted(false);
      setShowGroupFormPage(false);
      addUserToGroup(groupNameInput);
      setGroupNameInput('');
      setGroupPasswordInput('');
    } else {
      setIsSubmitted(true);
    }
  };

  const notFoundOrAlreadyInMessage = shouldShowGroupFoundError
    ? groupNameDNEErrorMessage
    : shouldShowAlreadyInGroupError
    ? userIsAlreadyAMemberErrorMessage
    : '';

  return (
    <>
      <h1>Join a Group!</h1>
      <p>Enter the name and password of an existing group to join!</p>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <TextInputComponent
          labelText='Group Name'
          inputProps={{
            type: 'text',
            placeholder: 'Group Name',
            value: groupNameInput,
            onChange: (e) => {
              setGroupNameInput(e.target.value);
              setIsSubmitted(false);
            },
            autoComplete: 'off',
            disabled: areGroupsLoading,
          }}
          errorMessage={notFoundOrAlreadyInMessage}
          shouldErrorShow={shouldShowGroupFoundError || shouldShowAlreadyInGroupError}
        />
        <TextInputComponent
          labelText='Group Password'
          inputProps={{
            type: 'password',
            placeholder: 'Group Password',
            value: groupPasswordInput,
            onChange: (e) => {
              setGroupPasswordInput(e.target.value);
              setIsSubmitted(false);
            },

            autoComplete: 'off',
            disabled: areGroupsLoading,
          }}
          errorMessage={groupPasswordErrorMessage}
          shouldErrorShow={shouldShowIncorrectPasswordError}
        />
        <SubmitButton
          inputProps={{
            value: 'Join',
            disabled: areGroupsLoading || areMembershipsLoading,
          }}
        />
      </form>
    </>
  );
}
