import React from 'react';

type Props = {
  name: string;
  avatar: string;
  latestMessage?: string;
  type: 'user' | 'chat';
};

const UserCard: React.FC<Props> = ({
  avatar,
  name,
  type,
  latestMessage,
}) => {
  return (
    <div
      className="relative flex items-center border-b
      border-gray-200 p-4 hover:cursor-pointer"
    >
      <div className="relative mr-4 flex-shrink-0">
        <div className="h-12 w-12 overflow-hidden rounded-full">
          <img
            src={avatar}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{name}</h2>
        </div>

        {type === 'chat' && (
          <p className="truncate text-sm text-gray-500">{latestMessage}</p>
        )}
      </div>
    </div>
  );
};

export default UserCard;
