export type RoomOption = 
  | 'Дневна соба'
  | 'Спална соба'
  | 'Детска соба'
  | 'Канцеларија'
  | 'Повеќе простории'
  | 'Цел стан / куќа';

export type GoalOption = 
  | 'Да изгледа домот поубаво и поелегантно'
  | 'Да блокира светлина'
  | 'Да имам повеќе приватност'
  | 'Старите завеси веќе не одговараат';

export type QualityOption = 
  | 'Сакам најдобар можен квалитет'
  | 'Сакам баланс меѓу цена и квалитет'
  | 'Сакам најевтино';

export type BudgetOption = 
  | '150 – 250 ден'
  | '250 – 500 ден'
  | '500 – 900 ден'
  | '900 – 1500 ден';

export type ServiceOption = 
  | 'Само завеси сакам, имам метро'
  | 'Да, сакам целосна услуга';

export type UrgencyOption = 
  | 'Оваа недела'
  | 'Во следните 1–2 недели'
  | 'Само разгледувам засега';

export interface LeadFormData {
  rooms: RoomOption[];
  goal: GoalOption | '';
  quality: QualityOption | '';
  budget: BudgetOption | '';
  service: ServiceOption | '';
  urgency: UrgencyOption | '';
  city: string;
  name: string;
  phone: string;
}

export interface SubmittedLead extends LeadFormData {
  id: string;
  timestamp: string;
  qualified: boolean;
  notes: string;
}

export const INITIAL_DATA: LeadFormData = {
  rooms: [],
  goal: '',
  quality: '',
  budget: '',
  service: '',
  urgency: '',
  city: '',
  name: '',
  phone: ''
};