import { useEffect, useState } from "react";
import { authClient } from "../services/apiClient";

/**
 * Représentation d'un utilisateur côté frontend.
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
 * Statistiques pour l'en-tête de la page.
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

  const [utilisateurSelectionne, setUtilisateurSelectionne] =
    useState<UtilisateurDto | null>(null);

  const [sujetNotif, setSujetNotif] = useState("");
  const [messageNotif, setMessageNotif] = useState("");
  const [envoiNotifEnCours, setEnvoiNotifEnCours] = useState(false);

  /**
   * Charge la liste des utilisateurs depuis le microservice d'authentification.
   * Adapter l'URL selon les routes définies dans le backend.
   */
  async function chargerUtilisateurs() {
    try {
      setChargement(true);
      setErreur(null);

      // Exemple d'endpoint backend : GET /auth/admin/users
      const data = await authClient.get<UtilisateurDto[]>("/admin/users");

      setUtilisateurs(data);

      const total = data.length;
      const actifs = data.filter((u) => u.is_active).length;
      const admins = data.filter((u) => u.is_admin).length;

      setStats({ total, actifs, admins });
    } catch (e: any) {
      setErreur(
        String(
          e?.message ||
            e?.detail ||
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
   * Filtre les utilisateurs par nom ou email côté client.
   */
  const utilisateursFiltres = utilisateurs.filter((u) => {
    if (!filtre.trim()) return true;
    const f = filtre.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(f) ||
      u.email.toLowerCase().includes(f)
    );
  });

  /**
   * Met à jour les champs is_active et/ou is_admin pour un utilisateur.
   * Adapter l'URL selon l'API (PUT /admin/users/{id}, etc.).
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

      const total = listeMaj.length;
      const actifs = listeMaj.filter((u) => u.is_active).length;
      const admins = listeMaj.filter((u) => u.is_admin).length;
      setStats({ total, actifs, admins });
    } catch (e: any) {
      setErreur(
        String(
          e?.message ||
            e?.detail ||
            "Erreur lors de la mise à jour de l'utilisateur."
        )
      );
    }
  }

  /**
   * Envoie une notification à l'utilisateur sélectionné.
   * Adapter l'URL selon l'API (POST /admin/users/{id}/notify, etc.).
   */
  async function envoyerNotification() {
    if (!utilisateurSelectionne) return;
    if (!sujetNotif.trim() || !messageNotif.trim()) {
      setErreur("Le sujet et le message de la notification sont requis.");
      return;
    }

    try {
      setEnvoiNotifEnCours(true);
      setErreur(null);

      await authClient.post(`/admin/users/${utilisateurSelectionne.id}/notify`, {
        subject: sujetNotif,
        message: messageNotif,
      });

      setSujetNotif("");
      setMessageNotif("");
    } catch (e: any) {
      setErreur(
        String(
          e?.message ||
            e?.detail ||
            "Erreur lors de l'envoi de la notification."
        )
      );
    } finally {
      setEnvoiNotifEnCours(false);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* En-tête de page */}
      <section className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-slate-900">
          Espace administrateur
        </h1>
        <p className="text-sm text-slate-600">
          Gestion des utilisateurs de SportConnectIA et envoi de notifications.
        </p>
      </section>

      {/* Barre de recherche et bouton d'actualisation */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          className="w-full md:max-w-md rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
        />

        <button
          type="button"
          onClick={chargerUtilisateurs}
          className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-sky-600 transition shadow-lg"
        >
          Actualiser
        </button>
      </section>

      {/* Cartes de statistiques avec une palette proche de la page d'accueil */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total utilisateurs */}
        <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-5 shadow-sm">
          <p className="text-xs font-medium uppercase text-slate-500">
            Utilisateurs
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.total}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Total des utilisateurs enregistrés
          </p>
        </div>

        {/* Comptes actifs */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-sky-500/10 px-4 py-5 shadow-sm">
          <p className="text-xs font-medium uppercase text-slate-600">
            Comptes actifs
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.actifs}
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Utilisateurs pouvant se connecter
          </p>
        </div>

        {/* Administrateurs */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-500/5 via-purple-500/5 to-fuchsia-500/5 px-4 py-5 shadow-sm">
          <p className="text-xs font-medium uppercase text-slate-500">
            Administrateurs
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats.admins}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Comptes avec accès administrateur
          </p>
        </div>
      </section>

      {/* Tableau et panneau latéral */}
      <section className="grid grid-cols-1 lg:grid-cols-[2fr,1.2fr] gap-6 items-start">
        {/* Tableau des utilisateurs */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-sm">
          <div className="border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-800">
              Utilisateurs enregistrés
            </h2>
            <p className="text-xs text-slate-500">
              Cliquez sur une ligne pour afficher ou modifier les informations.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase text-slate-500">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3 text-center">Actif</th>
                  <th className="px-4 py-3 text-center">Admin</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {utilisateursFiltres.map((u) => (
                  <tr
                    key={u.id}
                    className={`border-t border-slate-100 hover:bg-slate-50 cursor-pointer ${
                      u.id === utilisateurSelectionne?.id ? "bg-sky-50" : ""
                    }`}
                    onClick={() => setUtilisateurSelectionne(u)}
                  >
                    <td className="px-4 py-2 text-xs text-slate-500">
                      {u.id}
                    </td>
                    <td className="px-4 py-2 text-slate-800">
                      {u.name || "(Sans nom)"}
                    </td>
                    <td className="px-4 py-2 text-slate-700">{u.email}</td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={u.is_active}
                        onChange={(e) =>
                          mettreAJourUtilisateur(u.id, {
                            is_active: e.target.checked,
                          })
                        }
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={u.is_admin}
                        onChange={(e) =>
                          mettreAJourUtilisateur(u.id, {
                            is_admin: e.target.checked,
                          })
                        }
                      />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                        onClick={() => setUtilisateurSelectionne(u)}
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}

                {utilisateursFiltres.length === 0 && !chargement && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-sm text-slate-500"
                    >
                      Aucun utilisateur ne correspond au filtre.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {chargement && (
            <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
              Chargement des données...
            </div>
          )}

          {erreur && (
            <div className="border-t border-rose-100 bg-rose-50 px-4 py-3 text-xs text-rose-700">
              {erreur}
            </div>
          )}
        </div>

        {/* Panneau latéral : détails et notification */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800">
              Détails de l'utilisateur
            </h2>

            {utilisateurSelectionne ? (
              <div className="mt-3 space-y-1 text-sm text-slate-700">
                <p>
                  <span className="font-medium">Nom : </span>
                  {utilisateurSelectionne.name || "(Sans nom)"}
                </p>
                <p>
                  <span className="font-medium">Email : </span>
                  {utilisateurSelectionne.email}
                </p>
                <p>
                  <span className="font-medium">Actif : </span>
                  {utilisateurSelectionne.is_active ? "Oui" : "Non"}
                </p>
                <p>
                  <span className="font-medium">Administrateur : </span>
                  {utilisateurSelectionne.is_admin ? "Oui" : "Non"}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                Sélectionnez un utilisateur dans le tableau pour afficher ses
                informations.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-800">
              Envoyer une notification
            </h2>

            {utilisateurSelectionne ? (
              <div className="mt-3 space-y-3">
                <p className="text-xs text-slate-500">
                  Notification destinée à{" "}
                  <span className="font-medium">
                    {utilisateurSelectionne.email}
                  </span>
                  .
                </p>

                <input
                  type="text"
                  placeholder="Sujet de la notification"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                  value={sujetNotif}
                  onChange={(e) => setSujetNotif(e.target.value)}
                />

                <textarea
                  rows={4}
                  placeholder="Message à envoyer à l'utilisateur..."
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                  value={messageNotif}
                  onChange={(e) => setMessageNotif(e.target.value)}
                />

                <button
                  type="button"
                  disabled={envoiNotifEnCours}
                  onClick={envoyerNotification}
                  className="w-full rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-sky-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-sky-600 disabled:opacity-60 shadow-lg"
                >
                  {envoiNotifEnCours
                    ? "Envoi en cours..."
                    : "Envoyer la notification"}
                </button>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                Sélectionnez d'abord un utilisateur pour envoyer un message.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
