import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  FileText,
  Award,
  FolderKanban,
  Download,
  Mail,
  BarChart3,
  Settings,
  Home,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Dashboard section components
import { ProfileManager } from "@/components/dashboard/ProfileManager";
import { BioEditor } from "@/components/dashboard/BioEditor";
import { SkillsManager } from "@/components/dashboard/SkillsManager";
import { CertificatesManager } from "@/components/dashboard/CertificatesManager";
import { ProjectsManager } from "@/components/dashboard/ProjectsManager";
import { PortfolioManager } from "@/components/dashboard/PortfolioManager";
import { ContactInbox } from "@/components/dashboard/ContactInbox";
import { VisitorInsights } from "@/components/dashboard/VisitorInsights";

type DashboardSection = 
  | "profile"
  | "bio"
  | "skills"
  | "certificates"
  | "projects"
  | "portfolio"
  | "inbox"
  | "insights";

const menuItems: { id: DashboardSection; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile Manager", icon: User },
  { id: "bio", label: "Bio / Statement", icon: FileText },
  { id: "skills", label: "Skills Manager", icon: Sparkles },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "portfolio", label: "Portfolio Files", icon: Download },
  { id: "inbox", label: "Contact Inbox", icon: Mail },
  { id: "insights", label: "Visitor Insights", icon: BarChart3 },
];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await signOut();
    toast({ title: "Logged out successfully" });
    navigate('/admin');
  };

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileManager />;
      case "bio":
        return <BioEditor />;
      case "skills":
        return <SkillsManager />;
      case "certificates":
        return <CertificatesManager />;
      case "projects":
        return <ProjectsManager />;
      case "portfolio":
        return <PortfolioManager />;
      case "inbox":
        return <ContactInbox />;
      case "insights":
        return <VisitorInsights />;
      default:
        return <ProfileManager />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-72 bg-card border-r border-border z-50 transition-transform duration-300 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg hero-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">M</span>
            </div>
            <div>
              <p className="font-display font-semibold text-foreground">Dashboard</p>
              <p className="text-xs text-muted-foreground">Mustapha S. Jibril</p>
            </div>
          </Link>
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsSidebarOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-border space-y-2">
          <Link to="/">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Home size={16} />
              View Website
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground" 
            size="sm"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="font-display font-semibold text-lg text-foreground">
                {menuItems.find(item => item.id === activeSection)?.label}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Manage your portfolio content
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Settings size={16} />
            Settings
          </Button>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
