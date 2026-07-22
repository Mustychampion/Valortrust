import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface VisitorAnalytics {
  id: string;
  page_path: string;
  visit_count: number;
  visit_date: string;
  created_at: string;
}

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visitor_analytics')
        .select('*')
        .order('visit_date', { ascending: false });
      
      if (error) throw error;
      return data as VisitorAnalytics[];
    },
  });
};

export const useLogVisit = () => {
  return useMutation({
    mutationFn: async (pagePath: string) => {
      const today = new Date().toISOString().split('T')[0];
      
      // Try to update existing record for today
      const { data: existing } = await supabase
        .from('visitor_analytics')
        .select('id, visit_count')
        .eq('page_path', pagePath)
        .eq('visit_date', today)
        .maybeSingle();
      
      if (existing) {
        const { error } = await supabase
          .from('visitor_analytics')
          .update({ visit_count: existing.visit_count + 1 })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('visitor_analytics')
          .insert({ page_path: pagePath, visit_date: today });
        
        if (error) throw error;
      }
    },
  });
};

export const useAnalyticsSummary = () => {
  return useQuery({
    queryKey: ['analytics-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visitor_analytics')
        .select('page_path, visit_count, visit_date');
      
      if (error) throw error;
      
      const analytics = data as VisitorAnalytics[];
      
      // Calculate totals
      const totalVisits = analytics.reduce((sum, a) => sum + a.visit_count, 0);
      
      // Group by month
      const monthlyData: Record<string, number> = {};
      analytics.forEach(a => {
        const month = a.visit_date.substring(0, 7); // YYYY-MM
        monthlyData[month] = (monthlyData[month] || 0) + a.visit_count;
      });
      
      // Group by page
      const pageData: Record<string, number> = {};
      analytics.forEach(a => {
        pageData[a.page_path] = (pageData[a.page_path] || 0) + a.visit_count;
      });
      
      // Sort pages by visits
      const topPages = Object.entries(pageData)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([path, count]) => ({ path, count }));
      
      return {
        totalVisits,
        monthlyData: Object.entries(monthlyData)
          .map(([month, visitors]) => ({ month, visitors }))
          .sort((a, b) => a.month.localeCompare(b.month)),
        topPages,
      };
    },
  });
};
