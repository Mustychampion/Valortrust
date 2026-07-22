import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Bio {
  id: string;
  content: string;
  updated_at: string;
  updated_by: string | null;
}

export const useBio = () => {
  return useQuery({
    queryKey: ['bio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_bio')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as Bio | null;
    },
  });
};

export const useUpdateBio = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('site_bio')
        .update({ 
          content,
          updated_by: user?.id 
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bio'] });
      toast({ title: 'Bio saved successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error saving bio', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
};
