"use client";

const Footer = () => {
  return (
    <footer className="border-t border-secondaryaccent bg-secondary px-4 py-6 text-center sm:px-8 sm:text-left lg:px-25">
      {/* Left Column */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 sm:flex-row sm:items-center">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-end sm:gap-5">
          <h2 className="text-3xl font-logo font-bold">Nomly</h2>
          <p className="text-sm text-secondaryaccent mb-1.5">
            &copy; {new Date().getFullYear()} {"Alla rättigheter förbehållna"}
          </p>
        </div>

        {/* Right Column */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-1 text-primaryaccent cursor-pointer"
          aria-label={"Skrolla till toppen"}
        >
          <span className="text-base">Skrolla till toppen</span>
          <span className="material-symbols-outlined text-2xl">
            arrow_upward
          </span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
