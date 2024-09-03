
import './App.css'
import CURDreport from './component/CURDreport'
import Header from './component/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TheContext } from './component/TheContext'
import { useState } from 'react'

function App() {

  const [message, setMessage] = useState({});

  return (
    <>
   
   <TheContext.Provider value={{message,setMessage}}  >
  
      <BrowserRouter>
     


        <Header />
        <CURDreport />

       
      </BrowserRouter>
      </TheContext.Provider>
     

    </>
  )
}

export default App
