import React, { useState } from 'react';
import { Phone, MapPin, Instagram, Facebook, ShieldCheck, Ruler, Star, Upload } from 'lucide-react';
import { Wizard } from './components/Wizard';
import Admin from './components/Admin';

type ViewState = 'LANDING' | 'WIZARD' | 'ADMIN';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('LANDING');
  const [logo, setLogo] = useState<string | null>(() => localStorage.getItem('tac_shop_logo'));

  const scrollToFooter = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogo(result);
        localStorage.setItem('tac_shop_logo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Header Component
  const Header = () => (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-center">
        {/* Logo Placeholder with Upload Feature */}
        <div className="relative group flex items-center gap-3">
          <div 
            onClick={() => setView('LANDING')}
            className="cursor-pointer"
          >
            {logo ? (
              <img src={logo} alt="TAÇ" className="h-10 w-auto object-contain" />
            ) : (
              <div className="text-2xl font-serif font-bold text-brand-red tracking-tight">
                TAÇ
              </div>
            )}
          </div>
          
          <label className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-2 hover:bg-gray-100 rounded-full" title="Upload Logo">
            <Upload className="w-4 h-4 text-gray-400" />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleLogoUpload} 
              className="hidden" 
            />
          </label>
        </div>
      </div>
    </nav>
  );

  // Footer Component
  const Footer = () => (
    <footer id="contact" className="bg-neutral-dark text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <h3 className="text-2xl font-serif font-bold mb-6 text-white">TAÇ</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Вашиот дом заслужува најдобар квалитет. Премиум завеси и текстил со традиција на квалитет и елеганција.
          </p>
          <div className="flex gap-4">
            <a 
              href="https://www.instagram.com/tacstruga.mk/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition cursor-pointer"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a 
              href="https://www.facebook.com/p/Tac-Struga-61572090855395/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition cursor-pointer"
            >
              <Facebook className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-6">Контакт</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-gray-400">
              <Phone className="w-5 h-5 mt-0.5" />
              <div>
                <p className="text-white">+389 72 221 206</p>
                <p className="text-xs">Пон - Саб: 09:00 - 20:00</p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-gray-400">
              <MapPin className="w-5 h-5 mt-0.5" />
              <div>
                <p className="text-white">Marshal Tito, Struga 6330</p>
                <p className="text-xs">Struga, Macedonia</p>
              </div>
            </div>
          </div>
        </div>

        <div>
           <h4 className="text-lg font-medium mb-6">Приватност</h4>
           <p className="text-gray-400 text-sm mb-4">
             Не праќаме спам. Вашите податоци се користат само за контакт и консултација.
           </p>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} TAÇ Macedonia. Сите права се задржани.
      </div>
    </footer>
  );

  // Landing Page View
  if (view === 'LANDING') {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-brand-light/30 pt-20">
          
          {/* Hero Section */}
          <section className="px-4 py-12 md:py-20 max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight mb-6">
              Откријте какви завеси му требаат на вашиот дом
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Одговорете на неколку прашања и нашиот тим ќе ве контактира за бесплатна консултација по телефон/камера, за да ви ги препорачаме идеалните завеси за вашиот дом.
            </p>
            
            <button 
              onClick={() => setView('WIZARD')}
              className="bg-brand-red text-white text-lg font-bold px-10 py-4 rounded-xl shadow-lg hover:bg-brand-dark hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Започни
            </button>
          </section>

          {/* Value Prop / Image Placeholder Section */}
          <section className="px-4 pb-20 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-6 h-6 text-brand-red" />
                  </div>
                  <h3 className="text-lg font-serif font-bold mb-2">Гарантиран квалитет</h3>
                  <p className="text-gray-500 text-sm">Користиме само сертифицирани материјали кои траат со години.</p>
               </div>
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Ruler className="w-6 h-6 text-brand-red" />
                  </div>
                  <h3 className="text-lg font-serif font-bold mb-2">Изработка по мера</h3>
                  <p className="text-gray-500 text-sm">Прецизно кроење и шиење за совршено вклопување во вашиот простор.</p>
               </div>
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-brand-red" />
                  </div>
                  <h3 className="text-lg font-serif font-bold mb-2">Стручна помош</h3>
                  <p className="text-gray-500 text-sm">Нашите дизајнери ќе ви помогнат да го направите вистинскиот избор.</p>
               </div>
            </div>
          </section>

        </main>
        <Footer />
      </>
    );
  }

  // Wizard View
  if (view === 'WIZARD') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col justify-center px-4 py-24">
          <Wizard onCancel={() => setView('LANDING')} />
        </main>
        <Footer />
      </div>
    );
  }

  // Admin View
  if (view === 'ADMIN') {
    return <Admin onBack={() => setView('LANDING')} />;
  }

  return null;
};

export default App;