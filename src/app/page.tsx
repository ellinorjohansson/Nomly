import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const steps = [
    {
      icon: "edit_note",
      title: "Save",
      description:
        "Clip recipes from any website with a single click. We handle all the messy formatting.",
    },
    {
      icon: "folder_open",
      title: "Organize",
      description:
        "Create collections, add tags, and rate your favorites. Keep everything tidy.",
    },
    {
      icon: "restaurant_menu",
      title: "Cook",
      description:
        "Find exactly what you need to cook tonight. Scale ingredients to your needs.",
    },
    {
      icon: "group",
      title: "Share",
      description:
        "Share your favorite recipes with friends and family instantly.",
    },
  ];

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 bg-primary overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Scattered material symbols */}
          <span className="material-symbols-outlined absolute top-20 left-1/4 text-6xl opacity-20 text-primaryaccent">
            skillet
          </span>
          <span className="material-symbols-outlined absolute top-32 right-1/3 text-5xl opacity-20 text-primaryaccent">
            soup_kitchen
          </span>
          <span className="material-symbols-outlined absolute bottom-40 left-1/3 text-5xl opacity-20 text-primaryaccent">
            flatware
          </span>
          <span className="material-symbols-outlined absolute bottom-20 right-1/4 text-6xl opacity-20 text-primaryaccent">
            lunch_dining
          </span>
          <span className="material-symbols-outlined absolute top-1/2 left-20 text-4xl opacity-20 text-primaryaccent">
            menu_book
          </span>
          <span className="material-symbols-outlined absolute bottom-1/3 right-20 text-5xl opacity-20 text-primaryaccent">
            dinner_dining
          </span>
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-primaryaccent mb-6">
            Your Recipe Collection
          </h1>
          <p className="text-lg text-secondaryaccent mb-8 leading-relaxed">
            Save recipes from anywhere, organize them your way, and never lose a
            great recipe again. Simple. Beautiful. Yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-primaryaccent text-primary rounded-lg font-medium hover:opacity-90 transition"
            >
              Get Started
            </Link>
            <Link
              href="/recipes"
              className="px-8 py-3 border-2 border-primaryaccent text-primaryaccent rounded-lg font-medium hover:bg-secondary transition"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center text-primaryaccent mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl mb-4 flex justify-center">
                  <span className="material-symbols-outlined leading-none text-[3rem] text-primaryaccent">
                    {step.icon}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-primaryaccent mb-3">
                  {step.title}
                </h3>
                <p className="text-secondaryaccent">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative mx-auto h-[48vh] w-full overflow-hidden">
        <Image
          src="/images/background_color.avif"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primaryaccent/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold text-center text-primary! mb-16">
            Why Nomly?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "100% Free",
                desc: "No hidden costs. Save unlimited recipes.",
              },
              {
                title: "Cloud Sync",
                desc: "Access your recipes anywhere, anytime.",
              },
              {
                title: "Easy Import",
                desc: "Submit the form and we handle the rest.",
              },
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-secondary rounded-lg">
                <h3 className="text-lg font-serif font-bold text-primaryaccent mb-2">
                  {feature.title}
                </h3>
                <p className="text-secondaryaccent">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-secondary text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-primaryaccent mb-8">
            Ready to save your recipes?
          </h2>
          <Link
            href="/signup"
            className="inline-block px-8 py-3 bg-primaryaccent text-primary rounded-lg font-medium hover:opacity-90 transition"
          >
            Start today
          </Link>
        </div>
      </section>
    </main>
  );
}
