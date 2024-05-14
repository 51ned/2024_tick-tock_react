import { ChangeEvent, useEffect, useState } from 'react'
import { Tick, TicksApi } from './api'


let api: TicksApi = new TicksApi()
let lastUpdate = Date.now()


export function App() {
  // amount of ticks
  const [amount, setAmount] = useState(100)

  // update delay in ms
  const [delay, setDelay] = useState(3)

  // array of ticks
  const [ticks, setTicks] = useState<Tick[]>([])

  useEffect(() => {
    const onResponse = (tick: Tick) => {
      // check delay
      const now = Date.now()
      console.log('delay', delay)

      if (now - lastUpdate > delay) {
        lastUpdate = now

        setTicks((prevTicks) => {
          const updatedTicks = [...prevTicks]
          updatedTicks[tick.index] = tick
          return updatedTicks
        })
      }
    }

    // subscribe on tick event
    api.on('tick', onResponse)

    // unsubscribe on tick event
    return () => api.off('tick', onResponse)
  }, [])

  useEffect(() => {
    api.unSign()

    setTicks([])

    for (let i = 0; i < amount; i++) {
      api.sign(i)
    }
  }, [amount, delay])

  function onChangeAmount(event: ChangeEvent<HTMLInputElement>) {
    setAmount(event.target.valueAsNumber)
  }

  function onChangeDelay(event: ChangeEvent<HTMLInputElement>) {
    console.log('onChangeDelay', event.target.valueAsNumber, delay)
    setDelay(event.target.valueAsNumber)
  }


  return (
    <div>
      <label>
        delay <input type="number" step={1} value={delay} onChange={onChangeDelay} />
      </label>
      <label>
        amount <input type="number" step={100} value={amount} onChange={onChangeAmount} />
      </label>
      <div className="list">
        {ticks.map((item) => (
          <div className={item?.delay ? 'item delay' : 'item'} key={item?.index}>
            {item?.value}
          </div>
        ))}
      </div>
    </div>
  )
}
