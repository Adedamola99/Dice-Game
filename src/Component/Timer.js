import React from 'react'

const Timer = (props) => {
    const {initialMinute = 0, initialSeconds = 30} = props;
    const [minutes, setMinutes] = React.useState(initialMinute);
    const [seconds, setSeconds] = React.useState(initialSeconds);

    React.useEffect(() => {
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
    })



  return (
    <div>
      {
        minutes === 0 && seconds === 0 ? <h4>Time up</h4> : <h4 className='count'>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h4>
      }
    </div>
  )
}

export default Timer
