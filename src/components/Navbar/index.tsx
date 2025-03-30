function Navbar() {
  return (
    <nav className="text-black p-4">
      <div className="mb-3 md:mb-6">
        <h1 className="text-xl md:text-3xl font-bold tracking-tight">
          Recent Earthquake in Nepal Tracker
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Visualize recent earthquake activity in Nepal and surrounding regions
        </p>
      </div>
    </nav>
  );
}

export default Navbar;
