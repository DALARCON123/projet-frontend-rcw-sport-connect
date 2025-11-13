import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getSports } from '../services/sportsService'

export default function Sports() {
  const { t } = useTranslation()
  const [sports, setSports] = useState([])

  useEffect(() => {
    getSports().then(setSports).catch(()=>setSports([]))
  }, [])

  return (
    <>
      <h2>{t('sports.title')}</h2>
      <ul>
        {sports.map(s => <li key={s.id}>{s.nom || s.name}</li>)}
      </ul>
    </>
  )
}
