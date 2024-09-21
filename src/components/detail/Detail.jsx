import React from 'react'
import "./details.scss";
import { auth, db } from "../lib/firebase.js";
import { useChatStore } from '../lib/chatStore';
import { useUserStore } from '../lib/userStore';
import { updateDoc, doc, arrayRemove, arrayUnion } from 'firebase/firestore';

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {

      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock()
    } catch (err) {
      console.log(err)
    }

  }

  return (
    <div className='detail'>
      <div className="user">
        <img src="./avatar.png" alt="" />
        <h2>Tom K</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id, facilis?</p>
      </div>
      <div className="info">

        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://images.pexels.com/photos/28122625/pexels-photo-28122625/free-photo-of-the-terraced-rice-fields-in-vietnam.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
                <span>photo_2024_2.png</span>
              </div>
              <img src="./download.png" alt="" className='icon' />
            </div>
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowDown.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>{
          isCurrentUserBlocked ? "You are Blocked!" : isReceiverBlocked ? "Unblock User" : "Block User"
        }</button>
        <button className='logout' onClick={() => auth.signOut()}>Logout</button>

      </div>
    </div>
  )
}

export default Detail