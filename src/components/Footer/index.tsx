function Footer() {
  return (
    <footer className=" text-black text-center p-4 fixed bottom-0 w-full">
      <p>
        &copy; 2025 Recent Earthquake in Nepal Tracker. All rights reserved.
      </p>
      <p>
        Data provided by{" "}
        <a
          href="https://earthquake.usgs.gov/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-300"
        >
          USGS
        </a>
      </p>
    </footer>
  );
}

export default Footer;
