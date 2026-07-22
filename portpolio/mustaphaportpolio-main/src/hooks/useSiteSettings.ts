import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettingKey = "theme_color" | "enable_snow" | "maintenance_mode" | "welcome_message";

export interface SiteSetting {
    key: SiteSettingKey;
    value: any;
}

export function useSiteSettings() {
    return useQuery({
        queryKey: ["site_settings"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("site_settings")
                .select("*");

            if (error) throw error;

            // Convert array to object for easier access
            const settingsMap: Record<string, any> = {};
            data.forEach(item => {
                settingsMap[item.key] = item.value;
            });

            return settingsMap;
        },
    });
}

export function useUpdateSiteSetting() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ key, value }: { key: SiteSettingKey; value: any }) => {
            const { data, error } = await supabase
                .from("site_settings")
                .upsert({ key, value, updated_at: new Date().toISOString() })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["site_settings"] });
        },
    });
}
