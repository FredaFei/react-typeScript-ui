``` jsx harmony
import * as React from 'react'
import {useState} from 'react'

export default function (props) {
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(true)

  const onChange1 = (e) => {
    setChecked1(e.target.checked)
  }
  const onChange2 = (e) => {
    setChecked2(e.target.checked)
  }
  return (
    <div className="exp-section">
      <Checkbox onChange={onChange1} checked={checked1}>apple</Checkbox>
      <Checkbox onChange={onChange2} checked={checked2}>apple</Checkbox>
    </div>
  )
}
```