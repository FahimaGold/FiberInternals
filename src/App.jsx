import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { MyButton } from './components/MyButton'
function App() {
  const [count, setCount] = useState(0);

   function updateCounter(){
    setCount((count) => count + 1);
  }

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <MyButton onClick={updateCounter} count={count}/>
    </>
  )
}

export default App
