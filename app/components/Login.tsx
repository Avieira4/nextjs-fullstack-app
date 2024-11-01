'use client'
import { Fugaz_One } from "next/font/google"
import Button from "./Button"
import { useState } from "react"
import { AuthObj, useAuth } from "@/context/AuthContext"

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] })

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [authenticating, setAuthenticating] = useState(false)
  const {signup, login}: AuthObj = useAuth()

  async function handleSubmit(){
    if(!email || !password || password.length < 6){
      return
    }
    setAuthenticating(true)
    try{
      if(isRegister){
        console.log('Signing up a new user')
        await signup!(email, password)
      }else{
        console.log('Logging in a new user')
        await login!(email, password)
      }
    }catch(err: unknown){
      if(err instanceof Error)
        console.log(err.message)
    } finally{
      setAuthenticating(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 justify-center 
      items-center gap-4">
      <h3 className={'text-4xl sm:text-5xl md:text-6xl ' + fugaz.className}>
        {isRegister ? 'Register' : 'Log In'}
      </h3>
      <p>You&apos;re one step away!</p>
      <input value={email} onChange={(e) => {setEmail(e.target.value)}} 
        className="w-full max-w-[400px] mx-auto px-3 duration-200 
        hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 
        border border-solid border-indigo-400 rounded-full outline-none" 
        type="text" placeholder="Email"/>
      <input value={password} onChange={(e) => {setPassword(e.target.value)}} 
        className="w-full max-w-[400px] mx-auto px-3 duration-200 
        hover:border-indigo-600 focus:border-indigo-600 py-2 sm:py-3 
        border border-solid border-indigo-400 rounded-full outline-none" 
        type="password" placeholder="Password"/>
      <div className="max-w-[400px] w-full mx-auto">
        <Button clickHandler={handleSubmit} text={authenticating ? 'Submitting' : 'Submit'} full></Button>
      </div>
      <p className="text-center">{isRegister ? 'Already have an account? ' : 'Don\'t have an account? '}
        <button onClick={() => setIsRegister(!isRegister)} className="text-indigo-600"> 
          {isRegister ? 'Sign in' : 'Sign up'}
        </button>
      </p>
    </div>
  )
}