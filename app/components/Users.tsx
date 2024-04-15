'use client';

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { firestore, auth } from '@/lib/firebase';
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import UserCard from './UserCard';
import Spinner from './Spinner';

type Props = {
  userData: DocumentData | null;
  setSelectedChatroom: Dispatch<SetStateAction<DocumentData | null>>;
};

type Tabs = 'users' | 'chatrooms';

const Users: React.FC<Props> = ({ userData, setSelectedChatroom }) => {
  const [activeTab, setActiveTab] = useState<Tabs>('users');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [users, setUsers] = useState<DocumentData[] | null>(null);
  const [userChatrooms, setUserChatrooms] = useState<DocumentData[] | null>(
    null,
  );
  const router = useRouter();

  const handleTabClick = (tab: Tabs) => () => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success('Logout successful');
        router.push('/login');
      })
      .catch((error) => toast.error(error.message));
  };

  const createChat = (user: DocumentData) => async () => {
    const existingChatRoom = query(
      collection(firestore, 'chatrooms'),
      where('users', '==', [user.id, userData?.id]),
    );

    try {
      const existingChatRoomSnapshot = await getDocs(existingChatRoom);

      if (existingChatRoomSnapshot.docs.length > 0) {
        toast.error('Chatroom already exists');

        return;
      }

      const usersData = {
        [userData?.id]: userData,
        [user.id]: user,
      };

      const chatroomData = {
        users: [user.id, userData?.id],
        usersData,
        timestemp: serverTimestamp(),
        lastmessage: null,
      };

      await addDoc(collection(firestore, 'chatrooms'), chatroomData);

      setActiveTab('chatrooms');
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const openChat = (chatroom: DocumentData) => () => {
    const data = {
      id: chatroom.id,
      myData: userData,
      otherData:
        chatroom.usersData[
          chatroom.users.find((id: string) => id !== userData?.id)
        ],
    };

    setSelectedChatroom(data);
  };

  useEffect(() => {
    setIsLoading(true);

    const taskQuery = query(collection(firestore, 'users'));

    const unsubscribe = onSnapshot(taskQuery, (querySnaphot) => {
      const users = querySnaphot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(users);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setIsLoading2(true);

    if (!userData) {
      return () => {};
    }

    const chatroomsQuery = query(
      collection(firestore, 'chatrooms'),
      where('users', 'array-contains', userData.id),
    );
    const unsubscribe = onSnapshot(chatroomsQuery, (snapshot) => {
      const chatrooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setIsLoading2(false);
      setUserChatrooms(chatrooms);
    });

    return () => unsubscribe();
  }, [userData]);

  return (
    <div className="mb-20 mt-4 h-screen overflow-auto shadow-lg">
      <div className="flex flex-col justify-between gap-2 p-4 lg:flex-row">
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

        <button
          type="button"
          className="btn btn-outline"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div>
        {activeTab === 'chatrooms' && (
          <>
            <h1 className="px-4 text-base font-semibold">ChatRooms</h1>
            {isLoading2 ? (
              <div className="flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              userChatrooms?.map((chatroom) => (
                <button
                  className="block"
                  type="button"
                  aria-label="user-card"
                  key={chatroom.id}
                  onClick={openChat(chatroom)}
                >
                  <UserCard
                    name={
                      chatroom.usersData[
                        chatroom.users.find((id: string) => id !== userData?.id)
                      ].name
                    }
                    avatar={
                      chatroom.usersData[
                        chatroom.users.find((id: string) => id !== userData?.id)
                      ].avatarUrl
                    }
                    latestMessage={chatroom.lastMessage}
                    type="chat"
                  />
                </button>
              ))
            )}
          </>
        )}
      </div>

      <div>
        {activeTab === 'users' && (
          <>
            <h1 className="px-4 text-base font-semibold">Users</h1>

            {isLoading ? (
              <div className="flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              users?.map(
                (user) => user.id !== userData?.id && (
                  <button
                    className="block"
                    aria-label="user-card"
                    type="button"
                    key={user.id}
                    onClick={createChat(user)}
                  >
                    <UserCard
                      name={user.name}
                      avatar={user.avatarUrl}
                      type="user"
                    />
                  </button>
                ),
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
