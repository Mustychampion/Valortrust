import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { CertificatesSection } from "@/components/sections/CertificatesSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { useSkills } from "@/hooks/useSkills";
import { useBio } from "@/hooks/useBio";
import { useLogVisit } from "@/hooks/useAnalytics";
import { useProfile, OWNER_FULL_NAME } from "@/hooks/useProfile";

const Index = () => {
  const { data: skills = [] } = useSkills();
  const { data: bio } = useBio();
  const { data: profile } = useProfile();
  const logVisit = useLogVisit();

  // Log page visit on mount
  useEffect(() => {
    logVisit.mutate('/');
  }, []);

  // Transform skills to match component interface
  const formattedSkills = skills.map(skill => ({
    id: skill.id,
    name: skill.name,
    description: skill.description || '',
    category: skill.category,
  }));

  const certificates: never[] = [];
  const projects: never[] = [];

  // Build hero profile data from database
  const heroProfile = profile ? {
    fullName: OWNER_FULL_NAME,
    roles: profile.roles ? profile.roles.split(',').map(r => r.trim()) : ["CEO, ValorTrust Solution & Consultant", "Quantity Surveying Professional"],
    tagline: profile.tagline || "Building excellence through precision cost management and innovative consulting solutions",
    photoUrl: profile.profile_image_url || undefined,
  } : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection profile={heroProfile} />
        <AboutSection bio={bio?.content} />
        <SkillsSection skills={formattedSkills} />
        <CertificatesSection certificates={certificates} />
        <ProjectsSection projects={projects} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
