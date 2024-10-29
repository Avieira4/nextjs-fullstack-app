'use client'
import { Fugaz_One } from "next/font/google"
import Calendar from "./Calendar"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import Login from "./Login"
import Loading from "./Loading"

const fugaz = Fugaz_One({ subsets: ["latin"], weight: ['400'] })

export default function Dashboard() {
  const {currentUser, userDataObj, setUserDataObj, loading } = useAuth()
  const [data, setData] = useState({})
  const now = new Date()

  function countValues(){
    let totalNumberOfDays = 0
    let sumMoods = 0
    for(let year in data){
      for(let month in data[year]){
        for(let day in data[year][month]){
          let daysMood = data[year][month][day]
          totalNumberOfDays++
          sumMoods += daysMood
        }
      }
    }
    return {num_days: totalNumberOfDays, average_mood: sumMoods / totalNumberOfDays }
  }

  const statuses = {
    ...countValues(),
    time_remaining: `${23-now.getHours()}H ${60-now.getMinutes()}M`
  }

  async function handleSetMood(mood: number){
    const day = now.getDate()
    const month = now.getMonth()
    const year = now.getFullYear()
    try{
      const newData = { ...userDataObj }
      if(!newData?.[year]){
        newData[year] = {}
      }

      if(!newData?.[year]?.[month]){
        newData[year][month] = {}
      }

      newData[year][month][day] = mood
      setData(newData)
      setUserDataObj(newData)
      const docRef = doc(db, 'users', currentUser.uid)
      const res = await setDoc(docRef, {
        [year]: {
          [month]: {
            [day]: mood
          }
        }
      }, {merge: true})

    }catch(err: unknown){
      if(err instanceof Error)
        console.log('Failed to set data: ', err.message)
    }
  }

  const moods = {
    '&*@#$': '😭',
    'Sad': '😥',
    'Existing': '😶',
    'Good': '😊',
    'Elated': '😍'
  }

  useEffect(() => {
    if(!currentUser || !userDataObj){
      return
    }
    setData(userDataObj)
  }, [currentUser, userDataObj])

    if(loading) {
      return <Loading />
    }

    if(!currentUser){
      return <Login />;
    }

  return (
    <div className="flex flex-col flex-1 gap-8 sm:gap-12 md:gap-16">
      <div className="grid grid-cols-3 bg-indigo-50 
      text-indigo-500 p-4 gap-4 rounded-lg">
        {Object.keys(statuses).map((statusKey, statusIndex) => {
          return(
            <div key={statusIndex} className="flex flex-col gap-1 sm:gap-2">
              <p className="font-medium capitalize text-xs sm:text-sm truncate ">{statusKey.replaceAll('_', ' ')}</p>
              <p className={'text-base sm:text-lg truncate ' + fugaz.className}>{statuses[statusKey as keyof typeof statuses]} 
                {statusKey === 'num_days' ? ' 🔥' : ''}</p>
            </div>
          )
        })}
      </div>
      <h4 className={"text-5xl sm:text-6xl md:text-7xl text-center " + fugaz.className}>
        How do you <span className="textGradient">feel</span> today?
      </h4>
      <div className="flex items-stretch flex-wrap gap-4">
        {Object.keys(moods).map((mood, moodIndex) => {
          return (
            <button onClick={() => {
              const currentMoodValue = moodIndex + 1 
              handleSetMood(currentMoodValue)
            }} 
              key={moodIndex} className="flex flex-col flex-1 items-center 
              rounded-2xl purpleShadow duration-200 bg-indigo-50 hover:bg-indigo-100 
              text-center gap-2 p-4 px-5">
              <p className="text-4xl sm:text-5xl md:text-6xl">{moods[mood as keyof typeof moods]}</p>
              <p className={'text-indigo-500 text-xs sm:text-sm md:text-base ' + fugaz.className}>{mood}</p>
            </button>
          )
        })}
      </div>
      <Calendar completeData={data} handleSetMood={handleSetMood}/>
      <div className="class"></div>
    </div>
  )
}