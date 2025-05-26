export interface JWTPayload {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string | null;
  calendar: { calendar_id: number; events: CalendarEvent[] };
}

export interface Category {
  category_id: number;
  name: string;
  parent?: {
    category_id: number;
    name: string;
  };
}

export interface Event {
  event_id: number;
  title: string;
  date: string;
  location: string;
  city: string;
  start_date: string;
  end_date: string;
  price: string;
  description: string;
  is_premium: boolean;
  image?: string;
  categories?: Category[];
}

export interface EventForm {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  city: string;
  price: number;
  category_id: number[];
  image?: File | null;
}

export interface CalendarEvent {
  calendar_event_id: number;
  added_at: string;
  wants_reminder: boolean;
  reminder_7d_sent: boolean;
  reminder_7d_sent_at: string | null;
  reminder_1d_sent: boolean;
  reminder_1d_sent_at: string | null;
  event: {
    event_id: number;
    title: string;
    description: string;
    start_date: string;
  };
}

export interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

export interface EventContextType {
  events: Event[];
}

export interface EventHomeCardProps {
  event: Event;
  baseUrl: string;
}
export interface CEFProps {
  onSuccess: () => void;
  onCancel: () => void;
}
