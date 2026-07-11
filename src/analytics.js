import { supabase } from './SupabaseClient';

const visitorKey = 'rex360_visitor_id';

const visitorId = () => {
  if (typeof window === 'undefined') {
    return 'server';
  }

  try {
    let id = localStorage.getItem(visitorKey);
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `visitor_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(visitorKey, id);
    }
    return id;
  } catch {
    return `visitor_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }
};

export const trackSiteEvent = async (eventType, label = '') => {
  try {
    await supabase.from('site_events').insert([{
      visitor_id: visitorId(),
      event_type: eventType,
      event_label: String(label).slice(0, 160),
      page_path: window.location.pathname
    }]);
  } catch {
    // Analytics must never interrupt a customer action when the table has not
    // yet been installed or a visitor is offline.
  }
};
