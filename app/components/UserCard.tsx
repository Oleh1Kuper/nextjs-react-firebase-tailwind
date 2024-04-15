import React from 'react';

type Props = {
  name: string;
  avatar: string;
  latestMessage?: string;
  time: string;
  type: 'user' | 'chat';
};

const UserCard: React.FC<Props> = ({
  avatar,
  name,
  time,
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

      {type === 'chat' && (
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{name}</h2>
            <span className="text-xs text-gray-500">{time}</span>
          </div>

          <p className="truncate text-sm text-gray-500">{latestMessage}</p>
        </div>
      )}

      {type === 'user' && (
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{name}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
