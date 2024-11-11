import { ComponentProps } from 'react';

export type TUsers = {
  id: string;
  username: string;
  password: string;
};

export type TClips = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  upload_date: Date;
  user_id: string;
  game_id: string;
};

export type TGames = {
  id: string;
  title: string;
};

export type TGroups = {
  id: string;
  name: string;
  group_password: string;
};

export type TUserGroupMembership = {
  id: string;
  user_id: string;
  group_id: string;
};

export type TComments = {
  id: string;
  clip_id: string;
  user_id: string;
  content: string;
  comment_date: Date;
};

export type TLikes = {
  id: string;
  user_id: string;
  clip_id: string;
};

export type DatabaseSchema = {
  Users: TUsers[];
  Clips: TClips[];
  Games: TGames[];
  Groups: TGroups[];
  UserGroupMembership: TUserGroupMembership[];
  Comments: TComments[];
  Likes: TLikes[];
};

export type TTextComponent = {
  labelText: string;
  inputProps: ComponentProps<'input'>;
  errorMessage: string;
  shouldErrorShow: boolean;
};

export type TSubmitButton = {
  inputProps: ComponentProps<'input'>;
};

export type TToggleModeButton = {
  label: string;
  onClick: () => void;
};
