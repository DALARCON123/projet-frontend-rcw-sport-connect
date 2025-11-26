// src/pages/AdminUsers.tsx
import React, { useEffect, useState } from "react";
import {
  adminListerUtilisateurs,
  adminModifierUtilisateur,
  adminEnvoyerNotification,
  type UtilisateurDto,
} from "../services/authService";

/**
 * Page d’administration des utilisateurs :
 * - liste des utilisateurs
 * - édition (nom, email, actif, admin, mot de passe)
 * - envoi de notifications
 */
const AdminUsers: React.FC = () => {
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurDto[]>([]);
  const [selection, setSelection] = useState<UtilisateurDto | null>(null);
  const [chargement, setChargement] = useState(false);
  const [messageInfo, setMessageInfo] = useState<string | null>(null);
  const [messageErreur, setMessageErreur] = useState<string | null>(null);

  // Champs du formulaire d’édition
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [actif, setActif] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState("");

  // Champs pour la notification
  const [titreNotif, setTitreNotif] = useState("");
  const [messageNotif, setMessageNotif] = useState("");

  // Charger la liste des utilisateurs
  useEffect(() => {
    const charger = async () => {
      try {
        setChargement(true);
        setMessageErreur(null);
        const data = await adminListerUtilisateurs();
        setUtilisateurs(data);
      } catch (err) {
        console.error(err);
        setMessageErreur(
          "Impossible de charger la liste des utilisateurs. Vérifiez que vous êtes connecté(e) en tant qu’administrateur."
        );
      } finally {
        setChargement(false);
      }
    };

    charger();
  }, []);

  // Sélectionner un utilisateur dans la liste
  const handleSelect = (user: UtilisateurDto) => {
    setSelection(user);
    setNom(user.name || "");
    setEmail(user.email);
    setActif(user.is_active);
    setAdmin(user.is_admin);
    setNouveauMotDePasse("");
    setTitreNotif("");
    setMessageNotif("");
    setMessageInfo(null);
    setMessageErreur(null);
  };

  // Sauvegarder les modifications
  const handleSave = async () => {
    if (!selection) return;

    try {
      setChargement(true);
      setMessageInfo(null);
      setMessageErreur(null);

      await adminModifierUtilisateur(selection.id, {
        name: nom,
        email,
        is_active: actif,
        is_admin: admin,
        new_password: nouveauMotDePasse || undefined,
      });

      // Recharger la liste à jour
      const updatedList = await adminListerUtilisateurs();
      setUtilisateurs(updatedList);
      const refreshed =
        updatedList.find(
          (u: UtilisateurDto) => u.id === selection.id
        ) || null;
      setSelection(refreshed);

      setMessageInfo("Modifications enregistrées avec succès.");
      setNouveauMotDePasse("");
    } catch (err) {
      console.error(err);
      setMessageErreur(
        "Erreur lors de l’enregistrement des modifications de l’utilisateur."
      );
    } finally {
      setChargement(false);
    }
  };

  // Envoyer une notification
  const handleSendNotification = async () => {
    if (!selection) return;

    if (!titreNotif.trim() || !messageNotif.trim()) {
      setMessageErreur(
        "Le titre et le message de la notification sont obligatoires."
      );
      return;
    }

    try {
      setChargement(true);
      setMessageInfo(null);
      setMessageErreur(null);

      await adminEnvoyerNotification(
        selection.id,
        titreNotif.trim(),
        messageNotif.trim()
      );

      setMessageInfo("Notification envoyée avec succès.");
      setTitreNotif("");
      setMessageNotif("");
    } catch (err) {
      console.error(err);
      setMessageErreur("Erreur lors de l’envoi de la notification.");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Bandeau supérieur */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Espace administrateur
            </h1>
            <p className="text-xs text-slate-500">
              Gestion des utilisateurs et des notifications SportConnectIA.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {messageInfo && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {messageInfo}
          </div>
        )}
        {messageErreur && (
          <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {messageErreur}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2 items-start">
          {/* Tableau des utilisateurs */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Utilisateurs enregistrés
                </h2>
                <p className="text-xs text-slate-500">
                  Cliquez sur un utilisateur pour afficher ses détails.
                </p>
              </div>
              {chargement && (
                <span className="text-xs text-slate-400">
                  Chargement en cours…
                </span>
              )}
            </div>

            <div className="overflow-auto max-h-[480px]">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-slate-500">
                      ID
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-500">
                      Nom
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-slate-500">
                      Email
                    </th>
                    <th className="px-3 py-2 text-center font-medium text-slate-500">
                      Actif
                    </th>
                    <th className="px-3 py-2 text-center font-medium text-slate-500">
                      Admin
                    </th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {utilisateurs.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 py-6 text-center text-slate-400"
                      >
                        Aucun utilisateur pour le moment.
                      </td>
                    </tr>
                  )}

                  {utilisateurs.map((u: UtilisateurDto) => (
                    <tr
                      key={u.id}
                      className={`border-b border-slate-100 text-slate-700 ${
                        selection?.id === u.id
                          ? "bg-indigo-50/80"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <td className="px-3 py-2">{u.id}</td>
                      <td className="px-3 py-2">
                        {u.name || (
                          <span className="text-slate-400">Sans nom</span>
                        )}
                      </td>
                      <td className="px-3 py-2">{u.email}</td>
                      <td className="px-3 py-2 text-center">
                        {u.is_active ? "✅" : "⛔"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {u.is_admin ? "⭐" : "—"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => handleSelect(u)}
                          className="inline-flex items-center rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-indigo-500"
                        >
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Panneau de droite : édition + notification */}
          <section className="space-y-4">
            {/* Carte édition utilisateur */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Détails de l’utilisateur
              </h2>

              {!selection ? (
                <p className="text-xs text-slate-500">
                  Sélectionnez un utilisateur dans le tableau pour afficher et
                  modifier ses informations.
                </p>
              ) : (
                <>
                  <div className="space-y-2 text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="text-slate-600">Nom complet</label>
                      <input
                        className="rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-slate-600">
                        Adresse courriel
                      </label>
                      <input
                        className="rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-4 items-center pt-1">
                      <label className="flex items-center gap-2 text-slate-600">
                        <input
                          type="checkbox"
                          checked={actif}
                          onChange={(e) => setActif(e.target.checked)}
                        />
                        <span>Compte actif</span>
                      </label>
                      <label className="flex items-center gap-2 text-slate-600">
                        <input
                          type="checkbox"
                          checked={admin}
                          onChange={(e) => setAdmin(e.target.checked)}
                        />
                        <span>Administrateur</span>
                      </label>
                    </div>

                    <div className="flex flex-col gap-1 pt-1">
                      <label className="text-slate-600">
                        Nouveau mot de passe (optionnel)
                      </label>
                      <input
                        type="password"
                        className="rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={nouveauMotDePasse}
                        onChange={(e) =>
                          setNouveauMotDePasse(e.target.value)
                        }
                        placeholder="Laisser vide pour ne pas modifier"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSave}
                      disabled={chargement}
                      className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
                    >
                      {chargement
                        ? "Enregistrement…"
                        : "Enregistrer les modifications"}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Carte notification */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Envoyer une notification
              </h2>

              {!selection ? (
                <p className="text-xs text-slate-500">
                  Sélectionnez un utilisateur pour lui envoyer une notification.
                </p>
              ) : (
                <>
                  <p className="text-[11px] text-slate-500">
                    Notification destinée à :{" "}
                    <span className="font-semibold text-slate-800">
                      {selection.email}
                    </span>
                  </p>

                  <div className="flex flex-col gap-1 text-xs">
                    <label className="text-slate-600">Titre</label>
                    <input
                      className="rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={titreNotif}
                      onChange={(e) => setTitreNotif(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1 text-xs">
                    <label className="text-slate-600">Message</label>
                    <textarea
                      className="rounded-xl border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                      value={messageNotif}
                      onChange={(e) => setMessageNotif(e.target.value)}
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSendNotification}
                      disabled={chargement}
                      className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
                    >
                      {chargement ? "Envoi…" : "Envoyer la notification"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
