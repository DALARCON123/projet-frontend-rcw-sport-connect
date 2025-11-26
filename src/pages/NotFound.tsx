import { useTranslation } from "react-i18next";
export default function NotFound(){
  const { t } = useTranslation();
  return <h1 className="p-6 text-2xl font-bold">{t("pages.notfound.title")}</h1>;
}
