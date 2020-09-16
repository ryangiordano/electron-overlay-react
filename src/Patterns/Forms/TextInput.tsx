import React from "react";

const TextInput = ({
  onChange,
  value,
  placeholder,
  id,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  id?: string;
}) => {
  return (
    <input
      id={id}
      type="text"
      className="form-control"
      name="channel-name"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default TextInput;
