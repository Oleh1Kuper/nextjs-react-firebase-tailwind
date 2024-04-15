import React from 'react';
import { DocumentData } from 'firebase/firestore';
import moment from 'moment';

type Props = {
  message: DocumentData;
  other: DocumentData;
  me: DocumentData;
};

interface TimeObject {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
}

const MessageCard: React.FC<Props> = ({ message, me, other }) => {
  const isMessageFromMe = message.sender === me.id;

  const timeAgo = (time: TimeObject) => {
    const date = time?.toDate();
    const momentDate = moment(date);

    return momentDate.fromNow();
  };

  return (
    <div
      className={`mb-4 flex ${
        isMessageFromMe ? 'justify-end' : 'justify-start'
      }`}
    >
      <div className={`h-10 w-10 ${isMessageFromMe ? 'ml-2 mr-2' : 'mr-2'}`}>
        <img
          src={isMessageFromMe ? me.avatarUrl : other.avatarUrl}
          alt="avatar"
          className="h-full w-full rounded-full object-cover"
        />
      </div>

      <div
        className={` rounded-md p-2 text-white ${
          isMessageFromMe ? 'self-end bg-blue-500' : 'self-start bg-[#19D39E]'
        }`}
      >
        {message.image && (
          <img
            src={message.image}
            alt="message img"
            className="h-40 w-60 rounded-md object-cover"
          />
        )}
        <p>{message.content}</p>
        <div className="text-xs text-gray-300">{timeAgo(message.time)}</div>
      </div>
    </div>
  );
};

export default MessageCard;
