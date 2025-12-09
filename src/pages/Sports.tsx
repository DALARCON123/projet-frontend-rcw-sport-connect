import { useEffect, useState } from "react";
import { sportsClient } from "../services/apiClient";
import useAuthStore from "../stores/useAuthStore";
import type { SportActivity } from "../types/SportActivity";
import { categoriesSport } from "../data/categories";

function Sports() {
  const { userProfile } = useAuthStore();

  const [videos, setVideos] = useState<SportActivity[]>([]);
  const [categorie, setCategorie] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategoryImages, setSelectedCategoryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Recommandations personnalisées
  useEffect(() => {
    if (!userProfile) {
      console.log("⚠️ No hay userProfile, esperando...");
      return;
    }

    const params = new URLSearchParams({
      age: String(userProfile.age ?? 30),
      poids: String(userProfile.weight ?? 60),
      objectif: String(userProfile.mainGoal ?? "Bien-être"),
    });

    console.log("🎬 Cargando recomendaciones iniciales con params:", {
      age: userProfile.age ?? 30,
      poids: userProfile.weight ?? 60,
      objectif: userProfile.mainGoal ?? "Bien-être"
    });

    setLoading(true);
    setError(null);

    sportsClient
      .get<{ categorie_recommandee: string; videos: SportActivity[] }>(
        `/recommendations?${params}`
      )
      .then((res) => {
        console.log("✅ Recomendación recibida:", res.categorie_recommandee, "con", res.videos.length, "videos");
        console.log("📹 Primeros videos:", res.videos.slice(0, 2));
        setCategorie(res.categorie_recommandee);
        setVideos(res.videos);
        
        // Encontrar la categoría y configurar sus imágenes
        const cat = categoriesSport.find(c => c.titre === res.categorie_recommandee);
        if (cat && cat.images) {
          setSelectedCategoryImages(cat.images);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("❌ Erreur recommandations :", err);
        setError("Erreur de chargement des recommandations");
        setLoading(false);
      });
  }, [userProfile]);

  // Carrusel automático de imágenes (cambia cada 3 segundos)
  useEffect(() => {
    if (selectedCategoryImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        (prev + 1) % selectedCategoryImages.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedCategoryImages]);

  // Charger vidéos par catégorie cliquée
  const chargerVideosCategorie = (nomCategorie: string) => {
    // Incluir edad y objetivo del usuario para personalizar los videos
    const params = new URLSearchParams({
      name: nomCategorie,
      age: String(userProfile?.age ?? 30),
      objectif: String(userProfile?.mainGoal ?? "Bien-être"),
    });

    console.log("🎬 Cargando videos para:", nomCategorie, "con params:", {
      age: userProfile?.age ?? 30,
      objectif: userProfile?.mainGoal ?? "Bien-être"
    });

    setLoading(true);
    setError(null);

    sportsClient
      .get<{ categorie: string; videos: SportActivity[] }>(
        `/category?${params}`
      )
      .then((res) => {
        console.log("✅ Videos recibidos:", res.videos.length, "videos");
        console.log("📹 Videos completos:", res.videos);
        setCategorie(res.categorie);
        setVideos(res.videos);
        
        // Encontrar la categoría y configurar sus imágenes
        const cat = categoriesSport.find(c => c.titre === nomCategorie);
        if (cat && cat.images) {
          setSelectedCategoryImages(cat.images);
          setCurrentImageIndex(0); // Reiniciar al primer índice
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Erreur catégorie :", err);
        setError(`Erreur de chargement des vidéos pour ${nomCategorie}`);
        setVideos([]);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20">
      <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-8">

        {/* TITRE PRINCIPAL */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg">
            🏋️‍♀️
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Recommandations Sportives
            </h1>
            <p className="text-slate-600 text-sm mt-1">Découvre des vidéos adaptées à tes objectifs</p>
          </div>
        </div>

        {/* ========================== CATÉGORIES ========================== */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 mb-12 border border-white/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-md">
              📦
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Catégories Sportives
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mt-6">
            {categoriesSport.map((cat) => (
              <div
                key={cat.id}
                onClick={() => chargerVideosCategorie(cat.titre)}
                className="relative h-48 rounded-2xl overflow-hidden shadow-lg cursor-pointer
                group transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <img
                  src={cat.image}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={cat.titre}
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/400x300/9333EA/FFFFFF?text=${encodeURIComponent(cat.titre)}`;
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-purple-900/80 group-hover:to-purple-900/90 transition-all"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-lg">
                    <span className="text-3xl">{cat.icone}</span>
                  </div>
                  <span className="text-lg font-bold drop-shadow-lg text-center">
                    {cat.titre}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================== CATÉGORIE SÉLECTIONNÉE ================== */}
        {categorie && (
          <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 shadow-2xl rounded-3xl p-8 mb-12 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-md">
                🎯
              </div>
              <h2 className="text-2xl font-bold">
                Catégorie Sélectionnée
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Imagen dinámica */}
              {selectedCategoryImages.length > 0 && (
                <div className="relative w-full lg:w-80 h-52 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30">
                  <img
                    src={selectedCategoryImages[currentImageIndex]}
                    alt={categorie}
                    className="w-full h-full object-cover transition-opacity duration-700"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/400x300/9333EA/FFFFFF?text=${encodeURIComponent(categorie)}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-center gap-1.5">
                    {selectedCategoryImages.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 rounded-full transition-all duration-300 shadow-lg ${
                          idx === currentImageIndex 
                            ? "w-8 bg-white" 
                            : "w-2 bg-white/60 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Información de la categoría */}
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
                    <span className="text-5xl">
                      {categoriesSport.find(c => c.titre === categorie)?.icone || "🏋️"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white drop-shadow-lg">{categorie}</h3>
                    <p className="text-white/90 text-base mt-2 font-medium">
                      {videos.length} vidéo{videos.length > 1 ? 's' : ''} personnalisée{videos.length > 1 ? 's' : ''}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-white/80 text-sm">Recommandations actives</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================== VIDÉOS ========================== */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 mb-12 border border-white/60">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-md">
              🎥
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              Vidéos Recommandées {categorie && <span className="text-purple-600">· {categorie}</span>}
            </h2>
          </div>

          {error && (
            <div className="text-center py-8 bg-red-50 rounded-xl border border-red-200">
              <div className="text-5xl mb-3">⚠️</div>
              <p className="text-red-600 font-medium">{error}</p>
              <p className="text-gray-600 text-sm mt-2">
                Vérifie que le service SPORTS est en cours d'exécution sur le port 8002
              </p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 bg-purple-50 rounded-xl">
              <div className="text-6xl mb-4 animate-pulse">⏳</div>
              <p className="text-gray-600 text-lg font-medium">
                Chargement des vidéos...
              </p>
            </div>
          ) : videos.length === 0 && !error ? (
            <div className="text-center py-12 bg-purple-50 rounded-xl">
              <div className="text-6xl mb-4">🎬</div>
              <p className="text-gray-600 text-lg font-medium">
                Sélectionne une catégorie sportive ci-dessus
              </p>
              <p className="text-gray-500 text-sm mt-2">
                L'IA te recommandera des vidéos YouTube adaptées à ton âge et tes objectifs
              </p>
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
              {videos.map((v, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={v.image}
                      alt={v.title}
                      className="h-56 w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/400x300/9333EA/FFFFFF?text=" + encodeURIComponent(categorie);
                      }}
                    />
                    {/* Overlay con icono de play */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-white rounded-full p-5 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                        <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 text-lg line-clamp-2 min-h-[3.5rem] group-hover:text-purple-600 transition-colors">
                      {v.title}
                    </h3>
                    
                    {v.category && (
                      <div className="flex items-center gap-2 mt-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                        <p className="text-xs text-slate-600 font-medium uppercase tracking-wide">
                          {v.category}
                        </p>
                      </div>
                    )}

                    <a
                      href={v.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 mt-4 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 
                      text-white text-center py-3 px-5 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl group-hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                      Regarder sur YouTube
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}

export default Sports;
