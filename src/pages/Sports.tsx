import { useEffect, useState } from "react";
import { sportsClient } from "../services/apiClient";
import useAuthStore from "../stores/useAuthStore";
import type { SportActivity } from "../types/SportActivity";
import { categoriesSport } from "../data/categories";

function Sports() {
  const { userProfile } = useAuthStore();

  const [videos, setVideos] = useState<SportActivity[]>([]);
  const [categorie, setCategorie] = useState("");

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

  // Charger recommandations personnalisées
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
        setCategorie(res.categorie_recommandee);
        setVideos(res.videos);
      })
      .catch((err: unknown) => {
        console.error("Erreur recommandations :", err);
      });
  }, [userProfile]);

  // Charger vidéos par catégorie cliquée
  const chargerVideosCategorie = (nomCategorie: string) => {
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
        setCategorie(res.categorie);
        setVideos(res.videos);
      })
      .catch((err) => {
        console.error("Erreur catégorie :", err);
        setVideos([]);
      });
  };

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
                  // mantém o comportamento de carregar vídeos
                  chargerVideosCategorie(cat.titre);

                  // abre o PDF correspondente em nova aba, se existir
                  const pdfUrl = pdfLinks[cat.titre];
                  if (pdfUrl) {
                    window.open(pdfUrl, "_blank", "noopener,noreferrer");
                  }
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

          <p className="text-purple-800 text-lg font-medium mt-1">
            👉 <strong>{categorie}</strong>
          </p>
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
