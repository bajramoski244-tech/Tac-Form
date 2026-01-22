import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, AlertCircle } from 'lucide-react';
import { 
  LeadFormData, 
  INITIAL_DATA, 
  RoomOption, 
  GoalOption, 
  QualityOption, 
  BudgetOption, 
  ServiceOption, 
  UrgencyOption 
} from '../types';
import { saveLead } from '../services/sheetService';

// Options Data
const ROOM_OPTIONS: RoomOption[] = ['Дневна соба', 'Спална соба', 'Детска соба', 'Канцеларија', 'Повеќе простории', 'Цел стан / куќа'];
const GOAL_OPTIONS: GoalOption[] = ['Да изгледа домот поубаво и поелегантно', 'Да блокира светлина', 'Да имам повеќе приватност', 'Старите завеси веќе не одговараат'];
const QUALITY_OPTIONS: QualityOption[] = ['Сакам најдобар можен квалитет', 'Сакам баланс меѓу цена и квалитет', 'Сакам најевтино'];
const BUDGET_OPTIONS: BudgetOption[] = ['150 – 250 ден', '250 – 500 ден', '500 – 900 ден', '900 – 1500 ден'];
const SERVICE_OPTIONS: ServiceOption[] = ['Само завеси сакам, имам метро', 'Да, сакам целосна услуга'];
const URGENCY_OPTIONS: UrgencyOption[] = ['Оваа недела', 'Во следните 1–2 недели', 'Само разгледувам засега'];

interface WizardProps {
  onCancel: () => void;
}

const TOTAL_STEPS = 8;

export const Wizard: React.FC<WizardProps> = ({ onCancel }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<LeadFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isQualified, setIsQualified] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tac_wizard_temp');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(parsed);
      } catch (e) {
        console.error("Failed to restore progress");
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('tac_wizard_temp', JSON.stringify(data));
  }, [data]);

  const updateField = (field: keyof LeadFormData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleRoom = (room: RoomOption) => {
    setData(prev => {
      const exists = prev.rooms.includes(room);
      const newRooms = exists 
        ? prev.rooms.filter(r => r !== room)
        : [...prev.rooms, room];
      return { ...prev, rooms: newRooms };
    });
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) setStep(s => s + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(s => s - 1);
    else onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    // Determine notes (cheapest message shown?)
    const notes = data.quality === 'Сакам најевтино' ? 'Cheapest message shown' : '';

    try {
      const result = await saveLead(data, notes);
      setIsQualified(result.qualified);
      setSubmitted(true);
      localStorage.removeItem('tac_wizard_temp');
    } catch (err) {
      alert("Се случи грешка. Ве молиме обидете се повторно.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation
  const isStepValid = () => {
    switch (step) {
      case 1: return data.rooms.length > 0;
      case 2: return !!data.goal;
      case 3: return !!data.quality;
      case 4: return !!data.budget;
      case 5: return !!data.service;
      case 6: return !!data.urgency;
      case 7: return data.city.length >= 2;
      case 8: return data.name.length > 2 && data.phone.length > 5;
      default: return false;
    }
  };

  // Render Confirmation
  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Ви благодариме.</h2>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Според вашите одговори, нашиот тим ќе ве контактира за да ви ги препорача најсоодветните завеси за вашиот дом.
        </p>
        <div className="bg-brand-light border border-brand-red/10 rounded-xl p-4 inline-block">
          <p className="text-brand-dark font-medium">
            {isQualified 
              ? "Очекувајте повик наскоро." 
              : "Го добивме барањето — ќе ве контактираме доколку имаме соодветна понуда."}
          </p>
        </div>
        <div className="mt-8">
            <button onClick={onCancel} className="text-gray-500 underline hover:text-brand-red">Назад кон почетна</button>
        </div>
      </div>
    );
  }

  // Render Wizard
  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
      {/* Progress Bar */}
      <div className="bg-gray-100 h-1.5 w-full">
        <div 
          className="bg-brand-red h-full transition-all duration-300 ease-out"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Header */}
      <div className="px-6 pt-6 pb-2 flex justify-between items-center">
        <span className="text-xs font-semibold text-brand-red tracking-wider uppercase">Чекор {step} од {TOTAL_STEPS}</span>
        <button onClick={prevStep} className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4 flex flex-col">
        <div className="flex-1">
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">За кои простории ви требаат завеси?</h2>
              <div className="grid grid-cols-1 gap-3">
                {ROOM_OPTIONS.map((opt) => (
                  <label 
                    key={opt}
                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      data.rooms.includes(opt) 
                        ? 'border-brand-red bg-brand-light text-brand-dark shadow-sm' 
                        : 'border-gray-100 hover:border-gray-200 text-gray-700'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={data.rooms.includes(opt)}
                      onChange={() => toggleRoom(opt)}
                    />
                    <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                      data.rooms.includes(opt) ? 'bg-brand-red border-brand-red' : 'border-gray-300'
                    }`}>
                      {data.rooms.includes(opt) && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="font-medium">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Што сакате најмногу да постигнете со новите завеси?</h2>
              <div className="space-y-3">
                {GOAL_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateField('goal', opt)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      data.goal === opt 
                        ? 'border-brand-red bg-brand-light text-brand-dark shadow-sm' 
                        : 'border-gray-100 hover:border-gray-200 text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Колку ви е важен квалитетот?</h2>
              <div className="space-y-3">
                {QUALITY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateField('quality', opt)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      data.quality === opt 
                        ? 'border-brand-red bg-brand-light text-brand-dark shadow-sm' 
                        : 'border-gray-100 hover:border-gray-200 text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{opt}</span>
                  </button>
                ))}
              </div>
              {data.quality === 'Сакам најевтино' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg flex gap-3 text-sm text-gray-600 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-brand-red flex-shrink-0" />
                  <p>Нашите завеси почнуваат од 250 ден/м².</p>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Колкав буџет планирате по м²?</h2>
              <div className="space-y-3">
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateField('budget', opt)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      data.budget === opt 
                        ? 'border-brand-red bg-brand-light text-brand-dark shadow-sm' 
                        : 'border-gray-100 hover:border-gray-200 text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Дали сакате ние да дојдеме да земеме точна мера и да монтираме?</h2>
              <div className="space-y-3">
                {SERVICE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateField('service', opt)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      data.service === opt 
                        ? 'border-brand-red bg-brand-light text-brand-dark shadow-sm' 
                        : 'border-gray-100 hover:border-gray-200 text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Колку брзо сакате да бидат готови завесите?</h2>
              <div className="space-y-3">
                {URGENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateField('urgency', opt)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      data.urgency === opt 
                        ? 'border-brand-red bg-brand-light text-brand-dark shadow-sm' 
                        : 'border-gray-100 hover:border-gray-200 text-gray-700'
                    }`}
                  >
                    <span className="font-medium">{opt}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Каде се наоѓате?</h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Град / место</label>
                <input 
                  type="text" 
                  value={data.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="Пр. Скопје, Битола..."
                  className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-brand-red focus:outline-none transition-colors"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Како да ве контактираме?</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Име</label>
                  <input 
                    type="text" 
                    value={data.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-brand-red focus:outline-none transition-colors"
                    placeholder="Вашето име"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Телефонски број</label>
                  <input 
                    type="tel" 
                    value={data.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-brand-red focus:outline-none transition-colors"
                    placeholder="07x xxx xxx"
                  />
                </div>
                <div className="flex gap-3 bg-blue-50 p-4 rounded-xl items-start">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900 leading-snug">
                    Нашиот тим ве контактира истиот или следниот ден за бесплатна консултација и визуелна препорака на завеси преку камера.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-8 pb-2">
          {step < TOTAL_STEPS ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md ${
                isStepValid() 
                  ? 'bg-brand-red text-white hover:bg-brand-dark hover:shadow-lg' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Следно <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-md ${
                isStepValid() && !isSubmitting
                  ? 'bg-brand-red text-white hover:bg-brand-dark hover:shadow-lg' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Се испраќа...' : 'Заврши'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};