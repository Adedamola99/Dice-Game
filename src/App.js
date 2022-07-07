import React from "react"; 
import Die from "./Component/Die";
import { nanoid } from 'nanoid';
import Confetti from "react-confetti";
// import Timer from "./Component/Timer";


const App = () => {
   
  const [dice, setDice] = React.useState(allNewDice());
  const[tenzies, setTenzies] = React.useState(false);
  const[countRoll, setCountRoll] = React.useState(0);
  const[bestTime, setBestTime] = React.useState(JSON.parse(localStorage.getItem("bestTime")) || []);

// Timer Starts here

const initialMinute = 0;
const initialSeconds = 30;

const [minutes, setMinutes] = React.useState(initialMinute);
const [seconds, setSeconds] = React.useState(initialSeconds);


React.useEffect(() => {
  if (!tenzies) {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
          setSeconds(seconds - 1);
      }
      if (seconds === 0) {
          if (minutes === 0) {
              clearInterval(myInterval)
          } else {
              setMinutes(minutes - 1);
              setSeconds(59)
          }
      }
  }, 1000)

  return () => {
      clearInterval(myInterval);
  }
  }
})

// Ends here

  

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)

    if (allHeld && allSameValue ) {
      setTenzies(true)
    }
  }, [dice])

// Best Score part

React.useEffect(() => {
  const currentBestTime = localStorage.getItem("bestTime");
  if (tenzies) {
    if (!currentBestTime) {
      localStorage.setItem("bestTime", JSON.stringify(seconds));
    } else if (seconds > currentBestTime) {
      setBestTime(seconds);
    }
  }
}, [tenzies, seconds]);


// ends here

  function generateNewDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }



  function allNewDice() {
    const newDice = []
    for (let i= 0; i < 10; i++) {
      newDice.push(generateNewDice())
    }
    return newDice
  }



  function rollDice() {
    if (!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? 
          die :
        generateNewDice()
      }));
      setCountRoll(prevCount => prevCount + 1)
    } else {
      setTenzies(false)
      setCountRoll(0)
      setDice(allNewDice())
      setMinutes(0)
      setSeconds(30)

    }

  }




  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? 
        {...die, isHeld: !die.isHeld} :
        die 
    }))
  } 







  const diceElement = dice.map(die => 
    <Die 
      key={die.id} 
      value= {die.value} 
      isHeld= {die.isHeld}
      holdDice={() => holdDice(die.id)}
      />
    )




  return (
    <main>
      {tenzies && <Confetti className="confetti"/>}
      <h1 className="title">Tenzies</h1>
      <p className="instruction">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElement}
      </div>
      {tenzies ? <button onClick={rollDice}>New Roll</button> : <button onClick={rollDice}>Roll</button>}
      {/* <Timer/> */}
      <div className="tracker">
      <p className="roll">Roll: <h4>{countRoll}</h4></p>
      <p className="timer">Time: { minutes === 0 && seconds === 0  ? <h4>0:00</h4>: <h4>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h4>}</p>
      <p className="best-time">Best Time: <h4>{bestTime} seconds</h4></p>
      </div>
    </main>
  )
}

export default App
