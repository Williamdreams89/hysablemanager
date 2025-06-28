import { Backdrop, CircularProgress } from '@mui/material'
import React from 'react'

const LoadingScreen = () => {
  return (
    <Backdrop
  sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, display:'flex', flexDirection:'column', gap:'1rem' })}
open
>
  <img src="/images/loading2.gif" height={90} />
  please wait
</Backdrop>
  )
}

export default LoadingScreen