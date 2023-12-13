import { createContext, useState } from 'react'

type AuthContextProps = {
  authUser: null
  setAuthUser: React.Dispatch<React.SetStateAction<null>>
  isLogged: boolean
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>
}

type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthContext = createContext<AuthContextProps>({
  authUser: null,
  setAuthUser: () => {},
  isLogged: false,
  setIsLogged: () => {},
})

function AuthProvider({ children }: AuthProviderProps) {
  const [authUser, setAuthUser] = useState(null)
  const [isLogged, setIsLogged] = useState(false)

  const value = {
    authUser,
    setAuthUser,
    isLogged,
    setIsLogged,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
