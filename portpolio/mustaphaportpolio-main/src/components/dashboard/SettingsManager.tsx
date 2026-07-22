import { useState, useEffect } from "react";
import { Save, Loader2, Snowflake, Power, MessageSquare, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings, useUpdateSiteSetting } from "@/hooks/useSiteSettings";

export function SettingsManager() {
    const { data: settings, isLoading } = useSiteSettings();
    const updateSetting = useUpdateSiteSetting();
    const { toast } = useToast();

    const [welcomeMessage, setWelcomeMessage] = useState("");

    useEffect(() => {
        if (settings?.welcome_message) {
            setWelcomeMessage(settings.welcome_message);
        }
    }, [settings]);

    const handleToggleChange = (key: "enable_snow" | "maintenance_mode", checked: boolean) => {
        updateSetting.mutate({ key, value: checked }, {
            onSuccess: () => {
                toast({ title: "Setting updated" });
            }
        });
    };

    const handleThemeChange = (value: string) => {
        updateSetting.mutate({ key: "theme_color", value }, {
            onSuccess: () => {
                toast({ title: "Theme updated" });
            }
        });
    };

    const handleSaveMessage = () => {
        updateSetting.mutate({ key: "welcome_message", value: welcomeMessage }, {
            onSuccess: () => {
                toast({ title: "Welcome message updated" });
            }
        });
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="max-w-3xl space-y-6">
            <div className="bg-card rounded-2xl p-6 lg:p-8 card-shadow space-y-8">
                <div>
                    <h2 className="font-display font-semibold text-xl text-foreground mb-1">Site Settings</h2>
                    <p className="text-sm text-muted-foreground">Manage your website's global configuration and features.</p>
                </div>

                {/* Surprise Feature: Snowfall */}
                <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl border border-border">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Snowflake size={20} />
                        </div>
                        <div>
                            <Label className="text-base font-medium">Winter Mode (Snowfall)</Label>
                            <p className="text-sm text-muted-foreground">Add a magical snowfall effect to your entire website.</p>
                        </div>
                    </div>
                    <Switch
                        checked={settings?.enable_snow || false}
                        onCheckedChange={(checked) => handleToggleChange("enable_snow", checked)}
                    />
                </div>

                {/* Maintenance Mode */}
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/10 rounded-xl border border-orange-200 dark:border-orange-900/30">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <Power size={20} />
                        </div>
                        <div>
                            <Label className="text-base font-medium">Maintenance Mode</Label>
                            <p className="text-sm text-muted-foreground">Temporarily disable the public website for visitors.</p>
                        </div>
                    </div>
                    <Switch
                        checked={settings?.maintenance_mode || false}
                        onCheckedChange={(checked) => handleToggleChange("maintenance_mode", checked)}
                    />
                </div>

                {/* Theme Color (Conceptual - simple implementation) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Palette size={18} className="text-primary" />
                        <h3 className="font-medium text-foreground">Accent Color Theme</h3>
                    </div>
                    <RadioGroup defaultValue={settings?.theme_color || "blue"} onValueChange={handleThemeChange} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="blue" id="blue" className="text-blue-600 border-blue-600" />
                            <Label htmlFor="blue">Ocean Blue</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="violet" id="violet" className="text-violet-600 border-violet-600" />
                            <Label htmlFor="violet">Royal Violet</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="emerald" id="emerald" className="text-emerald-600 border-emerald-600" />
                            <Label htmlFor="emerald">Emerald Green</Label>
                        </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">Note: This refreshes the page to apply changes.</p>
                </div>

                {/* Welcome Message */}
                <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                        <MessageSquare size={18} className="text-primary" />
                        <h3 className="font-medium text-foreground">Custom Welcome Toast</h3>
                    </div>
                    <div className="flex gap-4">
                        <Input
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
                            placeholder="Enter a message to greet your visitors..."
                        />
                        <Button onClick={handleSaveMessage} disabled={updateSetting.isPending}>
                            {updateSetting.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
