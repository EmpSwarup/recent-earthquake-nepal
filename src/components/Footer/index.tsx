import { Github } from "lucide-react";

function Footer() {
  return (
    <footer className="w-full py-3 px-4 mt-4 border-t">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-xs md:text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>Data provided by</span>
          <a
            href="https://earthquake.usgs.gov/earthquakes/feed/"
            target="_blank"
            className="text-primary hover:underline font-medium"
          >
            USGS Earthquake Hazards Program
          </a>
        </div>

        <div className="flex items-center gap-4">
          <span>
            © {new Date().getFullYear()} Recent Earthquake in Nepal Tracker
          </span>
          <a
            href="https://github.com/EmpSwarup/recent-earthquake-nepal"
            target="_blank"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
