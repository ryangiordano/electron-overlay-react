import React from "react";

const ChatQueueUser = ({ user }: { user: SlackUser }) => {
  return (
    <li className="list-group-item" key={user.id}>
      <a
        style={{
          display: "flex",
          color: "black",
        }}
        href={`slack://user?team=${user.team_id}&id=${user.id}`}
      >
        <img
          src={user.profile.image_24}
          style={{
            height: "24px",
            width: "24px",
            borderRadius: "50px",
            marginRight: "1rem",
            alignSelf: "center",
            justifySelf: "center",
          }}
        />
        <div style={{ justifyContent: "center" }}>
          <p className="m-0">{user.name}</p>
          <p className="m-0 text-muted">{user?.profile?.status_text}</p>
        </div>
      </a>
    </li>
  );
};

const ChatQueueList = ({
  users,
  header,
}: {
  users: SlackUser[];
  header: string;
}) => {
  return (
    <ul className="list-group mr-2" style={{ flexGrow: 1 }}>
      <li className="list-group-item">
        <h1 style={{ fontSize: "1.2rem", margin: 0 }}>{header}</h1>
      </li>
      {users.length ? (
        users.map((u) => <ChatQueueUser user={u} />)
      ) : (
        <li
          className="list-group-item text-muted"
          style={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
          }}
        >
          Empty :(
        </li>
      )}
    </ul>
  );
};

const ChatQueue = ({ users }: { users: SlackUser[] }) => {
  const filteredUsers = users.reduce(
    (
      acc: {
        chat: SlackUser[];
        collaborate: SlackUser[];
      },
      u
    ) => {
      if (u.profile?.status_emoji === ":looking-to-chat:") {
        acc.chat.push(u);
      }
      if (
        u.profile?.status_emoji === ":looking-to-collaborate:" ||
        u.profile?.status_emoji === ":collaborate:"
      ) {
        acc.collaborate.push(u);
      }
      return acc;
    },
    {
      chat: [],
      collaborate: [],
    }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <ChatQueueList users={filteredUsers.chat} header={"Looking to chat"} />
      <ChatQueueList
        users={filteredUsers.collaborate}
        header={"Looking to collab"}
      />
    </div>
  );
};

export default ChatQueue;
