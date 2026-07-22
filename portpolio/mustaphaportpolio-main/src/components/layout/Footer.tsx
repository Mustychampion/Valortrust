import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-wide mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-foreground flex items-center justify-center">
                <span className="text-primary font-display font-bold text-lg">M</span>
              </div>
              <span className="font-display font-semibold text-xl">Mustapha Sani Jibril</span>
            </div>
            <p className="text-primary-foreground/80 max-w-md mb-4">
              CEO of ValorTrust Solution & Consultant Nig. Ltd. Quantity Surveying professional dedicated to delivering excellence in cost management and project consulting.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/#about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link to="/#skills" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Skills
                </Link>
              </li>
              <li>
                <Link to="/#projects" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/#contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-primary-foreground/80">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm break-all">mustaphasanijibrinjikanjaji@gmail.com</span>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/80">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">09095569295</span>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/80">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">No. 125 ZBB qtr, KMC Kano, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} Mustapha Sani Jibril. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm">
            CEO, ValorTrust Solution & Consultant Nig. Ltd
          </p>
        </div>
      </div>
    </footer>
  );
}
