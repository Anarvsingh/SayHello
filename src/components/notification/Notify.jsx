import React from 'react';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Notify = () => {
  return (
    <div className='Notification'>
      <ToastContainer position='bottom-right' />
    </div>
  )
}

export default Notify;