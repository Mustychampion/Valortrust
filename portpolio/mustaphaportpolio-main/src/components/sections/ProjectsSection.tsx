import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, Wrench, TrendingUp, Image, FolderKanban } from "lucide-react";

export interface Project {
  id: string;
  name: string;
  role: string;
  tools: string[];
  description: string;
  impact?: string;
  imageUrl?: string;
}

interface ProjectsSectionProps {
  projects?: Project[];
}

export function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const hasProjects = projects.length > 0;

  return (
    <section id="projects" className="section-padding bg-secondary/30">
      <div className="container-wide mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Portfolio</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mt-4" />
        </motion.div>

        {hasProjects ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 group"
              >
                {/* Project image */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center hero-gradient">
                      <FolderKanban size={48} className="text-primary-foreground/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Project content */}
                <div className="p-6">
                  <h3 className="font-display font-semibold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-primary mb-4">
                    <Briefcase size={16} />
                    <span className="text-sm font-medium">{project.role}</span>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tools */}
                  <div className="flex items-start gap-2 mb-4">
                    <Wrench size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex flex-wrap gap-2">
                      {project.tools.map((tool, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Impact */}
                  {project.impact && (
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-start gap-2">
                        <TrendingUp size={16} className="text-accent mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-foreground">
                          <span className="font-medium">Impact:</span> {project.impact}
                        </p>
                      </div>
                    </div>
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
              <FolderKanban size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Projects Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Featured projects and case studies will be showcased here once added through the dashboard.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
