import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { askBot } from '../services/chatService'

export default function Chat() {
  const { t, i18n } = useTranslation()
  const [q, setQ] = useState('')
  const [a, setA] = useState('')
  const send = async () => {
    const res = await askBot(q, i18n.language)
    setA(res?.answer || '...')
  }
  return (
    <>
      <h2>{t('chat.title')}</h2>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder={t('chat.placeholder')} />
      <button onClick={send}>{t('chat.send')}</button>
      {a && <p><strong>Bot:</strong> {a}</p>}
    </>
  )
}
