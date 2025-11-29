import { useEffect, useState } from "react";
import { sportsClient } from "../services/apiClient";
import useAuthStore from "../stores/useAuthStore";
import type { SportActivity } from "../types/SportActivity";
import { categoriesSport } from "../data/categories";

function Sports() {
  const { userProfile } = useAuthStore();

  const [videos, setVideos] = useState<SportActivity[]>([]);
  const [categorie, setCategorie] = useState("");

  // Recommandations personnalisées
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
    // Incluir edad y objetivo del usuario para personalizar los videos
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
                onClick={() => chargerVideosCategorie(cat.titre)}
                className="relative h-40 rounded-xl overflow-hidden shadow-lg cursor-pointer
                group transition transform hover:-translate-y-1 hover:shadow-2xl"
              >
                <img
                  src={cat.image}
                  className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                  alt={cat.titre}
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/400x300/9333EA/FFFFFF?text=${encodeURIComponent(cat.titre)}`;
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

          {videos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Aucune vidéo disponible pour cette catégorie. Sélectionne une catégorie ci-dessus.
              </p>
            </div>
          ) : (
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
                      e.currentTarget.src = "https://via.placeholder.com/400x300/9333EA/FFFFFF?text=" + encodeURIComponent(categorie);
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
          )}
        </div>

      </div>
    </div>
  );
}

export default Sports;
