import { useEffect, useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function GlobalEffects() {
    const { data: settings } = useSiteSettings();
    const location = useLocation();
    const { toast } = useToast();
    const [hasWelcomed, setHasWelcomed] = useState(false);

    // Welcome Message
    useEffect(() => {
        if (settings?.welcome_message && !hasWelcomed && location.pathname === "/") {
            // Small delay to ensure it pops up after load
            const timer = setTimeout(() => {
                toast({
                    title: "Welcome!",
                    description: settings.welcome_message,
                });
                setHasWelcomed(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [settings, location.pathname, hasWelcomed, toast]);

    // Theme Color Application
    useEffect(() => {
        if (settings?.theme_color) {
            document.documentElement.setAttribute("data-theme", settings.theme_color);
            // You would typically map these to CSS variables in index.css
            // For now, let's just use it as a data attribute that could style things
            // Or we can manually set some --primary variables here if we want dynamic colors
            const colors: Record<string, string> = {
                blue: "221.2 83.2% 53.3%",
                violet: "262.1 83.3% 57.8%",
                emerald: "142.1 76.2% 36.3%",
            };

            if (colors[settings.theme_color]) {
                document.documentElement.style.setProperty("--primary", colors[settings.theme_color]);
                // Also update ring for consistency
                document.documentElement.style.setProperty("--ring", colors[settings.theme_color]);
            }
        }
    }, [settings?.theme_color]);

    // Snowfall Effect
    if (settings?.enable_snow) {
        return <SnowfallOverlay />;
    }

    // Maintenance Mode (Simple Overlay)
    if (settings?.maintenance_mode && !location.pathname.startsWith("/admin") && !location.pathname.startsWith("/dashboard")) {
        return (
            <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-4xl font-display font-bold mb-4">Under Maintenance</h1>
                <p className="text-muted-foreground max-w-md">
                    We are currently updating our website to serve you better. Please check back shortly.
                </p>
            </div>
        );
    }

    return null;
}

function SnowfallOverlay() {
    // Simple CSS-based snowfall
    // Generating a few snowflakes with random positions
    const snowflakes = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 2}s`,
        opacity: Math.random(),
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <style dangerouslySetInnerHTML={{
                __html: `
            @keyframes snowfall {
                0% { transform: translateY(-10vh) rotate(0deg); }
                100% { transform: translateY(110vh) rotate(360deg); }
            }
        `}} />
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute top-0 text-white select-none"
                    style={{
                        left: flake.left,
                        animationName: "snowfall",
                        animationDuration: flake.animationDuration,
                        animationDelay: flake.animationDelay,
                        animationTimingFunction: "linear",
                        animationIterationCount: "infinite",
                        opacity: flake.opacity * 0.7,
                        fontSize: `${Math.random() * 10 + 10}px`,
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    );
}
