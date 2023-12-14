import { createContext, useState } from 'react'
import { AuthUser } from '../types/AuthUserType'

type AuthContextProps = {
  authUser: AuthUser | null
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUser | null>>
  isLogged: boolean
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>
  nonce: string | undefined
  setNonce: React.Dispatch<React.SetStateAction<string | undefined>>
}

type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthContext = createContext<AuthContextProps>({
  authUser: null,
  setAuthUser: () => {},
  isLogged: false,
  setIsLogged: () => {},
  nonce: undefined,
  setNonce: () => {},
})

function AuthProvider({ children }: AuthProviderProps) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [isLogged, setIsLogged] = useState(false)
  const [nonce, setNonce] = useState<string | undefined>(undefined)

  const value = {
    authUser,
    setAuthUser,
    isLogged,
    setIsLogged,
    nonce,
    setNonce,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
