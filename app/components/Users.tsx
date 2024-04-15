'use client';

import React, { useState } from 'react';
import { DocumentData } from 'firebase/firestore';
import cn from 'classnames';
import UserCard from './UserCard';

type Props = {
  user: DocumentData | null;
};

type Tabs = 'users' | 'chatrooms';

const Users: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<Tabs>('users');

  const handleTabClick = (tab: Tabs) => () => {
    setActiveTab(tab);
  };

  return (
    <div className="mb-20 mt-4 h-screen overflow-auto shadow-lg">
      <div className="flex justify-between p-4">
        <button
          type="button"
          className={cn('btn btn-outline', {
            'btn-primary': activeTab === 'users',
          })}
          onClick={handleTabClick('users')}
        >
          Users
        </button>

        <button
          type="button"
          className={cn('btn btn-outline', {
            'btn-primary': activeTab === 'chatrooms',
          })}
          onClick={handleTabClick('chatrooms')}
        >
          Chatrooms
        </button>
      </div>

      <div>
        {activeTab === 'chatrooms' && (
          <>
            <h1 className="px-4 text-base font-semibold">ChatRooms</h1>
            <UserCard
              name="User name"
              avatar="https://avataaars.io/?accessoriesType
              =Blank&avatarStyle=Circle&clotheColor=Blue03&clotheType=
              BlazerShirt&eyeType=Close&eyebrowType=
              AngryNatural&facialHairColor=
              BlondeGolden&facialHairType=BeardLight&hairColor=
              BrownDark&hatColor=
              Black&mouthType=Sad&skinColor=DarkBrown&topType=ShortHairDreads01"
              latestMessage="Hello"
              time="1h ago"
              type="chat"
            />

            <UserCard
              name="User name"
              avatar="https://avataaars.io/?accessoriesType
              =Blank&avatarStyle=Circle&clotheColor=Blue03&clotheType=
              BlazerShirt&eyeType=Close&eyebrowType=
              AngryNatural&facialHairColor=
              BlondeGolden&facialHairType=BeardLight&hairColor=
              BrownDark&hatColor=
              Black&mouthType=Sad&skinColor=DarkBrown&topType=ShortHairDreads01"
              latestMessage="Hello"
              time="1h ago"
              type="chat"
            />
          </>
        )}
      </div>

      <div>
        {activeTab === 'users' && (
          <>
            <h1 className="px-4 text-base font-semibold">Users</h1>

            <UserCard
              name="User name"
              avatar="https://avataaars.io/?accessoriesType
              =Blank&avatarStyle=Circle&clotheColor=Blue03&clotheType=
              BlazerShirt&eyeType=Close&eyebrowType=
              AngryNatural&facialHairColor=
              BlondeGolden&facialHairType=BeardLight&hairColor=
              BrownDark&hatColor=
              Black&mouthType=Sad&skinColor=DarkBrown&topType=ShortHairDreads01"
              time="1h ago"
              type="user"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
