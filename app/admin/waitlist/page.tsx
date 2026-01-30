"use client";

import { useState } from "react";

// Types simples
type User = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  unsubscribed_at: string | null;
};

export default function AdminBroadcastPage() {
  // --- ÉTAT DE SÉCURITÉ ---
  // On ne charge rien tant que l'admin n'a pas mis sa clé
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // État du mail
  const [subject, setSubject] = useState("Nouveautés JobTrackAI 🚀");
  const [htmlContent, setHtmlContent] = useState(
    `<div style="background-color: #f5f5f7; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 0;">
  
  <div style="max-w: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
    
    <div style="padding: 30px 40px; border-bottom: 1px solid #f0f0f0; text-align: center;">
      <div style="display: inline-block; width: 40px; height: 40px; background-color: #000000; color: #ffffff; border-radius: 8px; line-height: 40px; font-weight: bold; font-size: 20px;">J</div>
      <span style="display: block; margin-top: 10px; font-weight: 700; font-size: 18px; color: #000000;">JobTrackAI</span>
    </div>

    <div style="padding: 40px;">
      
      <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 800; color: #111111; line-height: 1.3;">
        Bonjour {{NAME}},<br>
        <span style="color: #ff9f43;">La recherche d'emploi change aujourd'hui.</span>
      </h1>

      <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 25px;">
        Fini les feuilles de calcul Excel interminables et les emails perdus. Nous sommes ravis de vous annoncer le lancement officiel de <strong>JobTrackAI</strong>.
      </p>

      <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 30px;">
        Connectez votre boîte mail (Gmail ou Outlook), lancez un scan intelligent, et regardez votre tableau de bord se remplir automatiquement avec vos candidatures, triées et analysées par notre IA.
      </p>

      <div style="text-align: center; margin-bottom: 40px;">
        <a href="https://jobtrackai-three.vercel.app/" style="background-color: #ff9f43; color: #000000; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(255, 159, 67, 0.2);">
          Accéder à mon Dashboard
        </a>
      </div>

      <div style="background-color: #fafafa; border-radius: 12px; padding: 20px; border: 1px solid #eeeeee;">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #888888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">À tester dès maintenant :</p>
        <ul style="padding-left: 20px; margin: 0; color: #444444; font-size: 15px; line-height: 1.6;">
          <li><strong>Smart Scan :</strong> Récupérez vos candidatures des 90 derniers jours.</li>
          <li><strong>Suivi automatique :</strong> Vos statuts (Refus, Entretien) mis à jour sans effort.</li>
          <li><strong>Sécurisé :</strong> Vos données restent privées.</li>
        </ul>
      </div>

    </div>

    <div style="background-color: #f9f9f9; padding: 20px 40px; text-align: center; border-top: 1px solid #eeeeee;">
      <p style="font-size: 12px; color: #999999; margin: 0 0 10px 0;">
        Propulsé par l'IA • Fait avec passion
      </p>
      <p style="font-size: 12px; color: #bbbbbb; margin: 0;">
        Vous ne souhaitez plus recevoir ces emails ? <a href="{{UNSUBSCRIBE_LINK}}" style="color: #ff9f43; text-decoration: underline;">Se désinscrire</a>
      </p>
    </div>

  </div>
</div>`,
  );

  // État de la modale
  const [modalOpen, setModalOpen] = useState(false);
  const [targetMode, setTargetMode] = useState<"single" | "all">("single");
  const [targetEmail, setTargetEmail] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  // --- 1. FONCTION DE CHARGEMENT ---
  const fetchUsers = async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/broadcast", {
        headers: { "x-admin-secret": key },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setIsAuthenticated(true); // La clé est bonne, on débloque l'interface
      } else {
        alert("Clé Admin incorrecte ❌");
        setIsAuthenticated(false);
      }
    } catch {
      console.error("An error occurred");
      alert("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  // Gestionnaire de connexion
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey.trim()) {
      fetchUsers(adminKey);
    }
  };

  // --- 2. FONCTIONS UI ---
  const handleSendSingle = (email: string) => {
    setTargetMode("single");
    setTargetEmail(email);
    setConfirmInput("");
    setModalOpen(true);
  };

  const handleSendAll = () => {
    setTargetMode("all");
    setTargetEmail(null);
    setConfirmInput("");
    setModalOpen(true);
  };

  // --- 3. ENVOI ---
  const executeSend = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminKey, // On utilise la clé du state
        },
        body: JSON.stringify({
          mode: targetMode,
          targetEmail: targetEmail,
          subject,
          htmlContent,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        alert(`Succès ! Envoyé: ${result.sent}, Échecs: ${result.failed}`);
        setModalOpen(false);
      } else {
        alert("Erreur: " + result.error);
      }
    } catch (e) {
      alert("Erreur réseau: " + e);
    } finally {
      setSending(false);
    }
  };

  const activeUsersCount = users.filter((u) => !u.unsubscribed_at).length;
  const unsubscribedCount = users.length - activeUsersCount;

  // --- AFFICHAGE : LOCK SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-sm w-full text-center">
          <h1 className="text-2xl font-bold mb-2">🔒 Admin Access</h1>
          <p className="text-gray-500 mb-6 text-sm">
            Entrez la clé secrète pour gérer la waitlist.
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Admin Secret Key"
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Vérification..." : "Déverrouiller"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- AFFICHAGE : DASHBOARD ---
  if (loading) return <div className="p-10">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* COLONNE GAUCHE : LISTE */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-[85vh] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Inscrits ({users.length})</h2>
            <div className="text-xs space-x-2">
              <span className="text-green-600 font-bold">
                {activeUsersCount} actifs
              </span>
              <span className="text-red-400">
                {unsubscribedCount} désinscrits
              </span>
            </div>
          </div>

          <div className="overflow-auto flex-1 border rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-3">Nom</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{u.full_name}</td>
                    <td className="p-3 text-gray-500">{u.email}</td>
                    <td className="p-3">
                      {u.unsubscribed_at ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                          Désinscrit
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          Actif
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {!u.unsubscribed_at && (
                        <button
                          onClick={() => handleSendSingle(u.email)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          Envoyer Test
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* COLONNE DROITE : ÉDITEUR */}
        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Composer l&apos;email</h2>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Sujet
              </label>
              <input
                type="text"
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 mb-1">
                Contenu HTML
              </label>
              <p className="text-xs text-gray-400 mb-2">
                <code>{"{{NAME}}"}</code> = Nom,{" "}
                <code>{"{{UNSUBSCRIBE_LINK}}"}</code> = Lien Désinscription.
              </p>
              <textarea
                className="w-full border p-2 rounded h-40 font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
              />
            </div>

            <button
              onClick={handleSendAll}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all active:scale-95"
            >
              🚀 Envoyer à TOUS les actifs ({activeUsersCount})
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Live Preview
            </h2>
            <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg p-4 overflow-auto bg-gray-50">
              <div
                className="prose max-w-none text-sm"
                dangerouslySetInnerHTML={{
                  __html: htmlContent
                    .replace(/{{NAME}}/g, "Jean Dupont")
                    .replace(/{{UNSUBSCRIBE_LINK}}/g, "#"),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MODALE DE CONFIRMATION */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              ⚠️ Confirmation
            </h3>
            <p className="text-gray-600 mb-6">
              Envoyer à :{" "}
              <strong className="text-black">
                {targetMode === "all"
                  ? `TOUS (${activeUsersCount} personnes)`
                  : targetEmail}
              </strong>
            </p>

            {targetMode === "all" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Écrivez{" "}
                  <span className="text-red-600 font-bold">CONFIRMER</span>
                </label>
                <input
                  type="text"
                  className="w-full border p-2 rounded border-red-300"
                  placeholder="CONFIRMER"
                  onChange={(e) => setConfirmInput(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={executeSend}
                disabled={
                  sending ||
                  (targetMode === "all" && confirmInput !== "CONFIRMER")
                }
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {sending ? "Envoi..." : "Confirmer l'envoi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
