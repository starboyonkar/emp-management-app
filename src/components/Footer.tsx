import logoImg from "@/assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="OnkarNova Technologies" className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="font-display font-bold text-card-foreground">OnkarNova Technologies</p>
              <p className="text-xs text-muted-foreground">Employee Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} OnkarNova Technologies</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
