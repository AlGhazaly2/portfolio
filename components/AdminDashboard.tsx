import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderPlus,
  GraduationCap,
  MessageSquare,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Briefcase,
  Loader2,
  Upload,
  CheckCircle2,
  Code2,
  Languages,
  Heart,
  FileText,
  User,
  ArrowLeft,
  Database
} from 'lucide-react';


interface AdminDashboardProps {
  onLogout: () => void;
}

const API_BASE = '/api';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'projects' | 'education' | 'experiences' | 'messages' | 'skills' | 'languages' | 'interests' | 'cv'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Data states
  const [profileData, setProfileData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);
  const [cvInfo, setCvInfo] = useState<any>(null);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [cvMessage, setCvMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [stats, setStats] = useState({ projects: 0, education: 0, messages: 0 });

  // Form states
  const [formData, setFormData] = useState<any>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message?: string }>({ connected: false });

  useEffect(() => {
    checkSystemStatus();
  }, []);

  const checkSystemStatus = async () => {
    try {
      const res = await fetch('/api/admin/status');
      const data = await res.json();
      setDbStatus(data);
    } catch (e) {
      setDbStatus({ connected: false, message: 'API unreachable' });
    }
  };


  // Load data on tab change
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'profile':
          const profileRes = await fetch(`${API_BASE}/profile`);
          const profile = await profileRes.json();
          setProfileData(profile);
          setFormData(profile);
          break;
        case 'projects':
          const projRes = await fetch(`${API_BASE}/projects`);
          const projData = await projRes.json();
          setProjects(projData);
          break;
        case 'education':
          const eduRes = await fetch(`${API_BASE}/education`);
          const eduData = await eduRes.json();
          setEducation(eduData);
          break;
        case 'experiences':
          const expRes = await fetch(`${API_BASE}/experiences`);
          const expData = await expRes.json();
          setExperiences(expData);
          break;
        case 'messages':
          const msgRes = await fetch(`${API_BASE}/messages`);
          const msgData = await msgRes.json();
          setMessages(msgData);
          break;
        case 'skills':
          const skillsRes = await fetch(`${API_BASE}/skills`);
          const skillsData = await skillsRes.json();
          setSkills(skillsData);
          break;
        case 'languages':
          const langRes = await fetch(`${API_BASE}/languages`);
          const langData = await langRes.json();
          setLanguages(langData);
          break;
        case 'interests':
          const intRes = await fetch(`${API_BASE}/interests`);
          const intData = await intRes.json();
          setInterests(intData);
          break;
        case 'cv':
          await loadCvInfo();
          break;
        case 'stats':
          await loadStats();
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const [projRes, eduRes, msgRes] = await Promise.all([
        fetch(`${API_BASE}/projects`),
        fetch(`${API_BASE}/education`),
        fetch(`${API_BASE}/messages`)
      ]);

      const projData = await projRes.json();
      const eduData = await eduRes.json();
      const msgData = await msgRes.json();

      setStats({
        projects: projData.length,
        education: eduData.length,
        messages: msgData.filter((m: any) => !m.is_read).length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadCvInfo = async () => {
    try {
      const response = await fetch('/api/cv/current');
      const data = await response.json();
      setCvInfo(data.exists ? data : null);
    } catch (error) {
      console.error('Error loading CV info:', error);
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setCvMessage({ type: 'error', text: 'Seuls les fichiers PDF sont acceptés' });
      setTimeout(() => setCvMessage(null), 3000);
      return;
    }

    setUploadingCv(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await fetch('/api/cv/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer admin-secret-token' },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setCvMessage({ type: 'success', text: 'CV uploadé avec succès!' });
        await loadCvInfo();
      } else {
        setCvMessage({ type: 'error', text: data.error || 'Erreur lors de l\'upload' });
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      setCvMessage({ type: 'error', text: 'Erreur lors de l\'upload' });
    } finally {
      setUploadingCv(false);
      setTimeout(() => setCvMessage(null), 3000);
    }
  };

  const handleCvDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer le CV ?')) return;

    try {
      const response = await fetch('/api/cv/delete', {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer admin-secret-token' }
      });

      const data = await response.json();
      if (data.success) {
        setCvMessage({ type: 'success', text: 'CV supprimé avec succès!' });
        setCvInfo(null);
      } else {
        setCvMessage({ type: 'error', text: data.error || 'Erreur lors de la suppression' });
      }
    } catch (error) {
      console.error('Error deleting CV:', error);
      setCvMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    } finally {
      setTimeout(() => setCvMessage(null), 3000);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setFormData((prev: any) => ({ ...prev, image_url: data.url }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setProfileData(data.profile);
        setProfileMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      } else {
        console.error('Update failed:', data);
        setProfileMessage({ type: 'error', text: data.error || 'Erreur lors de la mise à jour' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileMessage({ type: 'error', text: 'Erreur serveur. Vérifiez la connexion BDD.' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setProfileMessage(null), 5000);
    }
  };

  const handleInitDB = async () => {
    if (!confirm('Voulez-vous initialiser la base de données ? Cela va créer les tables si elles n\'existent pas. (À faire une fois après déploiement Vercel)')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/init-db`);
      const data = await response.json();

      if (response.ok) {
        alert('Succès: ' + data.message);
        loadData();
      } else {
        alert('Erreur: ' + (data.error || 'Erreur inconnue'));
      }
    } catch (error) {
      alert('Erreur réseau ou serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let endpoint = '';
      let method = editingItem ? 'PUT' : 'POST';
      let body: any = { ...formData };

      if (editingItem) {
        body.id = editingItem.id;
      }

      switch (activeTab) {
        case 'projects':
          endpoint = `${API_BASE}/projects`;
          // Ensure technologies is an array
          if (typeof body.technologies === 'string') {
            body.technologies = body.technologies.split(',').map((t: string) => t.trim());
          }
          break;
        case 'education':
          endpoint = `${API_BASE}/education`;
          break;
        case 'experiences':
          endpoint = `${API_BASE}/experiences`;
          // Ensure description is an array
          if (typeof body.description === 'string') {
            body.description = body.description.split('\n').filter((d: string) => d.trim());
          }
          break;
        case 'skills':
          endpoint = `${API_BASE}/skills`;
          body.level = parseInt(body.level) || 50;
          break;
        case 'languages':
          endpoint = `${API_BASE}/languages`;
          break;
        case 'interests':
          endpoint = `${API_BASE}/interests`;
          break;
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(false);
        setEditingItem(null);
        setFormData({});
        loadData();
      } else {
        alert('Erreur: ' + (data.error || 'Sauvegarde échouée'));
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Erreur réseau ou serveur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, type: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;

    try {
      const endpoint = `${API_BASE}/${type}.php?id=${id}`;
      await fetch(endpoint, { method: 'DELETE' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    const formattedData = { ...item };

    // Format arrays for editing
    if (item.technologies && Array.isArray(item.technologies)) {
      formattedData.technologies = item.technologies.join(', ');
    }
    if (item.description && Array.isArray(item.description)) {
      formattedData.description = item.description.join('\n');
    }

    setFormData(formattedData);
    setShowModal(true);
  };

  const returnToSite = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-800">
          <h1 className="font-black text-xl tracking-tighter flex items-center gap-2">
            ADMIN <span className="text-indigo-400">PANEL</span>
            <div className={`w-3 h-3 rounded-full ${dbStatus.connected ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 animate-pulse'}`} title={dbStatus.connected ? 'Connecté à la BDD' : 'Déconnecté'}></div>
          </h1>
          {!dbStatus.connected && (
            <p className="text-[10px] text-rose-400 mt-2 font-bold uppercase tracking-wider">
              ⚠️ BDD Non Connectée
            </p>
          )}
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'profile' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <User size={20} /> Profil
          </button>
          <div className="h-px bg-slate-800 my-2"></div>
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'stats' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'projects' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <FolderPlus size={20} /> Projets
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'experiences' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Briefcase size={20} /> Expériences
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'education' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <GraduationCap size={20} /> Formations
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'skills' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Code2 size={20} /> Compétences
          </button>
          <button
            onClick={() => setActiveTab('languages')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'languages' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Languages size={20} /> Langues
          </button>
          <button
            onClick={() => setActiveTab('interests')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'interests' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Heart size={20} /> Intérêts
          </button>
          <button
            onClick={() => setActiveTab('cv')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'cv' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <FileText size={20} /> CV
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'messages' ? 'bg-indigo-600' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <MessageSquare size={20} /> Messages
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button onClick={handleInitDB} className="w-full flex items-center gap-4 px-6 py-3 rounded-2xl font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all text-xs uppercase tracking-widest">
            <Database size={16} /> Init DB (Vercel)
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-rose-400 hover:bg-rose-500/10 transition-all">
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-12 overflow-y-auto h-screen">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-900 capitalize flex items-center gap-3">
              {activeTab === 'profile' && <User className="text-indigo-600" size={32} />}
              {activeTab === 'stats' && <LayoutDashboard className="text-indigo-600" size={32} />}
              {activeTab === 'projects' && <FolderPlus className="text-indigo-600" size={32} />}
              {activeTab === 'education' && <GraduationCap className="text-indigo-600" size={32} />}
              {activeTab === 'experiences' && <Briefcase className="text-indigo-600" size={32} />}
              {activeTab === 'messages' && <MessageSquare className="text-indigo-600" size={32} />}
              {activeTab === 'skills' && <Code2 className="text-indigo-600" size={32} />}
              {activeTab === 'languages' && <Languages className="text-indigo-600" size={32} />}
              {activeTab === 'interests' && <Heart className="text-indigo-600" size={32} />}
              {activeTab === 'cv' && <FileText className="text-indigo-600" size={32} />}

              {activeTab === 'profile' ? 'Mon Profil' :
                activeTab === 'stats' ? 'Tableau de bord' : activeTab}
            </h2>
            <p className="text-slate-500 font-medium mt-1">Gérez votre contenu en temps réel</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={returnToSite}
              className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
            >
              <ArrowLeft size={20} /> Retour au site
            </button>

            {(activeTab === 'projects' || activeTab === 'education' || activeTab === 'experiences' || activeTab === 'skills' || activeTab === 'languages' || activeTab === 'interests') && (
              <button
                onClick={openAddModal}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                <Plus size={20} /> Ajouter
              </button>
            )}
          </div>
        </header>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 min-h-[500px]">
          {isLoading && activeTab !== 'profile' ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={40} className="animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
              {activeTab === 'profile' && profileData && (
                <div className="max-w-4xl mx-auto">
                  {profileMessage && (
                    <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${profileMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                      {profileMessage.type === 'success' ? <CheckCircle2 size={20} /> : <X size={20} />}
                      {profileMessage.text}
                    </div>
                  )}

                  <form onSubmit={handleProfileSubmit} className="space-y-8">
                    {/* Image Upload Section */}
                    <div className="flex flex-col items-center justify-center mb-10">
                      <div className="relative group cursor-pointer">
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-slate-100 group-hover:border-indigo-100 transition-all shadow-xl">
                          {formData.image_url ? (
                            <img src={formData.image_url} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                              <User size={60} className="text-slate-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="text-white" size={30} />
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {uploadingImage && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-full">
                            <Loader2 size={30} className="animate-spin text-indigo-600" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-4 font-medium">Cliquez pour changer la photo</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Nom Complet</label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-50 px-6 py-4 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Titre Professionnel</label>
                        <input
                          type="text"
                          value={formData.title || ''}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full bg-slate-50 px-6 py-4 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Sous-titre / Bio</label>
                      <textarea
                        value={formData.subtitle || ''}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        rows={4}
                        className="w-full bg-slate-50 px-6 py-4 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all resize-none font-medium text-slate-600 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Statut Actuel</label>
                      <input
                        type="text"
                        value={formData.status || ''}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        placeholder="Ex: Disponible pour nouveaux projets"
                        className="w-full bg-slate-50 px-6 py-4 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                      />
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-xl shadow-indigo-200 flex items-center gap-3"
                      >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        Enregistrer les modifications
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                        <FolderPlus size={24} />
                      </div>
                      <span className="text-indigo-600 font-black text-4xl">{stats.projects}</span>
                    </div>
                    <p className="text-indigo-900 font-bold">Projets Réalisés</p>
                    <p className="text-indigo-400 text-sm mt-1">Total des projets actifs</p>
                  </div>
                  <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                        <GraduationCap size={24} />
                      </div>
                      <span className="text-emerald-600 font-black text-4xl">{stats.education}</span>
                    </div>
                    <p className="text-emerald-900 font-bold">Formations</p>
                    <p className="text-emerald-400 text-sm mt-1">Parcours académique</p>
                  </div>
                  <div className="p-8 bg-amber-50 rounded-3xl border border-amber-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                        <MessageSquare size={24} />
                      </div>
                      <span className="text-amber-600 font-black text-4xl">{stats.messages}</span>
                    </div>
                    <p className="text-amber-900 font-bold">Nouveaux Messages</p>
                    <p className="text-amber-400 text-sm mt-1">Non lus dans la boîte de réception</p>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest">
                        <th className="pb-6 px-4">Projet</th>
                        <th className="pb-6 px-4">Technologies</th>
                        <th className="pb-6 px-4">Catégorie</th>
                        <th className="pb-6 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {projects.map((project) => (
                        <tr key={project.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="py-6 px-4">
                            <div className="font-bold text-slate-900 text-lg">{project.title}</div>
                            <div className="text-slate-500 text-sm truncate max-w-xs">{project.description}</div>
                          </td>
                          <td className="py-6 px-4">
                            <div className="flex flex-wrap gap-1">
                              {project.technologies?.map((tech: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold border border-slate-200">{tech}</span>
                              ))}
                            </div>
                          </td>
                          <td className="py-6 px-4">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 uppercase tracking-wider">{project.category}</span>
                          </td>
                          <td className="py-6 px-4">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => openEditModal(project)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Modifier">
                                <Edit size={18} />
                              </button>
                              <button onClick={() => handleDelete(project.id, 'projects')} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Supprimer">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'education' && (
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
                          <GraduationCap size={24} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-900">{edu.degree}</h4>
                          <p className="text-slate-500 font-medium">{edu.school}</p>
                          <p className="text-indigo-600 text-xs font-bold mt-1 bg-indigo-50 inline-block px-2 py-1 rounded">{edu.year}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(edu)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(edu.id, 'education')} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'experiences' && (
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
                            <Briefcase size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg text-slate-900">{exp.role}</h4>
                            <p className="text-slate-500 font-medium">{exp.company}</p>
                            <p className="text-indigo-600 text-xs font-bold mt-1 bg-indigo-50 inline-block px-2 py-1 rounded">{exp.period}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openEditModal(exp)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(exp.id, 'experiences')} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </div>
                      <div className="pl-[72px]">
                        <ul className="space-y-2">
                          {exp.description?.map((desc: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                              {desc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                      <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                      <p>Aucun message reçu pour le moment</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={`p-6 rounded-2xl border flex justify-between items-start group hover:shadow-md transition-all ${msg.is_read ? 'bg-slate-50 border-slate-100' : 'bg-white border-indigo-200 shadow-sm'}`}>
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.is_read ? 'bg-slate-200 text-slate-400' : 'bg-indigo-100 text-indigo-600'}`}>
                            <User size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-bold text-slate-900">{msg.name}</h4>
                              {!msg.is_read && <span className="w-2 h-2 rounded-full bg-rose-500"></span>}
                            </div>
                            <p className="text-indigo-600 text-sm mb-2">{msg.email}</p>
                            <div className="bg-slate-50 p-4 rounded-xl text-slate-700 italic text-sm mb-2">
                              "{msg.message}"
                            </div>
                            <p className="text-xs text-slate-400">{new Date(msg.created_at).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</p>
                          </div>
                        </div>
                        <button onClick={() => handleDelete(msg.id, 'messages')} className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'skills' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skills.map((skill) => (
                    <div key={skill.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                      <div className="flex-grow mr-6">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-slate-900">{skill.name}</h4>
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${skill.category === 'frontend' ? 'bg-indigo-100 text-indigo-700' :
                            skill.category === 'backend' ? 'bg-emerald-100 text-emerald-700' :
                              skill.category === 'tools' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-200 text-slate-700'
                            }`}>{skill.category}</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${skill.level}%` }}></div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEditModal(skill)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(skill.id, 'skills')} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'languages' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {languages.map((lang) => (
                    <div key={lang.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
                      <div>
                        <h4 className="font-bold text-lg text-slate-900">{lang.name}</h4>
                        <p className="text-indigo-600 text-sm font-bold mt-1">{lang.level}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(lang)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(lang.id, 'languages')} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'interests' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {interests.map((interest) => (
                    <div key={interest.id} className="group relative break-inside-avoid">
                      <div className="px-6 py-4 bg-white border border-slate-200 rounded-xl font-bold flex items-center justify-between text-slate-700 shadow-sm group-hover:border-indigo-200 group-hover:text-indigo-600 transition-all">
                        <span>{interest.name}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDelete(interest.id, 'interests')} className="p-1 hover:bg-rose-50 text-rose-400 rounded transition-colors"><X size={16} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'cv' && (
                <div className="max-w-2xl mx-auto">
                  {cvMessage && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${cvMessage.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                      {cvMessage.type === 'success' ? <CheckCircle2 size={20} /> : <X size={20} />}
                      {cvMessage.text}
                    </div>
                  )}

                  <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 text-center">
                    <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
                      <FileText size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Gestion du CV</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Gérez le fichier PDF qui sera téléchargeable par les visiteurs de votre portfolio.</p>

                    {cvInfo ? (
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 text-left flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                            <CheckCircle2 size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm mb-1">{cvInfo.filename}</p>
                            <p className="text-xs text-slate-400">Ajouté le {new Date(cvInfo.uploadedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button onClick={handleCvDelete} className="text-rose-500 font-bold text-sm hover:underline">Supprimer</button>
                      </div>
                    ) : (
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-700 text-sm font-bold mb-8">
                        Aucun CV n'est actuellement disponible
                      </div>
                    )}

                    <div className="flex justify-center">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleCvUpload}
                        className="hidden"
                        id="cv-upload"
                        disabled={uploadingCv}
                      />
                      <label
                        htmlFor="cv-upload"
                        className={`bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-bold cursor-pointer flex items-center gap-3 transition-all shadow-xl shadow-indigo-200 ${uploadingCv ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {uploadingCv ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                        {cvInfo ? 'Remplacer le fichier PDF' : 'Uploader mon CV'}
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2rem] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  {editingItem ? 'Modifier' : 'Ajouter'} {
                    activeTab === 'projects' ? 'un projet' :
                      activeTab === 'education' ? 'une formation' :
                        activeTab === 'experiences' ? 'une expérience' :
                          activeTab === 'skills' ? 'une compétence' :
                            activeTab === 'languages' ? 'une langue' :
                              'un intérêt'
                  }
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'projects' && (
                <>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Titre</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={4}
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all resize-none font-medium text-slate-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Technologies</label>
                      <input
                        type="text"
                        value={formData.technologies || ''}
                        onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                        required
                        placeholder="PHP, MySQL..."
                        className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Catégorie</label>
                      <select
                        value={formData.category || 'web'}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                      >
                        <option value="web">Web</option>
                        <option value="mobile">Mobile</option>
                        <option value="software">Software</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Image (URL)</label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={formData.image_url || ''}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://..."
                        className="flex-grow bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          id="modal-image-upload"
                        />
                        <label htmlFor="modal-image-upload" className="h-full px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center cursor-pointer transition-colors border border-indigo-100">
                          {uploadingImage ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">GitHub</label>
                    <input
                      type="url"
                      value={formData.github_link || ''}
                      onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                </>
              )}

              {activeTab === 'education' && (
                <>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Diplôme</label>
                    <input
                      type="text"
                      value={formData.degree || ''}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      required
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">École</label>
                    <input
                      type="text"
                      value={formData.school || ''}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      required
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Année</label>
                    <input
                      type="text"
                      value={formData.year || ''}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      required
                      placeholder="2024 - 2025"
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                </>
              )}

              {activeTab === 'experiences' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Rôle</label>
                      <input
                        type="text"
                        value={formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                        className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Entreprise</label>
                      <input
                        type="text"
                        value={formData.company || ''}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Période</label>
                    <input
                      type="text"
                      value={formData.period || ''}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      required
                      placeholder="Mars 2024 - Présent"
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Description (une ligne par point)</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={4}
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all resize-none font-medium text-slate-600"
                    />
                  </div>
                </>
              )}

              {activeTab === 'skills' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Nom</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Niveau (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.level || 50}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        required
                        className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Catégorie</label>
                    <select
                      value={formData.category || 'frontend'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                    >
                      <option value="frontend">Frontend</option>
                      <option value="backend">Backend</option>
                      <option value="tools">Outils</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'languages' && (
                <>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Langue</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Niveau</label>
                    <input
                      type="text"
                      value={formData.level || ''}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      required
                      placeholder="Lu, parlé, écrit"
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                    />
                  </div>
                </>
              )}

              {activeTab === 'interests' && (
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Intérêt</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-slate-50 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-bold text-slate-700"
                  />
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
