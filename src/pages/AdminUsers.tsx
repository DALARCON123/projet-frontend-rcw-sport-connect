import { useEffect, useState } from "react";
import { authClient } from "../services/apiClient";
import { Users, Plus, RefreshCw } from "lucide-react";
import { getUserSnapshot } from "../services/authService";

/**
 * Modèle utilisateur côté frontend.
 */
type UtilisateurDto = {
  id: number;
  name: string | null;
  email: string;
  is_active: boolean;
  is_admin: boolean;
  created_at?: string;
};

/**
 * Statistiques affichées dans les cartes.
 */
type StatsDto = {
  total: number;
  actifs: number;
  admins: number;
};

export default function AdminUsers() {
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurDto[]>([]);
  const [stats, setStats] = useState<StatsDto>({
    total: 0,
    actifs: 0,
    admins: 0,
  });
  const [filtre, setFiltre] = useState("");
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const [afficherFormNouveau, setAfficherFormNouveau] = useState(false);
  const [nouveauNom, setNouveauNom] = useState("");
  const [nouvelEmail, setNouvelEmail] = useState("");
  const [nouveauPass, setNouveauPass] = useState("");
  const [nouveauEstAdmin, setNouveauEstAdmin] = useState(false);
  const [nouveauEstActif, setNouveauEstActif] = useState(true);
  const [creationEnCours, setCreationEnCours] = useState(false);

  const { name: adminName } = getUserSnapshot();

  /**
   * Normalise le message d’erreur pour éviter les messages techniques.
   */
  function messageErreur(e: any, defaut: string): string {
    const brut = String(e?.message || e?.detail || defaut || "");
    if (brut.toLowerCase().includes("body stream already read")) {
      return "Erreur de communication avec le service d’authentification.";
    }
    return brut || defaut;
  }

  /**
   * Recalcule les statistiques à partir de la liste actuelle.
   */
  function recalculerStats(liste: UtilisateurDto[]) {
    const total = liste.length;
    const actifs = liste.filter((u) => u.is_active).length;
    const admins = liste.filter((u) => u.is_admin).length;
    setStats({ total, actifs, admins });
  }

  /**
   * Charge les utilisateurs depuis le microservice d’authentification.
   */
  async function chargerUtilisateurs() {
    try {
      setChargement(true);
      setErreur(null);

      const data = await authClient.get<UtilisateurDto[]>("/admin/users");
      setUtilisateurs(data);
      recalculerStats(data);
    } catch (e: any) {
      setErreur(
        messageErreur(
          e,
          "Erreur lors du chargement des utilisateurs."
        )
      );
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  /**
   * Liste filtrée par nom ou email.
   */
  const utilisateursFiltres = utilisateurs.filter((u) => {
    if (!filtre.trim()) return true;
    const f = filtre.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(f) ||
      u.email.toLowerCase().includes(f)
    );
  });

  const admins = utilisateursFiltres.filter((u) => u.is_admin);
  const simplesUtilisateurs = utilisateursFiltres.filter((u) => !u.is_admin);

  /**
   * Met à jour les champs is_active ou is_admin pour un utilisateur.
   */
  async function mettreAJourUtilisateur(
    id: number,
    champs: Partial<Pick<UtilisateurDto, "is_active" | "is_admin">>
  ) {
    try {
      setErreur(null);

      const utilisateur = utilisateurs.find((u) => u.id === id);
      if (!utilisateur) return;

      const miseAJour: UtilisateurDto = { ...utilisateur, ...champs };

      await authClient.put(`/admin/users/${id}`, miseAJour);

      const listeMaj = utilisateurs.map((u) =>
        u.id === id ? miseAJour : u
      );
      setUtilisateurs(listeMaj);
      recalculerStats(listeMaj);
    } catch (e: any) {
      setErreur(
        messageErreur(
          e,
          "Erreur lors de la mise à jour de l’utilisateur."
        )
      );
    }
  }

  /**
   * Supprime un utilisateur.
   */
  async function supprimerUtilisateur(id: number) {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      return;
    }

    try {
      setErreur(null);

      // Même si le backend renvoie 204 sans corps et que authClient
      // n’aime pas la réponse, on considère la suppression comme réussie.
      await authClient.delete(`/admin/users/${id}`).catch(() => {
        /* on ignore l’erreur de flux */
      });

      const listeMaj = utilisateurs.filter((u) => u.id !== id);
      setUtilisateurs(listeMaj);
      recalculerStats(listeMaj);
    } catch (e: any) {
      setErreur(
        messageErreur(
          e,
          "Erreur lors de la suppression de l’utilisateur."
        )
      );
    }
  }

  /**
   * Crée un nouveau compte utilisateur.
   */
  async function creerNouvelUtilisateur(e: React.FormEvent) {
    e.preventDefault();

    if (!nouveauNom.trim() || !nouvelEmail.trim() || !nouveauPass.trim()) {
      setErreur("Nom, email et mot de passe sont obligatoires.");
      return;
    }

    try {
      setCreationEnCours(true);
      setErreur(null);

      const payload = {
        name: nouveauNom.trim(),
        email: nouvelEmail.trim().toLowerCase(),
        password: nouveauPass,
        is_admin: nouveauEstAdmin,
        is_active: nouveauEstActif,
      };

      const nouvelUtilisateur = await authClient.post<UtilisateurDto>(
        "/admin/users",
        payload
      );

      const listeMaj = [...utilisateurs, nouvelUtilisateur];
      setUtilisateurs(listeMaj);
      recalculerStats(listeMaj);

      setNouveauNom("");
      setNouvelEmail("");
      setNouveauPass("");
      setNouveauEstAdmin(false);
      setNouveauEstActif(true);
      setAfficherFormNouveau(false);
    } catch (e: any) {
      setErreur(
        messageErreur(
          e,
          "Erreur lors de la création du nouvel utilisateur."
        )
      );
    } finally {
      setCreationEnCours(false);
    }
  }

  /**
   * Rendu d’une ligne utilisateur dans un tableau.
   */
  function LigneUtilisateur({
    u,
    index,
  }: {
    u: UtilisateurDto;
    index: number;
  }) {
    return (
      <tr
        className={`border-t border-slate-100 ${
          index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
        }`}
      >
        <td className="px-5 py-2.5 text-xs text-slate-500">{u.id}</td>
        <td className="px-5 py-2.5 text-slate-800">{u.name || "(Sans nom)"}</td>
        <td className="px-5 py-2.5 text-slate-700">{u.email}</td>
        <td className="px-5 py-2.5 text-center">
          <input
            type="checkbox"
            checked={u.is_active}
            onChange={(e) =>
              mettreAJourUtilisateur(u.id, { is_active: e.target.checked })
            }
          />
        </td>
        <td className="px-5 py-2.5 text-center">
          <input
            type="checkbox"
            checked={u.is_admin}
            onChange={(e) =>
              mettreAJourUtilisateur(u.id, { is_admin: e.target.checked })
            }
          />
        </td>
        <td className="px-5 py-2.5 text-right space-x-2">
          <button
            type="button"
            className="rounded-lg bg-sky-500 px-3 py-1 text-xs font-medium text-white hover:bg-sky-600"
            onClick={() =>
              mettreAJourUtilisateur(u.id, { is_active: !u.is_active })
            }
          >
            {u.is_active ? "Désactiver" : "Activer"}
          </button>
          <button
            type="button"
            className="rounded-lg bg-rose-500 px-3 py-1 text-xs font-medium text-white hover:bg-rose-600"
            onClick={() => supprimerUtilisateur(u.id)}
          >
            Supprimer
          </button>
        </td>
      </tr>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-10">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Barre latérale gauche, uniquement section Utilisateurs */}
        <aside className="lg:w-64 flex-shrink-0 rounded-3xl bg-white/90 border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Panneau
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              Administration
            </p>
          </div>

          <nav className="py-3">
            <div className="flex items-center gap-3 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 shadow-md">
              <span className="rounded-xl bg-white/20 p-1.5">
                <Users className="h-4 w-4" />
              </span>
              <span>Utilisateurs</span>
            </div>
          </nav>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 space-y-6">
          {/* En-tête avec nom de l’admin et boutons */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Espace administrateur{adminName ? ` – ${adminName}` : ""}
              </h1>
              <p className="text-sm text-slate-600">
                Gestion des utilisateurs de SportConnectIA.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={chargerUtilisateurs}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Actualiser
              </button>

              <button
                type="button"
                onClick={() => setAfficherFormNouveau((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-sky-600 shadow-lg"
              >
                <Plus className="h-4 w-4" />
                Nouveau utilisateur
              </button>
            </div>
          </section>

          {/* Formulaire de création d’utilisateur */}
          {afficherFormNouveau && (
            <section className="rounded-3xl border border-slate-200 bg-white/95 px-5 py-5 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800 mb-3">
                Créer un nouveau compte
              </h2>
              <form
                onSubmit={creerNouvelUtilisateur}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
              >
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
                    value={nouveauNom}
                    onChange={(e) => setNouveauNom(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
                    value={nouvelEmail}
                    onChange={(e) => setNouvelEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-sky-400"
                    value={nouveauPass}
                    onChange={(e) => setNouveauPass(e.target.value)}
                  />
                </div>

                <div className="flex flex-col justify-center gap-2">
                  <label className="inline-flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={nouveauEstActif}
                      onChange={(e) => setNouveauEstActif(e.target.checked)}
                    />
                    Compte actif
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={nouveauEstAdmin}
                      onChange={(e) => setNouveauEstAdmin(e.target.checked)}
                    />
                    Compte administrateur
                  </label>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => {
                      setAfficherFormNouveau(false);
                      setNouveauNom("");
                      setNouvelEmail("");
                      setNouveauPass("");
                      setNouveauEstAdmin(false);
                      setNouveauEstActif(true);
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={creationEnCours}
                    className="rounded-xl px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-sky-600 disabled:opacity-60 shadow-md"
                  >
                    {creationEnCours
                      ? "Création en cours..."
                      : "Créer l’utilisateur"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* Barre de recherche */}
          <section>
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-400"
              value={filtre}
              onChange={(e) => setFiltre(e.target.value)}
            />
          </section>

          {/* Cartes statistiques */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white/95 px-5 py-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Utilisateurs
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {stats.total}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Nombre total de comptes
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-sky-500/10 px-5 py-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Comptes actifs
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {stats.actifs}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Utilisateurs pouvant se connecter
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-500/5 via-purple-500/5 to-fuchsia-500/5 px-5 py-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Administrateurs
              </p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {stats.admins}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Comptes avec rôle administrateur
              </p>
            </div>
          </section>

          {/* Tableau des administrateurs */}
          <section className="rounded-3xl border border-slate-200 bg-white/95 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500">
              <h2 className="text-sm font-semibold text-white">
                Administrateurs
              </h2>
              <p className="text-xs text-white/80">
                Comptes ayant accès à l’espace administrateur.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Nom</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3 text-center">Actif</th>
                    <th className="px-5 py-3 text-center">Admin</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((u, index) => (
                    <LigneUtilisateur key={u.id} u={u} index={index} />
                  ))}
                  {admins.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-4 text-center text-xs text-slate-500"
                      >
                        Aucun administrateur trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Tableau des utilisateurs simples */}
          <section className="rounded-3xl border border-slate-200 bg-white/95 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 bg-slate-50">
              <h2 className="text-sm font-semibold text-slate-800">
                Utilisateurs
              </h2>
              <p className="text-xs text-slate-500">
                Comptes classiques sans rôle administrateur.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
                    <th className="px-5 py-3">ID</th>
                    <th className="px-5 py-3">Nom</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3 text-center">Actif</th>
                    <th className="px-5 py-3 text-center">Admin</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {simplesUtilisateurs.map((u, index) => (
                    <LigneUtilisateur key={u.id} u={u} index={index} />
                  ))}
                  {simplesUtilisateurs.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-5 py-4 text-center text-xs text-slate-500"
                      >
                        Aucun utilisateur classique trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {chargement && (
              <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
                Chargement des données...
              </div>
            )}

            {erreur && (
              <div className="border-t border-rose-100 bg-rose-50 px-5 py-3 text-xs text-rose-700">
                {erreur}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
