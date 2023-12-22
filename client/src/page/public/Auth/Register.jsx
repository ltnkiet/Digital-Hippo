import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import path from '../../../utils/path'

const Register = () => {
  const {status} = useParams()
  return (
    <Navigate to={`/${path.LOGIN}`} state={status} />
  )
}

export default Register