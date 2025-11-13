import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { register } from '../services/authService'

export default function Register() {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(name, email, password)
      setMsg('OK')
    } catch (e) {
      setMsg('Erreur / Error')
    }
  }

  return (
    <>
      <h2>{t('register.title')}</h2>
      <form onSubmit={onSubmit}>
        <input placeholder={t('register.name')} value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder={t('register.email')} value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder={t('register.password')} type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">{t('register.submit')}</button>
      </form>
      {msg && <p>{msg}</p>}
    </>
  )
}
