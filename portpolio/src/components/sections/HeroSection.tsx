import { motion } from "framer-motion";
import { ArrowDown, Download, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  profile?: {
    fullName: string;
    roles: string[];
    tagline: string;
    photoUrl?: string;
  };
}

export function HeroSection({ profile }: HeroSectionProps) {
  const defaultProfile = {
    fullName: "Mustapha Sani Jibril",
    roles: ["CEO, ValorTrust Solution & Consultant", "Quantity Surveying Professional"],
    tagline: "Building excellence through precision cost management and innovative consulting solutions",
    photoUrl: undefined,
  };

  const data = profile || defaultProfile;

  const scrollToAbout = () => {
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container-wide mx-auto px-4 md:px-8 pt-20 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6"
            >
              <Briefcase size={16} className="text-accent" />
              <span className="text-primary-foreground/90 text-sm font-medium">
                Available for Consulting & Internships
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4"
            >
              {data.fullName}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-1 mb-6"
            >
              {data.roles.map((role, index) => (
                <p
                  key={index}
                  className={`text-lg md:text-xl ${
                    index === 0 ? "text-accent font-semibold" : "text-primary-foreground/80"
                  }`}
                >
                  {role}
                </p>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-primary-foreground/70 text-lg max-w-xl mx-auto lg:mx-0 mb-8"
            >
              {data.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button variant="hero" size="lg" className="group" asChild>
                <a href="/cv.pdf" download="Mustapha_Sani_Jibril_CV.pdf">
                  <Download size={18} className="group-hover:animate-bounce" />
                  Download CV
                </a>
              </Button>
              <Button variant="heroOutline" size="lg" onClick={scrollToAbout}>
                Learn More
                <ArrowDown size={18} />
              </Button>
            </motion.div>
          </motion.div>

          {/* Profile Image / Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-72 h-72 md:w-80 md:h-80 border-2 border-accent/30 rounded-2xl" />
              <div className="absolute -bottom-4 -right-4 w-72 h-72 md:w-80 md:h-80 bg-accent/20 rounded-2xl" />
              
              {/* Main image container */}
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden bg-primary-foreground/10 border border-primary-foreground/20">
                {data.photoUrl ? (
                  <img
                    src={data.photoUrl}
                    alt={data.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                        <span className="text-4xl font-display font-bold text-primary-foreground">
                          {data.fullName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <p className="text-primary-foreground/60 text-sm">Profile Photo</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <Briefcase size={18} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">ValorTrust</p>
                    <p className="text-muted-foreground text-xs">CEO & Founder</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.button
          onClick={scrollToAbout}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center text-primary-foreground/60 hover:text-primary-foreground transition-colors"
        >
          <span className="text-xs mb-2">Scroll Down</span>
          <ArrowDown size={20} />
        </motion.button>
      </motion.div>
    </section>
  );
}
