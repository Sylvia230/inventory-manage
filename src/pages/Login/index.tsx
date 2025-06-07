import React, { useState } from 'react'

const Login = () => {
  const [count, setCount] = useState(0)

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        count is: {count}
      </button>
    </div>
  )
}

export default Login