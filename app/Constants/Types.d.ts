declare type SlackChannel = {
  id: string;
  name: string;
  is_channel: boolean;
  is_group: boolean;
  is_im: boolean;
  created: number;
  is_archived: boolean;
  is_general: boolean;
  unlinked: 0;
  name_normalized: string;
  is_shared: boolean;
  parent_conversation: string;
  creator: string;
  is_ext_shared: boolean;
  is_org_shared: boolean;
  shared_team_ids: string[];
  pending_shared: string[];
  pending_connected_team_ids: string[];
  is_pending_ext_shared: boolean;
  is_member: boolean;
  is_private: boolean;
  is_mpim: boolean;
  topic: { value: string; creator: string; last_set: number };
  purpose: {
    value: string;
    creator: string;
    last_set: number;
  };
  previous_names: string[];
  num_members: number;
};

declare type SlackInfo = {
  ok: boolean;
  team: {
    id: string;
    name: string;
    domain: string;
    email_domain: string;
    icon: {
      image_34: string;
      image_44: string;
      image_68: string;
      image_88: string;
      image_102: string;
      image_132: string;
      image_230: string;
      image_default: boolean;
    };
  };
  response_metadata: {
    scopes: string[];
    acceptedScopes: string[];
  };
};

declare type SlackMessageEvent = {
  client_msg_id: string;
  suppress_notification: boolean;
  type: "message";
  text: string;
  user: string;
  team: string;
  blocks: any[];
  source_team: string;
  user_team: string;
  channel: string;
  event_ts: string;
  ts: string;
};

declare type SlackReactEvent = {
  type: "reaction_added";
  user: string;
  item: {
    type: string;
    channel: string;
    ts: string;
  };
  reaction: string;
  item_user: string;
  event_ts: string;
  ts: string;
};

declare type SlackUserChangeEvent = {
  type: "user_change";
  user: SlackUser;
  cache_ts: number;
  event_ts: string;
};

declare type SlackUserProfile = {
  title: string;
  phone: string;
  skype: string;
  real_name: string;
  real_name_normalized: string;
  display_name: string;
  display_name_normalized: string;
  fields: any[];
  status_text: string;
  status_emoji: string;
  status_expiration: number;
  avatar_hash: string;
  email: string;
  first_name: string;
  last_name: string;
  image_24: string;
  image_32: string;
  image_48: string;
  image_72: string;
  image_192: string;
  image_512: string;
  status_text_canonical: string;
  team: string;
};

declare type SlackUser = {
  id: string;
  team_id: string;
  name: string;
  deleted: boolean;
  color: string;
  real_name: string;
  tz: string;
  tz_label: string;
  tz_offset: number;
  is_admin: boolean;
  is_owner: boolean;
  is_primary_owner: boolean;
  is_restricted: boolean;
  is_ultra_restricted: boolean;
  is_bot: boolean;
  is_app_user: boolean;
  updated: number;
  locale: string;
  profile: SlackUserProfile;
};

declare type SlackEvent =
  | SlackUserChangeEvent
  | SlackReactEvent
  | SlackMessageEvent;
