import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function useAuth() {
  return useContext(AuthContext)
}

export default useAuth
