``` jsx harmony
import * as React from 'react'
import {useState} from 'react'

const groups = [
  {name: 'fruit', value: 'apple'},
  {name: 'fruit', value: 'peach'},
  {name: 'fruit', value: 'orange'},
  {name: 'fruit', value: 'pear'}
]

export default function (props) {
  const [checked2, setChecked2] = useState(['peach'])

  const onChange2 = (e) => {
    setChecked2([e.target.value])
  }
  return (
    <div className="exp-section">
      <div>
        {groups.map(i => (
          <Radio
            key={i.value}
            value={i.value}
            checked={checked2.includes(i.value)}
            onChange={onChange2}
            name={i.name}
          >
            {i.value}
          </Radio>
        ))}
      </div>
      <p>当前选中的水果: {JSON.stringify(checked2)}</p>
    </div>
  )
}
```