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
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const useRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(useRef);
        const userData = userSnap.data();

        setUser(userData!);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex h-screen">
      <div className="flex-shrink-0 w-3/12">
        <Users user={user} />
      </div>

      <div className="flex-grow w-3/12">
        <ChatRoom />
      </div>
    </div>
  );
};

export default Home;
