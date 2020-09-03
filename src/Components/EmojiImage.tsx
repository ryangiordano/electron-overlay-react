import React from "react";

const EmojiImage = ({ src }: { src: string }) => {
  return (
    <img
      style={{
        width: "15px",
        borderRadius: "15px",
        height: "15px",
      }}
      src={src}
      alt="emoji"
    />
  );
};

export default EmojiImage;
