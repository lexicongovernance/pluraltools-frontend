import ZupassLoginButton from '../components/zupassLoginButton'
import useZupassLogin from '../hooks/useZupassLogin'

function Landing() {
  const { nonce } = useZupassLogin()

  return (
    <>
      <h1>Zupass test</h1>
      <pre>Nonce: {nonce}</pre>
      <ZupassLoginButton nonce={nonce}>
        Request Semaphore signature
      </ZupassLoginButton>
    </>
  )
}

export default Landing
