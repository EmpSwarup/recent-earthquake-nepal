import { Github, Database, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full py-4 mt-6 border-t border-border/60 bg-card/50 rounded-xl px-4 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="flex items-center gap-1">
            <Database className="size-3.5 text-primary" /> Data Source:
          </span>
          <a
            href="https://earthquake.usgs.gov/earthquakes/feed/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary underline underline-offset-2 font-medium transition-colors"
          >
            USGS Earthquake Hazards Program
          </a>
          <span className="text-border hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3.5 text-emerald-600" /> Nepal Seismic Zone
          </span>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
          <span>
            © {new Date().getFullYear()} Nepal Earthquake Tracker
          </span>
          <a
            href="https://github.com/EmpSwarup/recent-earthquake-nepal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors font-medium"
          >
            <Github className="size-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
