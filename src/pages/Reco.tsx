import { useTranslation } from "react-i18next";
export default function Reco(){
  const { t } = useTranslation();
  return <h1 className="p-6 text-2xl font-bold">{t("pages.reco.title")}</h1>;
}
