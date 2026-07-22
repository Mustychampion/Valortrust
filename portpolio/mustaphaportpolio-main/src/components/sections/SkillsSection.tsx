import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Calculator, 
  Monitor, 
  BarChart3, 
  Users, 
  Palette, 
  Globe, 
  Box,
  FolderOpen,
  TrendingUp,
  Megaphone,
  Briefcase,
  Target
} from "lucide-react";

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface SkillsSectionProps {
  skills?: Skill[];
}

const categoryIcons: Record<string, React.ElementType> = {
  "QS": Calculator,
  "Digital": Monitor,
  "Analysis": BarChart3,
  "Data & Analysis": TrendingUp,
  "ICT Leadership": Users,
  "Design": Palette,
  "Web": Globe,
  "3D": Box,
  "Marketing": Megaphone,
  "Small Business Consulting": Briefcase,
  "Consulting": Briefcase,
  "Product Strategy": Target,
  "Strategy": Target,
};

const categoryColors: Record<string, string> = {
  "QS": "bg-emerald-500/10 text-emerald-600",
  "Digital": "bg-blue-500/10 text-blue-600",
  "Analysis": "bg-purple-500/10 text-purple-600",
  "Data & Analysis": "bg-violet-500/10 text-violet-600",
  "ICT Leadership": "bg-orange-500/10 text-orange-600",
  "Design": "bg-pink-500/10 text-pink-600",
  "Web": "bg-cyan-500/10 text-cyan-600",
  "3D": "bg-amber-500/10 text-amber-600",
  "Marketing": "bg-rose-500/10 text-rose-600",
  "Small Business Consulting": "bg-teal-500/10 text-teal-600",
  "Consulting": "bg-teal-500/10 text-teal-600",
  "Product Strategy": "bg-indigo-500/10 text-indigo-600",
  "Strategy": "bg-indigo-500/10 text-indigo-600",
};

export function SkillsSection({ skills = [] }: SkillsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const hasSkills = skills.length > 0;

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <section id="skills" className="section-padding bg-secondary/30">
      <div className="container-wide mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Expertise</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
            Skills & Competencies
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mt-4" />
        </motion.div>

        {hasSkills ? (
          <div className="space-y-12">
            {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => {
              const Icon = categoryIcons[category] || FolderOpen;
              const colorClass = categoryColors[category] || "bg-primary/10 text-primary";
              
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center`}>
                      <Icon size={20} />
                    </div>
                    <h3 className="font-display font-semibold text-xl text-foreground">{category}</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                        className="bg-card rounded-xl p-5 card-shadow hover:card-shadow-hover transition-all duration-300 group"
                      >
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {skill.name}
                        </h4>
                        <p className="text-muted-foreground text-sm mt-2">
                          {skill.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <FolderOpen size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Skills Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Skills and competencies will be displayed here once added through the dashboard.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
