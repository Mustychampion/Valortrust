import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Calendar, Building, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Certificate {
  id: string;
  title: string;
  organization: string;
  year: string;
  description?: string;
  fileUrl?: string;
}

interface CertificatesSectionProps {
  certificates?: Certificate[];
}

export function CertificatesSection({ certificates = [] }: CertificatesSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const hasCertificates = certificates.length > 0;

  return (
    <section id="certificates" className="section-padding bg-background">
      <div className="container-wide mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Credentials</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
            Certificates & Achievements
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mt-4" />
        </motion.div>

        {hasCertificates ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 group"
              >
                {/* Certificate header */}
                <div className="hero-gradient p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center mb-4">
                    <Award size={24} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-primary-foreground line-clamp-2">
                    {cert.title}
                  </h3>
                </div>
                
                {/* Certificate body */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building size={16} />
                      <span className="text-sm">{cert.organization}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={16} />
                      <span className="text-sm">{cert.year}</span>
                    </div>
                  </div>
                  
                  {cert.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {cert.description}
                    </p>
                  )}
                  
                  {cert.fileUrl && (
                    <Button variant="outline" size="sm" className="w-full group" asChild>
                      <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer">
                        <FileText size={16} />
                        View Certificate
                        <ExternalLink size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <Award size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Certificates Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Professional certifications and achievements will be displayed here once uploaded through the dashboard.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
