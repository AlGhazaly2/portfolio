import React, { useState, useEffect, useRef } from 'react';
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Download,
  ChevronRight,
  Code2,
  Briefcase,
  GraduationCap,
  User,
  ExternalLink,
  Menu,
  X,
  Send,
  CheckCircle2,
  Globe2,
  Heart,
  Loader2,
  AlertCircle,
  Lock
} from 'lucide-react';
import { PROJECTS, SKILLS, EXPERIENCES, EDUCATION, LANGUAGES, INTERESTS } from './components/constants';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import { Project, Experience, Education, Skill } from './components/types';

const App: React.FC = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // État du formulaire de contact
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfileData(data))
      .catch(err => console.error('Error fetching profile:', err));
  }, []);

  // Identifiants EmailJS configurés
  const SERVICE_ID = 'service_bg2mqrt';
  const TEMPLATE_ID = 'template_bd23rlp';
  const PUBLIC_KEY = 'gBW0V9dX_Q6OU8_rQ';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Initialisation d'EmailJS au chargement
    // @ts-ignore
    if (window.emailjs) {
      // @ts-ignore
      window.emailjs.init(PUBLIC_KEY);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSending(true);
    setSubmitStatus('idle');

    try {
      // @ts-ignore
      if (window.emailjs) {
        // @ts-ignore
        const result = await window.emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
        setSubmitStatus('success');
        formRef.current.reset();
      } else {
        throw new Error('EmailJS non chargé');
      }
    } catch (error) {
      console.error('Erreur détaillée EmailJS:', error);
      setSubmitStatus('error');
    } finally {
      setIsSending(false);
      setTimeout(() => setSubmitStatus('idle'), 6000);
    };
  };

  const handleCvDownload = async () => {
    try {
      const response = await fetch('/api/cv/download');

      if (!response.ok) {
        alert('CV non disponible pour le moment');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CV_Ahmed_Al_Ghazaly.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur téléchargement CV:', error);
      alert('Erreur lors du téléchargement du CV');
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminMode(false);
  };

  // Show login page if admin mode is activated but not authenticated
  if (isAdminMode && !isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Show admin dashboard if authenticated
  if (isAdminMode && isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  const navLinks = [
    { name: 'Accueil', href: '#home' },
    { name: 'À Propos', href: '#about' },
    { name: 'Compétences', href: '#skills' },
    { name: 'Expériences', href: '#experience' },
    { name: 'Projets', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const linkedinUrl = "https://www.linkedin.com/in/ahmed-ghazaly-64286a361/";

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center cursor-pointer group" onClick={(e) => scrollToSection(e as any, '#home')}>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              AL GHAZALY <span className="text-indigo-600">AHMED</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-slate-600 hover:text-indigo-600 font-bold text-xs uppercase tracking-[0.2em] transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => setIsAdminMode(true)}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
              title="Admin Panel"
            >
              <Lock size={18} />
            </button>
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-600 hover:text-indigo-600 transition-colors" title="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="p-2 text-slate-600 hover:text-indigo-600 transition-colors" title="GitHub">
                <Github size={20} />
              </a>
            </div>
          </div>

          <button className="md:hidden text-slate-900 p-2 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`md:hidden absolute top-full left-0 w-full bg-white border-b shadow-xl transition-all duration-300 origin-top ${isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
          <div className="p-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-600 hover:text-indigo-600 font-bold py-3 text-lg"
                onClick={(e) => scrollToSection(e, link.href)}
              >
                {link.name}
              </a>
            ))}
            <button onClick={() => setIsAdminMode(true)} className="text-slate-400 font-bold py-3 text-lg flex items-center gap-2">
              <Lock size={18} /> Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-32 pb-20 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="max-w-5xl mx-auto px-6 w-full">
          <div className="text-center">
            {/* Profile Photo Circle */}
            <div className="relative inline-block mb-8">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-2xl">
                <div className="w-full h-full rounded-full bg-white p-1 overflow-hidden relative group">
                  {profileData?.image_url ? (
                    <img
                      src={profileData.image_url}
                      alt={profileData.name}
                      className="w-full h-full object-cover rounded-full transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <User size={80} className="text-slate-300" />
                    </div>
                  )}

                  {/* Floating Badge */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center animate-bounce shadow-lg z-10">
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Name */}
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-4 tracking-tight">
              {profileData?.name || 'Chargement...'}
            </h1>

            {/* Main Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-8">
              {profileData?.title || ''}
            </h2>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed font-medium px-4">
              {profileData?.subtitle || ''}
            </p>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-slate-100 mb-12 hover:scale-105 transition-transform cursor-default">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="font-bold text-slate-700 text-sm tracking-wide">{profileData?.status || 'Disponible'}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-5 justify-center">
              <button
                onClick={handleCvDownload}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-200 flex items-center gap-3 group"
              >
                <Download size={20} /> Télécharger mon CV
              </button>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, '#contact')}
                className="bg-white border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-700 px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-3"
              >
                Me contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="max-w-7xl mx-auto px-8">
            <div className="bg-white px-16 py-14 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-900 mb-12 text-center text-5xl tracking-tight">
                Profil Professionnel
              </h4>

              <div className="space-y-8 text-slate-700 leading-loose">
                <p className="font-normal" style={{ fontSize: '24px', lineHeight: '1.7' }}>
                  Développeur web et applications passionné, je conçois et développe des solutions digitales modernes, performantes et intuitives. Spécialisé dans la création de sites web dynamiques et d'applications mobiles, je transforme les besoins des clients en expériences numériques efficaces et attractives.
                </p>

                <p className="font-normal" style={{ fontSize: '24px', lineHeight: '1.7' }}>
                  Rigoureux et créatif, je veille à produire un code propre, sécurisé et optimisé, tout en respectant les bonnes pratiques et les standards actuels. Toujours à l'affût des nouvelles technologies, je m'engage à développer des solutions évolutives, adaptées aux exigences du marché.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Skills Section */}
      < section id="skills" className="py-32 bg-slate-900 text-white" >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Expertise</h2>
            <h3 className="text-5xl font-black text-white">Compétences Techniques</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Frontend", icon: <Code2 />, color: "blue", list: ["HTML5", "CSS3", "JavaScript", "Bootstrap"] },
              { title: "Backend", icon: <Briefcase />, color: "emerald", list: ["PHP", "MySQL", "Java", "Firebase"] },
              { title: "Outils", icon: <Code2 />, color: "orange", list: ["GitHub", "VS Code", "XAMPP"] },
              { title: "Bureautique", icon: <GraduationCap />, color: "purple", list: ["Word", "Excel", "PowerPoint", "Canva", "XML"] }
            ].map((cat, i) => (
              <div key={i} className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110
                  ${cat.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                    cat.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                      cat.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-purple-500/20 text-purple-400'}`}>
                  {cat.icon}
                </div>
                <h4 className="text-2xl font-black mb-8">{cat.title}</h4>
                <div className="flex flex-wrap gap-3">
                  {cat.list.map(skill => (
                    <span key={skill} className="px-4 py-2 bg-white/5 text-slate-300 rounded-xl text-xs font-black border border-white/5 hover:border-indigo-500/50 hover:text-indigo-400 transition-all">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Experience & Education Section */}
      < section id="experience" className="py-32 bg-white" >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24">
            {/* Experience Column */}
            <div>
              <div className="flex items-center gap-4 mb-16">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                  <Briefcase size={28} />
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Expériences</h2>
              </div>

              <div className="space-y-12">
                {EXPERIENCES.map((exp: Experience, index: number) => (
                  <div key={index} className="relative pl-12 border-l-4 border-indigo-50 pb-2">
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-indigo-600 -translate-x-1/2 border-8 border-white"></div>
                    <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:bg-white transition-all group">
                      <span className="text-indigo-600 text-xs font-black uppercase tracking-widest mb-4 block group-hover:scale-105 transition-transform">{exp.period}</span>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">{exp.role}</h3>
                      <p className="text-slate-500 font-black mb-8 uppercase tracking-widest text-sm">{exp.company}</p>
                      <ul className="space-y-4">
                        {exp.description.map((item: string, i: number) => (
                          <li key={i} className="flex items-start gap-4 text-slate-600 font-semibold leading-relaxed">
                            <span className="mt-2 w-2 h-2 rounded-full bg-indigo-400 shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education Column */}
            <div>
              <div className="flex items-center gap-4 mb-16">
                <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-100">
                  <GraduationCap size={28} />
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Formations</h2>
              </div>

              <div className="space-y-6">
                {EDUCATION.map((edu: Education, index: number) => (
                  <div key={index} className="group p-10 rounded-[2.5rem] border border-slate-100 bg-white hover:bg-emerald-50/20 transition-all flex gap-8 items-center border-b-4 border-b-transparent hover:border-b-emerald-600 shadow-sm">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center font-black text-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                      {edu.year.split(' – ')[0]?.trim().slice(-2) || edu.year.slice(-2)}
                    </div>
                    <div>
                      <span className="text-emerald-600 text-xs font-black uppercase tracking-widest mb-2 block">{edu.year}</span>
                      <h3 className="text-2xl font-black text-slate-900 mb-2">{edu.degree}</h3>
                      <p className="text-slate-500 font-black text-sm uppercase tracking-wider">{edu.school}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Projects Section */}
      < section id="projects" className="py-32 bg-slate-50" >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.4em] mb-4">Portfolio</h2>
            <h3 className="text-5xl font-black text-slate-900">Projets Marquants</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto gap-12">
            {PROJECTS.map((project: Project, index: number) => (
              <div key={index} className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all group flex flex-col h-full">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                    <div className="flex gap-4">
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-8 py-4 bg-white rounded-2xl text-indigo-600 hover:bg-indigo-600 hover:text-white font-black transition-all transform hover:-translate-y-2 shadow-xl flex items-center justify-center gap-2"
                        >
                          Voir sur GitHub <Github size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-8 left-8">
                    <span className="bg-white/95 backdrop-blur px-5 py-2 rounded-2xl text-[10px] font-black text-indigo-600 shadow-2xl uppercase tracking-[0.2em]">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-grow">
                  <h3 className="text-2xl font-black text-slate-900 mb-4">{project.title}</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed font-semibold text-md flex-grow">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                    {project.technologies.map((tech: string) => (
                      <span key={tech} className="px-4 py-1.5 bg-slate-50 text-slate-700 rounded-xl text-[10px] font-black border border-slate-200 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Contact Section */}
      < section id="contact" className="py-32 bg-white" >
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 -skew-x-12 translate-x-1/4"></div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-24 items-center">
              <div>
                <h2 className="text-6xl font-black text-white leading-tight mb-10">Collaborons sur votre <span className="text-indigo-400 italic">succès</span></h2>
                <p className="text-slate-400 text-xl mb-16 leading-relaxed font-medium">
                  Je suis prêt à mettre mes compétences au service de vos ambitions. Contactez-moi pour un échange productif.
                </p>

                <div className="space-y-10 mb-16">
                  <div className="flex items-center gap-8 group">
                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-indigo-400 border border-white/5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Mail size={28} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Email</p>
                      <p className="text-white text-xl font-black break-all">ahmedghazaly2911@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 group">
                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-emerald-400 border border-white/5 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <Phone size={28} />
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Téléphone</p>
                      <p className="text-white text-xl font-black">+212 6 20 86 89 63</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-16 h-16 flex items-center justify-center bg-white/5 text-white rounded-3xl hover:bg-indigo-600 transition-all border border-white/5 shadow-lg"><Linkedin size={28} /></a>
                  <a href="#" className="w-16 h-16 flex items-center justify-center bg-white/5 text-white rounded-3xl hover:bg-indigo-600 transition-all border border-white/5 shadow-lg"><Github size={28} /></a>
                </div>
              </div>

              <div className="bg-white p-12 rounded-[3rem] shadow-2xl">
                <form ref={formRef} className="space-y-8" onSubmit={handleContactSubmit}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Nom Complet</label>
                    <input
                      name="user_name"
                      type="text"
                      required
                      className="w-full bg-slate-50 px-8 py-5 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-black text-slate-900"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Email Professionnel</label>
                    <input
                      name="user_email"
                      type="email"
                      required
                      className="w-full bg-slate-50 px-8 py-5 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all font-black text-slate-900"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Message</label>
                    <textarea
                      name="message"
                      rows={5}
                      required
                      className="w-full bg-slate-50 px-8 py-5 rounded-2xl border-2 border-transparent focus:border-indigo-600 outline-none transition-all resize-none font-black text-slate-900"
                      placeholder="Décrivez votre besoin..."
                    ></textarea>
                  </div>

                  {/* Messages de retour */}
                  {submitStatus === 'success' && (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-bold animate-in fade-in slide-in-from-top-2">
                      <CheckCircle2 size={20} /> Message envoyé avec succès !
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 font-bold animate-in fade-in slide-in-from-top-2">
                      <AlertCircle size={20} /> Une erreur est survenue (vérifiez votre Public Key).
                    </div>
                  )}

                  <button
                    disabled={isSending}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-4 active:scale-95 text-lg uppercase tracking-widest group"
                  >
                    {isSending ? (
                      <>Envoi en cours <Loader2 size={24} className="animate-spin" /></>
                    ) : (
                      <>Envoyer le message <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Footer */}
      < footer className="py-24 bg-white" >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-12">
              <span className="font-black text-2xl text-slate-900 tracking-tighter uppercase">Ahmed Al Ghazaly</span>
            </div>

            <div className="flex items-center gap-6 mb-16">
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all hover:shadow-lg" title="LinkedIn">
                <Linkedin size={22} />
              </a>
              <a href="#" className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-slate-200 text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all hover:shadow-lg" title="GitHub">
                <Github size={22} />
              </a>
            </div>

            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
              &copy; {new Date().getFullYear()} Développeur Informatique | Portfolio Professionnel
            </p>
          </div>
        </div>
      </footer >
    </div >
  );
};

export default App;
