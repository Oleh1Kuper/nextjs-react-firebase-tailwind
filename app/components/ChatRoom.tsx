import React, { useEffect, useRef, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  DocumentData,
  Unsubscribe,
} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import toast from 'react-hot-toast';
import MessageCard from './MessageCard';
import MessageInput from './MessageInput';

type Props = {
  selectedChatroom: DocumentData | null;
};

const ChatRoom: React.FC<Props> = ({ selectedChatroom }) => {
  const me = selectedChatroom?.myData;
  const other = selectedChatroom?.otherData;
  const chatRoomId = selectedChatroom?.id;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<DocumentData | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef
        .current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    if (chatRoomId) {
      unsubscribe = onSnapshot(
        query(
          collection(firestore, 'messages'),
          where('chatRoomId', '==', chatRoomId),
          orderBy('time', 'asc'),
        ),
        (snapshot) => {
          const messagesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setMessages(messagesData);
        },
      );
    }

    return () => unsubscribe && unsubscribe();
  }, [chatRoomId]);

  const sendMessage = async () => {
    const messageCollections = collection(firestore, 'messages');

    if (!message.trim() && !image) {
      return;
    }

    try {
      const newMessage = {
        chatRoomId,
        sender: me.id,
        content: message,
        time: serverTimestamp(),
        image,
      };

      await addDoc(messageCollections, newMessage);
      setMessage('');
      setImage(null);

      const chatRoomRef = doc(firestore, 'chatrooms', chatRoomId);

      await updateDoc(chatRoomRef, { lastMessage: message || 'Image' });
    } catch (error) {
      toast.error(`${error}`);
    }

    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef
        .current.scrollHeight;
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth p-10"
      >
        {messages?.map((message: DocumentData) => (
          <MessageCard
            key={message.id}
            message={message}
            other={other}
            me={me}
          />
        ))}
      </div>

      <MessageInput
        sendMessage={sendMessage}
        message={message}
        setMessage={setMessage}
        image={image}
        setImage={setImage}
      />
    </div>
  );
};

export default ChatRoom;
