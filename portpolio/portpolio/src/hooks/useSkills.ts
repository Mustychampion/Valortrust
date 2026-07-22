import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Skill[];
    },
  });
};

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('skills')
        .insert(skill)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast({ title: 'Skill added successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error adding skill', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Skill> & { id: string }) => {
      const { data, error } = await supabase
        .from('skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast({ title: 'Skill updated successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error updating skill', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast({ title: 'Skill deleted successfully' });
    },
    onError: (error) => {
      toast({ 
        title: 'Error deleting skill', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });
};
