import { useEffect, useState } from "react";
import { sportsClient } from "../services/apiClient";
import useAuthStore from "../stores/useAuthStore";
import type { SportActivity } from "../types/SportActivity";
import { categoriesSport } from "../data/categories";

function Sports() {
  const { userProfile } = useAuthStore();

  const [videos, setVideos] = useState<SportActivity[]>([]);
  const [categorie, setCategorie] = useState<string>("");

  // 🎥 VÍDEOS FIXOS POR TIPO DE ESPORTE
  const staticVideos = [
    {
      title: "Pilates – séance guidée",
      sport: "Pilates",
      link: "https://www.youtube.com/watch?v=SPxP0w2o6wQ",
      image: "https://img.youtube.com/vi/SPxP0w2o6wQ/hqdefault.jpg",
    },
    {
      title: "Yoga – débutant",
      sport: "Yoga",
      link: "https://www.youtube.com/watch?v=3_rUl32CPbA",
      image: "https://img.youtube.com/vi/3_rUl32CPbA/hqdefault.jpg",
    },
    {
      title: "Sportive à vélo – entraînement",
      sport: "Sportive à vélo",
      link: "https://www.youtube.com/watch?v=AiDD_aqdnK0",
      image: "https://img.youtube.com/vi/AiDD_aqdnK0/hqdefault.jpg",
    },
    {
      title: "Cardio HIIT – haute intensité",
      sport: "Cardio HIIT",
      link: "https://www.youtube.com/watch?v=JqSIh5IiVAs",
      image: "https://img.youtube.com/vi/JqSIh5IiVAs/hqdefault.jpg",
    },
  ];

  // 📄 LINKS PDF POR CATEGORIA
  const pdfLinks: Record<string, string> = {
    Yoga:
      "https://www.pedagogie.ac-aix-marseille.fr/upload/docs/application/pdf/2020-09/livret_de_yoga_collegien.pdf",
    Cardio:
      "https://www.itteville.fr/wp-content/uploads/2020/03/cardio-%C3%A0-la-maison.pdf",
    HIIT:
      "https://lyc-montesquieu-plessis.ac-versailles.fr/IMG/pdf/defit_hiit_-_du_1er_au_14_mars.pdf",
    Musculation:
      "https://www.santepubliqueottawa.ca/fr/public-health-topics/resources/Documents/strength-balance-exercises-fr.pdf",
    "Étirements":
      "https://vitalitenb.ca/formations/fr/ressources_educatives/Techniques%20de%20d%C3%A9placement/Documents%20PDF/Exercices%20Echauffement%20et%20Etirement.pdf",
    Pilates:
      "https://www.chu-montpellier.fr/fileadmin/medias/Publications/Guide-pratique-Exercices-Pilates-adapte.pdf",
    "Danse Fitness":
      "https://www.cnd.fr/fr/file/file/2285/inline/CN%20D_Guide%20danse%20et%20sante%CC%81_2023.pdf",
    "Marche Active":
      "https://cisss-outaouais.gouv.qc.ca/wp-content/uploads/2019/11/Carnet-de-la-marche-1.pdf",
  };

  const pdfUrlForSelected = categorie ? pdfLinks[categorie] : undefined;

  // 📝 DESCRIÇÃO / BENEFÍCIOS POR CATEGORIA
  const sportInfos: Record<
    string,
    {
      title: string;
      items: string[];
    }
  > = {
    Yoga: {
      title: "Les 5 piliers du yoga",
      items: [
        "La voie du bien-être : harmoniser corps et esprit au quotidien.",
        "Asanas : exercices physiques appropriés pour renforcer et assouplir le corps.",
        "Pranayama : respiration correcte pour mieux gérer l’énergie et le stress.",
        "Savasana : relaxation profonde pour récupérer et relâcher les tensions.",
        "Vedanta & Dhyana : pensées positives et méditation pour apaiser le mental.",
        "Alimentation saine : mieux manger pour mieux vivre et soutenir la pratique.",
      ],
    },
    Cardio: {
      title: "Les avantages de l’entraînement cardiovasculaire",
      items: [
        "Améliore la santé du cœur et réduit le risque de maladies cardiovasculaires.",
        "Aide à maintenir un poids santé en brûlant beaucoup de calories.",
        "Stimule les facultés cognitives (attention, mémoire, résolution de problèmes).",
        "Réduit l’anxiété et la dépression et améliore l’humeur générale.",
        "Améliore la qualité du sommeil et les niveaux d’énergie pendant la journée.",
        "Soutient l’autonomie des personnes âgées en renforçant l’équilibre et l’endurance.",
      ],
    },
    HIIT: {
      title: "Les bienfaits du HIIT",
      items: [
        "Permet de s’entraîner en peu de temps avec des résultats comparables à un entraînement plus long.",
        "Brûle beaucoup de calories pendant la séance et après grâce à l’effet « afterburn ». ",
        "Peut se pratiquer presque partout, souvent sans équipement particulier.",
        "Améliore fortement la VO₂ max et la capacité cardiovasculaire.",
        "Aide à réguler la glycémie et à améliorer la sensibilité à l’insuline.",
        "Peut réduire la tension artérielle et la fréquence cardiaque au repos.",
      ],
    },
    Musculation: {
      title: "Bienfaits de la musculation",
      items: [
        "Augmente la force et la masse musculaire pour les activités du quotidien.",
        "Renforce les os et aide à prévenir l’ostéoporose.",
        "Améliore la posture et protège les articulations.",
        "Accélère le métabolisme au repos, facilitant le contrôle du poids.",
        "Aide à réguler la glycémie et les lipides sanguins.",
        "Renforce la confiance en soi et l’image corporelle.",
      ],
    },
    "Étirements": {
      title: "Pourquoi faire des étirements ?",
      items: [
        "Améliorent la souplesse et l’amplitude des mouvements.",
        "Réduisent les tensions musculaires et certaines douleurs.",
        "Préparent les muscles à l’effort et diminuent le risque de blessure.",
        "Favorisent la récupération après l’entraînement.",
        "Aident à la relaxation et à la gestion du stress.",
      ],
    },
    Pilates: {
      title: "Les avantages du Pilates",
      items: [
        "Renforce les muscles profonds, notamment la ceinture abdominale.",
        "Améliore la posture et l’alignement du corps.",
        "Développe la stabilité, l’équilibre et le contrôle des mouvements.",
        "Peut réduire et prévenir les douleurs lombaires.",
        "Travaille la respiration et la conscience du corps.",
        "S’adapte à de nombreux niveaux de condition physique.",
      ],
    },
    "Danse Fitness": {
      title: "Pourquoi choisir la Danse Fitness ?",
      items: [
        "Propose un entraînement cardio ludique et rythmé.",
        "Améliore la coordination, le sens du rythme et l’équilibre.",
        "Permet de brûler des calories tout en s’amusant.",
        "Stimule l’expression corporelle et la confiance en soi.",
        "Réduit le stress et améliore l’humeur grâce à la musique.",
      ],
    },
    "Marche Active": {
      title: "Les bienfaits de la marche active",
      items: [
        "Activité douce et accessible à presque tout le monde.",
        "Améliore la santé du cœur et la circulation sanguine.",
        "Aide au contrôle du poids lorsqu’elle est pratiquée régulièrement.",
        "Renforce les muscles des jambes, des hanches et du tronc.",
        "Peut facilement s’intégrer dans la routine quotidienne (trajets, loisirs).",
        "Soutient la santé mentale en réduisant le stress et en clarifiant l’esprit.",
      ],
    },
  };

  const infoForSelected = categorie ? sportInfos[categorie] : undefined;

  // ========= CLIQUE NA CATEGORIA =========
  const chargerVideosCategorie = (nomCategorie: string) => {
    // usamos o nome do card como categoria selecionada
    setCategorie(nomCategorie);

    const params = new URLSearchParams({
      name: nomCategorie,
      age: String(userProfile?.age ?? 30),
      objectif: String(userProfile?.mainGoal ?? "Bien-être"),
    });

    sportsClient
      .get<{ categorie: string; videos: SportActivity[] }>(
        `/category?${params}`
      )
      .then((res) => {
        // usamos só os vídeos retornados pela API
        // @ts-ignore
        setVideos(res.videos);
      })
      .catch((err) => {
        console.error("Erreur catégorie :", err);
        setVideos([]);
      });
  };

  // ========= RECOMENDAÇÃO AUTOMÁTICA AO CARREGAR =========
  useEffect(() => {
    if (!userProfile) return;

    const params = new URLSearchParams({
      age: String(userProfile.age ?? 30),
      poids: String(userProfile.weight ?? 60),
      objectif: String(userProfile.mainGoal ?? "Bien-être"),
    });

    sportsClient
      .get<{ categorie_recommandee: string; videos: SportActivity[] }>(
        `/recommendations?${params}`
      )
      .then((res) => {
        // tenta casar a categoria recomendada com um titre do array categoriesSport
        // @ts-ignore
        const catFromApi = res.categorie_recommandee;
        const match =
          categoriesSport.find(
            (c) =>
              c.titre.toLowerCase() === String(catFromApi).toLowerCase()
          )?.titre ?? catFromApi;

        setCategorie(match as string);
        // @ts-ignore
        setVideos(res.videos);
      })
      .catch((err: unknown) => {
        console.error("Erreur recommandations :", err);
      });
  }, [userProfile]);

  return (
    <div className="w-full flex justify-center px-4">
      <div className="max-w-7xl w-full">
        {/* TITRE PRINCIPAL */}
        <div className="flex items-center gap-3 mt-6 mb-6">
          <div className="text-purple-600 text-3xl">🏋️‍♀️</div>
          <h1 className="text-3xl font-bold text-purple-700">
            Recommandations sportives personnalisées
          </h1>
        </div>

        {/* ========================== CATÉGORIES ========================== */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-10 border-l-4 border-purple-400">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-purple-600 text-2xl">📦</div>
            <h2 className="text-xl font-semibold text-purple-700">
              Catégories sportives
            </h2>
          </div>

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
                    {cat.titre}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================== CATÉGORIE SÉLECTIONNÉE ================== */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-10 border-l-4 border-purple-400">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-purple-600 text-2xl">🎯</div>
            <h2 className="text-xl font-semibold text-purple-700">
              Catégorie sélectionnée
            </h2>
          </div>

          {categorie ? (
            <>
              <p className="text-purple-800 text-lg font-medium mt-1">
                👉 <strong>{categorie}</strong>
              </p>

              {/* INFOS / BÉNÉFICES DO ESPORTE */}
              {infoForSelected && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-purple-800">
                    {infoForSelected.title}
                  </h3>
                  <ul className="mt-2 list-disc list-inside text-slate-700 space-y-1">
                    {infoForSelected.items.map((item) => (
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
                    Si le document ne s&apos;affiche pas correctement,{" "}
                    <a
                      href={pdfUrlForSelected}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-700 underline"
                    >
                      clique ici pour l&apos;ouvrir dans un nouvel onglet.
                    </a>
                  </p>
                </div>
              )}

              {!pdfUrlForSelected && (
                <p className="text-sm text-slate-500 mt-3">
                  Aucun PDF configuré pour cette catégorie.
                </p>
              )}
            </>
          ) : (
            <p className="text-slate-500 mt-1">
              Choisis une catégorie pour voir les informations et le PDF
              associé.
            </p>
          )}
        </div>

        {/* ========================== VIDÉOS ========================== */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-12 border-l-4 border-purple-400">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-purple-600 text-2xl">🎥</div>
            <h2 className="text-xl font-semibold text-purple-700">
              Vidéos : <span className="text-purple-900">{categorie}</span>
            </h2>
          </div>

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
                    ▶ Voir la vidéo
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* 🌟 BLOC FIXO – VÍDEOS POR TIPO DE ESPORTE */}
          <div className="mt-10 border-t border-purple-100 pt-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">
              Vidéos par type de sport
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Voici quelques suggestions rapides pour t&apos;entraîner en Pilates,
              Yoga, vélo ou Cardio HIIT.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {staticVideos.map((sv) => (
                <div
                  key={sv.link}
                  className="shadow-md rounded-xl overflow-hidden bg-white hover:shadow-xl transition"
                >
                  <img
                    src={sv.image}
                    alt={sv.title}
                    className="h-32 w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="text-xs text-purple-600 font-semibold uppercase">
                      {sv.sport}
                    </p>
                    <h4 className="text-sm font-semibold mt-1">
                      {sv.title}
                    </h4>
                    <a
                      href={sv.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-3 bg-purple-600 hover:bg-purple-700 
                      text-white text-center py-1.5 rounded-lg text-xs transition"
                    >
                      ▶ Regarder
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Sports;
