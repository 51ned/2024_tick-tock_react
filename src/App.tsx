import { ChangeEvent, useEffect, useState } from 'react'
import { Tick, TicksApi } from './api'


let api: TicksApi
api = new TicksApi()

let lastUpdate = Date.now()
let startTime = Date.now()
let tickCount = 0


export function App() {
  // amount of ticks
  const [amount, setAmount] = useState(1000)

  // update delay in ms
  const [delay, setDelay] = useState(3)

  // array of ticks
  const [ticks, setTicks] = useState<Tick[]>([])

  useEffect(() => {
    const onResponse = (tick: Tick) => {
      ticks[tick.index] = tick

      // check delay
      const now = Date.now()

      tickCount++

      if (tickCount >= 1000) {
        const elapsedTime = now - startTime

        console.log(`Time to reach 1000 ticks: ${elapsedTime} ms`)

        tickCount = 0
        startTime = now
      }

      if (now - lastUpdate > delay) {
        lastUpdate = now
        setTicks([...ticks])
      }
    }

    // subscribe on tick event
    api.on('tick', onResponse)

    return () => {
      // unsubscribe on tick event
      api.off('tick', onResponse)
    }
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
        {ticks.map((item) => {
          return (
            <div className={item.delay ? "item delay" : "item"} key={item.index}>{item.value}</div>
          )
        })}
      </div>
    </div>
  )
}