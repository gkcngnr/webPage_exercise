import './login.css';
import React, { useState } from 'react'
import { TbUserShield } from "react-icons/tb";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";

function Login() {
    const [signIn, setSignIn] = useState(false);
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [remember, setRemember] = useState(false)
    const [terms, setTerms] = useState(false)

    function toggleSignIn (e) {
        setSignIn(!signIn);
        setEmail("");
        setUsername("");
        setPassword("");
        setRemember(false);
        setTerms(false);
    }

    return (
        <section>
            <div className='wrapper'>
                <div className='header'>
                    <h1>Don't Forget What You Got!</h1>
                </div>
                <div className='form'>
                    <form action="">
                        {signIn ? (<h1>Welcome Back</h1>) : (<h1>SignUp</h1>)}
                        <div className='inputBox'>
                            {signIn ? ("") : (<label htmlFor="email" className='inputLabel'>
                                <input type="email" name="email" id="email" value={email} onChange={(e)=>setEmail(e.target.value)}required />
                                <span>E-mail</span>
                                <i className='icon'><MdOutlineEmail /></i>
                            </label>)}
                        </div>
                        <div className='inputBox'>
                            <label htmlFor="username" className='inputLabel'>
                                <input type="text" name="username" id="username" value={username} onChange={(e)=>setUsername(e.target.value)} required />
                                <span>Username</span>
                                <i className='icon'><TbUserShield /></i>
                            </label>
                        </div>
                        <div className='inputBox'>
                            <label htmlFor="password" className='inputLabel'>
                                <input type="password" name="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                                <span>Password</span>
                                <i className='icon'><RiLockPasswordLine /></i>
                            </label>
                        </div>
                        {signIn ? (
                            <div className='rememberMe'>
                                <label htmlFor="remember" >
                                    <input type="checkbox" name="remember" id="remember" checked={remember} onChange={()=>setRemember(!remember)}/>Remember Me
                                </label>
                                <a href='#'>Forgot Password</a>
                            </div>) : (
                            <div className='rememberMe'>
                                <label htmlFor="terms" >
                                    <input type="checkbox" name="terms" id="terms" required checked={terms} onChange={()=>setTerms(!terms)}/>I agree to the terms & conditions
                                </label>
                            </div>
                        )}

                        <button type='submit' className='submitBtn'>
                            {signIn ? ("Log In") : ("Sign Up")}
                        </button>
                        {signIn ? (
                            <div className='signUp'>
                                <p>Don't have an account? <a onClick={toggleSignIn}>SignUp</a></p>
                                
                            </div>) : (
                                <div className='signUp'>
                                <p>Already have an account? <a onClick={toggleSignIn}>LogIn</a></p>
                                
                            </div>
                        )}
                    </form>
                </div>

            </div>

        </section>
    )
}

export default Login