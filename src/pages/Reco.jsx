import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getPersonalReco } from '../services/recoService'

export default function Reco() {
  const { t } = useTranslation()
  const [recs, setRecs] = useState([])
  const ask = async () => {
    const data = await getPersonalReco({ objectifs: 'Perte de poids', niveau: 'Débutant', disponibilite: '3j/sem' })
    setRecs(data || [])
  }
  return (
    <>
      <h2>{t('reco.title')}</h2>
      <button onClick={ask}>Demo Reco</button>
      <ul>{recs.map((r,i)=><li key={i}>{r.title || JSON.stringify(r)}</li>)}</ul>
    </>
  )
}
