import { FormEvent, useState } from 'react';
import { TextInputComponent } from '../components/TextInputComponent';
import { useGroups } from '../Providers/GroupsProvider';
import { SubmitButton } from '../components/SubmitButtonComponent';
import { useUserGroupMembership } from '../Providers/UserGroupMembershipProvider';
import { isInputOfLengthThree, isPasswordStrong } from '../utils/validations';

const groupNameInUseErrorMessage = 'Group name is already in use';
const groupNameLengthErrorMessage = 'Must be at least 3 characters long';
const groupPasswordStrengthErrorMessage =
  'Must be at least 3 characters long\nMust contain at least 1 number\nMust contain at least 1 uppercase letter';

export function CreateGroupComponent() {
  const { setShowGroupFormPage, doesGroupExist, areGroupsLoading, postGroup } = useGroups();
  const { areMembershipsLoading } = useUserGroupMembership();
  const [groupNameInput, setGroupNameInput] = useState('');
  const [groupPasswordInput, setGroupPasswordInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isGroupNameValid = !doesGroupExist(groupNameInput);
  const isGroupNameLengthValid = isInputOfLengthThree(groupNameInput);
  const isPasswordValid = isPasswordStrong(groupPasswordInput);

  const shouldShowGroupInUseError = isSubmitted && !isGroupNameValid;
  const shouldShowGroupLengthError = isSubmitted && !isGroupNameLengthValid;
  const shouldShowIncorrectPasswordError = isSubmitted && !isPasswordValid;

  const allInputsValid = () => isGroupNameValid && isPasswordValid;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (allInputsValid()) {
      setIsSubmitted(false);
      setShowGroupFormPage(false);
      postGroup({ name: groupNameInput, group_password: groupPasswordInput });
      setGroupNameInput('');
      setGroupPasswordInput('');
    } else {
      setIsSubmitted(true);
    }
  };

  const groupNameLengthOrInUseErrorMessage = shouldShowGroupInUseError
    ? groupNameInUseErrorMessage
    : shouldShowGroupLengthError
    ? groupNameLengthErrorMessage
    : '';

  return (
    <>
      <h1>Create a Group!</h1>
      <p>
        To create your own group, enter a unique name and a password that others can use to join.
      </p>
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
            },
            autoComplete: 'off',
            disabled: areGroupsLoading,
          }}
          errorMessage={groupNameLengthOrInUseErrorMessage}
          shouldErrorShow={shouldShowGroupInUseError || shouldShowGroupLengthError}
        />
        <TextInputComponent
          labelText='Group Password'
          inputProps={{
            type: 'password',
            placeholder: 'Group Password',
            value: groupPasswordInput,
            onChange: (e) => {
              setGroupPasswordInput(e.target.value);
            },

            autoComplete: 'off',
            disabled: areGroupsLoading,
          }}
          errorMessage={groupPasswordStrengthErrorMessage}
          shouldErrorShow={shouldShowIncorrectPasswordError}
        />
        <SubmitButton
          inputProps={{
            value: 'Create',
            disabled: areGroupsLoading || areMembershipsLoading,
          }}
        />
      </form>
    </>
  );
}
