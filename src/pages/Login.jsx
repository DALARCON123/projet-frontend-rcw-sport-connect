import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { login } from '../services/authService'

export default function Login() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(email, password)
      setMsg('OK')
    } catch (e) {
      setMsg('Erreur / Error')
    }
  }

  return (
    <>
      <h2>{t('login.title')}</h2>
      <form onSubmit={onSubmit}>
        <input placeholder={t('login.email')} value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder={t('login.password')} type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">{t('login.submit')}</button>
      </form>
      {msg && <p>{msg}</p>}
    </>
  )
}
