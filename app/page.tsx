'use client';

import React, { useEffect, useState } from 'react';
import { auth, firestore } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, DocumentData, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Users from './components/Users';
import ChatRoom from './components/ChatRoom';

const Home = () => {
  const [user, setUser] = useState<DocumentData | null>(null);
  const [selectedChatroom, setSelectedChatroom] = useState<DocumentData | null>(
    null,
  );
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const useRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(useRef);
        const userData = { id: userSnap.id, ...userSnap.data() };

        setUser(userData);
      } else {
        setUser(null);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex h-screen">
      <div className="w-3/12 flex-shrink-0">
        <Users setSelectedChatroom={setSelectedChatroom} userData={user} />
      </div>

      <div className="w-3/12 flex-grow">
        <ChatRoom selectedChatroom={selectedChatroom} />
      </div>
    </div>
  );
};

export default Home;
