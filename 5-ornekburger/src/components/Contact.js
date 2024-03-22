import React, { useState } from 'react'
import '../styles/Contact.css'
import burger2 from '../assets/hamburger-3.png'

function Contact() {

  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [messageValue, setMessageValue] = useState("");
  return (
    <div className='contact'>
      <div className='image'>
        <img src={burger2} alt="" />
      </div>
      <div className='form'>
        <h1>Contact Us</h1>
        <form action="">
          <label className="inputBox" htmlFor="name">
            <input type="text" required /><span className='inputSpan'
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}>Name</span>
          </label>
          <label className="inputBox" htmlFor="email">
            <input type="text" required /><span className='inputSpan'
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}>E-mail</span>
          </label>
          <label className="inputBox" htmlFor="textarea">
            <textarea name="textarea" id="textarea" rows="6" required
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}></textarea>
            <span className='message'>Your Message</span>
          </label>
          <button type='submit' className='submitBtn'>Send</button>
        </form>
      </div>
    </div>
  )
}

export default Contact