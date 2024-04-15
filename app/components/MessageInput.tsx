import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import { FaPaperPlane, FaPaperclip } from 'react-icons/fa';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { app } from '@/lib/firebase';
import toast from 'react-hot-toast';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

type Props = {
  sendMessage: () => Promise<void>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  image: string | null;
  setImage: Dispatch<SetStateAction<string | null>>;
};

const MessageInput: React.FC<Props> = ({
  sendMessage,
  message,
  setMessage,
  setImage,
  image,
}) => {
  const storage = getStorage(app);
  const [file, setFile] = useState<File | undefined>();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<ArrayBuffer | string | null>(
    null,
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    const reader = new FileReader();

    setFile(selectedFile);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile!);
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (
          snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setUploadProgress(progress);
      },
      (error) => {
        toast.error(`${error}`);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFile(undefined);
          setImage(downloadURL);
          setImagePreview(null);
          (document.getElementById('my_modal_3') as HTMLDialogElement).close();
        });
      },
    );
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="relative flex items-center border-t border-gray-200 p-4">
      <FaPaperclip
        onClick={() => (document
          .getElementById('my_modal_3') as HTMLDialogElement).showModal()}
        className={`mr-2 cursor-pointer 
          ${image ? 'text-blue-500' : 'text-gray-500'}`}
      />

      <button
        type="button"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
      >
        😊
      </button>

      <input
        type="text"
        placeholder="Type a message"
        className="flex-1 border-none p-2 outline-none"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      <FaPaperPlane
        onClick={sendMessage}
        className="mr-2 cursor-pointer text-gray-500"
      />

      {showEmojiPicker && (
        <div className="absolute bottom-full right-0 p-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {imagePreview && (
              <img
                src={imagePreview as string}
                alt="preview"
                className="mb-4 max-h-60 w-60"
              />
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleUpload}
            >
              Upload
            </button>
            {uploadProgress && <progress value={uploadProgress} max={100} />}
          </form>

          <button
            type="button"
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
            onClick={() => (document
              .getElementById('my_modal_3') as HTMLDialogElement).close()}
          >
            ✕
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default MessageInput;
