import React from "react";

const ChatQueue = ({ users }: { users: any[] }) => {
  return (
    <ul>
      {users.map((u) => (
        <li style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p className="m-0">{u.name}</p>
            <p>{u?.profile?.status_text}</p>
          </div>
          <p>{u?.profile?.status_emoji}</p>
        </li>
      ))}
    </ul>
  );
};

export default ChatQueue;
