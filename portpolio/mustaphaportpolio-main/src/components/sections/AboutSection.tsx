import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Building2, GraduationCap, Target } from "lucide-react";

interface AboutSectionProps {
  bio?: string;
}

export function AboutSection({ bio }: AboutSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const defaultBio = `I am Mustapha Sani Jibril — CEO of ValorTrust Solution & Consultant Nig. Ltd and a Quantity Surveying student at Bayero University Kano. I combine engineering discipline and commercial thinking to deliver cost-conscious construction solutions and practical digital strategies.

My focus areas include Data Analytics, Marketing Strategy, Small Business Consulting, Product Strategy, and Marketing Campaigns. I help businesses optimize costs, scale digital presence, and translate technical projects into measurable impact.`;

  const stats = [
    { icon: Building2, label: "Company Founded", value: "ValorTrust" },
    { icon: GraduationCap, label: "Field of Study", value: "Quantity Surveying" },
    { icon: Target, label: "Focus", value: "Cost Management" },
    { icon: Award, label: "Commitment", value: "Excellence" },
  ];

  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-wide mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">About Me</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
            CEO Statement
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Bio Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-card rounded-2xl p-8 card-shadow">
              <div className="prose prose-lg max-w-none">
                {(bio || defaultBio).split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-foreground font-display font-semibold text-lg">
                  — Mustapha Sani Jibril
                </p>
                <p className="text-muted-foreground text-sm">
                  Chief Executive Officer, ValorTrust Solution & Consultant Nig. Ltd
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="bg-card rounded-xl p-5 card-shadow hover:card-shadow-hover transition-shadow duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <stat.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <p className="text-foreground font-semibold">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
