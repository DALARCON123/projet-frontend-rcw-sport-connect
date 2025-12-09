import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { sportsClient } from "../services/apiClient";
import useAuthStore from "../stores/useAuthStore";
import type { SportActivity } from "../types/SportActivity";
import { categoriesSport } from "../data/categories";

type SectionCardProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  headerClassName?: string;
};

function SectionCard({
  icon,
  title,
  children,
  headerClassName = "mb-4",
}: SectionCardProps) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 mb-10 border-l-4 border-purple-400">
      <div className={`flex items-center gap-2 ${headerClassName}`}>
        <div className="text-purple-600 text-2xl" aria-hidden>
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-purple-700">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Sports() {
  const { t } = useTranslation();
  const { userProfile } = useAuthStore();

  const [videos, setVideos] = useState<SportActivity[]>([]);
  const [categorie, setCategorie] = useState<string>("");

  // ?? VIDEOS FIXOS POR TIPO DE ESPORTE (usamos i18n para t¡tulo/esporte)
  const staticVideos = [
    {
      titleKey: "pages.sports.staticVideos.pilates.title",
      sportKey: "pages.sports.staticVideos.pilates.sport",
      fallbackTitle: "Pilates - s‚ance guid‚e",
      fallbackSport: "Pilates",
      link: "https://www.youtube.com/watch?v=SPxP0w2o6wQ",
      image: "https://img.youtube.com/vi/SPxP0w2o6wQ/hqdefault.jpg",
    },
    {
      titleKey: "pages.sports.staticVideos.yoga.title",
      sportKey: "pages.sports.staticVideos.yoga.sport",
      fallbackTitle: "Yoga - d‚butant",
      fallbackSport: "Yoga",
      link: "https://www.youtube.com/watch?v=3_rUl32CPbA",
      image: "https://img.youtube.com/vi/3_rUl32CPbA/hqdefault.jpg",
    },
    {
      titleKey: "pages.sports.staticVideos.cycling.title",
      sportKey: "pages.sports.staticVideos.cycling.sport",
      fallbackTitle: "Sportive … v‚lo - entraŒnement",
      fallbackSport: "Sportive … v‚lo",
      link: "https://www.youtube.com/watch?v=AiDD_aqdnK0",
      image: "https://img.youtube.com/vi/AiDD_aqdnK0/hqdefault.jpg",
    },
    {
      titleKey: "pages.sports.staticVideos.cardio.title",
      sportKey: "pages.sports.staticVideos.cardio.sport",
      fallbackTitle: "Cardio HIIT - haute intensit‚",
      fallbackSport: "Cardio HIIT",
      link: "https://www.youtube.com/watch?v=JqSIh5IiVAs",
      image: "https://img.youtube.com/vi/JqSIh5IiVAs/hqdefault.jpg",
    },
  ];

  // ?? LINKS PDF POR CATEGORIA
  const pdfLinks: Record<string, string> = {
    Yoga: "https://www.pedagogie.ac-aix-marseille.fr/upload/docs/application/pdf/2020-09/livret_de_yoga_collegien.pdf",
    Cardio:
      "https://www.itteville.fr/wp-content/uploads/2020/03/cardio-%C3%A0-la-maison.pdf",
    HIIT: "https://lyc-montesquieu-plessis.ac-versailles.fr/IMG/pdf/defit_hiit_-_du_1er_au_14_mars.pdf",
    Musculation:
      "https://www.santepubliqueottawa.ca/fr/public-health-topics/resources/Documents/strength-balance-exercises-fr.pdf",
    "tirements":
      "https://vitalitenb.ca/formations/fr/ressources_educatives/Techniques%20de%20d%C3%A9placement/Documents%20PDF/Exercices%20Echauffement%20et%20Etirement.pdf",
    Pilates:
      "https://www.chu-montpellier.fr/fileadmin/medias/Publications/Guide-pratique-Exercices-Pilates-adapte.pdf",
    "Danse Fitness":
      "https://www.cnd.fr/fr/file/file/2285/inline/CN%20D_Guide%20danse%20et%20sante%CC%81_2023.pdf",
    "Marche Active":
      "https://cisss-outaouais.gouv.qc.ca/wp-content/uploads/2019/11/Carnet-de-la-marche-1.pdf",
  };

  const pdfUrlForSelected = categorie ? pdfLinks[categorie] : undefined;

  // Translation keys for sport infos

  const sportInfoKeys: Record<
    string,
    {
      title: string;
      items: string;
    }
  > = {
    Yoga: {
      title: "pages.sports.infos.Yoga.title",
      items: "pages.sports.infos.Yoga.items",
    },
    Cardio: {
      title: "pages.sports.infos.Cardio.title",
      items: "pages.sports.infos.Cardio.items",
    },
    HIIT: {
      title: "pages.sports.infos.HIIT.title",
      items: "pages.sports.infos.HIIT.items",
    },
    Musculation: {
      title: "pages.sports.infos.Musculation.title",
      items: "pages.sports.infos.Musculation.items",
    },
    Étirements: {
      title: "pages.sports.infos.Étirements.title",
      items: "pages.sports.infos.Étirements.items",
    },
    Pilates: {
      title: "pages.sports.infos.Pilates.title",
      items: "pages.sports.infos.Pilates.items",
    },
    "Danse Fitness": {
      title: "pages.sports.infos.Danse Fitness.title",
      items: "pages.sports.infos.Danse Fitness.items",
    },
    "Marche Active": {
      title: "pages.sports.infos.Marche Active.title",
      items: "pages.sports.infos.Marche Active.items",
    },
  };

  const infoKeys = categorie ? sportInfoKeys[categorie] : undefined;
  const localizedInfoTitle = infoKeys?.title ? t(infoKeys.title) : undefined;
  const localizedInfoItems = infoKeys?.items
    ? (t(infoKeys.items, { returnObjects: true }) as string[])
    : undefined;

  // ========= CLIQUE NA CATEGORIA =========
  const chargerVideosCategorie = (nomCategorie: string) => {
    setCategorie(nomCategorie);

    const params = new URLSearchParams({
      name: nomCategorie,
      age: String(userProfile?.age ?? 30),
      objectif: String(userProfile?.mainGoal ?? "Bien-ˆtre"),
    });

    sportsClient
      .get<{ categorie: string; videos: SportActivity[] }>(
        `/category?${params}`
      )
      .then((res) => {
        // @ts-ignore
        setVideos(res.videos);
      })
      .catch((err) => {
        console.error("Erreur cat‚gorie :", err);
        setVideos([]);
      });
  };

  // ========= RECOMENDA€AO AUTOMATICA AO CARREGAR =========
  useEffect(() => {
    if (!userProfile) return;

    const params = new URLSearchParams({
      age: String(userProfile.age ?? 30),
      poids: String(userProfile.weight ?? 60),
      objectif: String(userProfile.mainGoal ?? "Bien-ˆtre"),
    });

    sportsClient
      .get<{ categorie_recommandee: string; videos: SportActivity[] }>(
        `/recommendations?${params}`
      )
      .then((res) => {
        // @ts-ignore
        const catFromApi = res.categorie_recommandee;
        const match =
          categoriesSport.find(
            (c) => c.titre.toLowerCase() === String(catFromApi).toLowerCase()
          )?.titre ?? catFromApi;

        setCategorie(match as string);
        // @ts-ignore
        setVideos(res.videos);
      })
      .catch((err: unknown) => {
        console.error("Erreur recommandations :", err);
      });
  }, [userProfile]);

  const videosTitle =
    categorie && categorie.length > 0
      ? t("pages.sports.videos_for", { category: categorie }) ||
        `Vid‚os : ${categorie}`
      : t("pages.sports.videos") || "Vid‚os";

  return (
    <div className="w-full flex justify-center px-4">
      <div className="max-w-7xl w-full">
        {/* TITRE PRINCIPAL */}
        <div className="flex items-center gap-3 mt-6 mb-6">
          <div className="text-purple-600 text-3xl" aria-hidden>
            💪
          </div>
          <h1 className="text-3xl font-bold text-purple-700">
            {t("pages.sports.title") ||
              "Recommandations sportives personnalisées"}
          </h1>
        </div>

        {/* ========================== CATÉGORIES ========================== */}
        <SectionCard
          icon="🏷️"
          title={t("pages.sports.categories") || "Catégories sportives"}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-4">
            {categoriesSport.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  chargerVideosCategorie(cat.titre);
                }}
                className="relative h-40 rounded-xl overflow-hidden shadow-lg cursor-pointer
                group transition transform hover:-translate-y-1 hover:shadow-2xl"
              >
                <img
                  src={cat.image}
                  className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                  alt={cat.titre}
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/400x300/9333EA/FFFFFF?text=${encodeURIComponent(
                      cat.titre
                    )}`;
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-3xl drop-shadow-lg">{cat.icone}</span>
                  <span className="text-lg font-semibold drop-shadow-lg mt-1">
                    {t(`pages.sports.categoryNames.${cat.titre}`, {
                      defaultValue: cat.titre,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ================== CATGORIE SLECTIONNE ================== */}
        <SectionCard
          icon="📂"
          title={
            t("pages.sports.selected_category") || "Cat‚gorie s‚lectionn‚e"
          }
          headerClassName="mb-3"
        >
          {categorie ? (
            <>
              <p className="text-purple-800 text-lg font-medium mt-1">
                {t("pages.sports.selected_prefix", { category: categorie }) ||
                  categorie}
              </p>

              {/* INFOS / BNFICES DO ESPORTE */}
              {localizedInfoTitle && localizedInfoItems && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-purple-800">
                    {localizedInfoTitle}
                  </h3>
                  <ul className="mt-2 list-disc list-inside text-slate-700 space-y-1">
                    {localizedInfoItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* PDF dentro da categoria selecionada */}
              {pdfUrlForSelected && (
                <div className="mt-5">
                  <div className="border rounded-xl overflow-hidden shadow-inner">
                    <iframe
                      src={pdfUrlForSelected}
                      className="w-full h-[500px]"
                      title={`Document ${categorie}`}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {t("pages.sports.pdf_notice") ||
                      "Si le document ne s'affiche pas correctement,"}{" "}
                    <a
                      href={pdfUrlForSelected}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-700 underline"
                    >
                      {t("pages.sports.pdf_link") ||
                        "clique ici pour l'ouvrir dans un nouvel onglet."}
                    </a>
                  </p>
                </div>
              )}

              {!pdfUrlForSelected && (
                <p className="text-sm text-slate-500 mt-3">
                  {t("pages.sports.no_pdf") ||
                    "Aucun PDF configur‚ pour cette cat‚gorie."}
                </p>
              )}
            </>
          ) : (
            <p className="text-slate-500 mt-1">
              {t("pages.sports.choose_category") ||
                "Choisis une cat‚gorie pour voir les informations et le PDF associ‚."}
            </p>
          )}
        </SectionCard>

        {/* ========================== VIDOS ========================== */}
        <SectionCard icon="🎬" title={videosTitle}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {videos.map((v, index) => (
              <div
                key={index}
                className="shadow-md rounded-xl overflow-hidden bg-white hover:shadow-xl transition"
              >
                <img
                  src={v.image}
                  alt={v.title}
                  className="h-48 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/400x300/9333EA/FFFFFF?text=" +
                      encodeURIComponent(categorie);
                  }}
                />
                <div className="p-4">
                  <h3 className="font-semibold">{v.title}</h3>

                  <a
                    href={v.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 bg-purple-600 hover:bg-purple-700 
                    text-white text-center py-2 rounded-lg transition"
                  >
                    {t("pages.sports.watch_video") || "Voir la vid‚o"}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* ?? BLOC FIXO - VIDEOS POR TIPO DE ESPORTE */}
          <div className="mt-10 border-t border-purple-100 pt-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">
              {t("pages.sports.static_title") || "Vid‚os par type de sport"}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {t("pages.sports.static_subtitle") ||
                "Voici quelques suggestions rapides pour t'entraŒner en Pilates, Yoga, v‚lo ou Cardio HIIT."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {staticVideos.map((sv) => (
                <div
                  key={sv.link}
                  className="shadow-md rounded-xl overflow-hidden bg-white hover:shadow-xl transition"
                >
                  <img
                    src={sv.image}
                    alt={sv.fallbackTitle}
                    className="h-32 w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="text-xs text-purple-600 font-semibold uppercase">
                      {t(sv.sportKey, { defaultValue: sv.fallbackSport })}
                    </p>
                    <h4 className="text-sm font-semibold mt-1">
                      {t(sv.titleKey, { defaultValue: sv.fallbackTitle })}
                    </h4>
                    <a
                      href={sv.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-3 bg-purple-600 hover:bg-purple-700 
                      text-white text-center py-1.5 rounded-lg text-xs transition"
                    >
                      {t("pages.sports.watch_video") || "Regarder"}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default Sports;
