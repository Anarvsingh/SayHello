import React from 'react'
import "./chat.scss";
import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { db } from "../../components/lib/firebase.js";
import { onSnapshot, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { useChatStore } from '../lib/chatStore';
import { async } from '@firebase/util';
import { useUserStore } from '../lib/userStore';
import upload from '../lib/upload';

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = e => {
    setText((prev) => prev + e.emoji)
    setOpen(false);
  };

  const handleImg = e => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      })
    }
  }


  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {


      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        message: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...imgUrl && { img: imgUrl },
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {


        const userChatsRef = doc(db, "userchats", id)
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data()

          const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId)

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }


      })
    } catch (err) {
      console.log(err);
    }

    setImg({
      file: null,
      url: "",
    });

    setText("");
  }


  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </div>
          <div className="icons">
            <img src="./phone.png" alt="" />
            <img src="./video.png" alt="" />
            <img src="./info.png" alt="" />
          </div>
        </div>
      </div>
      <div className="center">

        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt animi harum beatae quibusdam reiciendis ducimus qui pariatur aliquid nisi ab!</p>
            <span>1 min ago</span>
          </div>
        </div>

        <div className="message own">
          <div className="texts">
            <img src="https://images.pexels.com/photos/28122625/pexels-photo-28122625/free-photo-of-the-terraced-rice-fields-in-vietnam.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" className='messageimg' />
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt animi harum beatae quibusdam reiciendis ducimus qui pariatur aliquid nisi ab!</p>
            <span>1 min ago</span>
          </div>
        </div>

        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt animi harum beatae quibusdam reiciendis ducimus qui pariatur aliquid nisi ab!</p>
            <span>1 min ago</span>
          </div>
        </div>
        {chat?.message?.map(message => (

          <div className="message own" key={message?.createdAt}>
            <div className="texts">
              {message.img && <img src={message.img} alt="" className='messageimg' />}
              <p>{message.text}</p>
              <span>1 min ago</span>
            </div>
          </div>
        ))}

        {img.url && (<div className="message own">
          <div className="texts">
            <img src={img.url} alt="" />
          </div>
        </div>)}

        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>

        <input type="text" placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You can't send message" : "Type a message..."} value={text} onChange={e => setText(e.target.value)} disabled={isCurrentUserBlocked || isReceiverBlocked} />
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={() => setOpen((prev) => !prev)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className='sendButton' onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
      </div>
    </div>
  )
}

export default Chat;