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
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4 py-20">
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
          <span className="material-symbols-outlined absolute top-1/2 left-6 hidden text-4xl opacity-20 text-primaryaccent sm:left-20 sm:block">
            menu_book
          </span>
          <span className="material-symbols-outlined absolute bottom-1/3 right-6 hidden text-5xl opacity-20 text-primaryaccent sm:right-20 sm:block">
            dinner_dining
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h1 className="mb-6 text-4xl font-serif font-bold text-primaryaccent sm:text-5xl md:text-6xl">
            Your Recipe Collection
          </h1>
          <p className="mb-8 text-base leading-relaxed text-secondaryaccent sm:text-lg">
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
          <h2 className="mb-12 text-center text-3xl font-serif font-bold text-primaryaccent sm:mb-16 sm:text-4xl">
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
      <section className="relative mx-auto w-full overflow-hidden py-16 sm:py-20">
        <Image
          src="/images/background_color.avif"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primaryaccent/20" />
        <div className="relative mx-auto flex min-h-[32rem] max-w-6xl flex-col items-center justify-center px-4 text-center sm:min-h-[36rem]">
          <h2 className="mb-10 text-center text-3xl font-serif font-bold text-primary! sm:mb-16 sm:text-4xl">
            Why Nomly?
          </h2>
          <div className="grid w-full gap-6 md:grid-cols-3 md:gap-8">
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
              <div key={i} className="rounded-lg bg-secondary p-6 sm:p-8">
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
          <h2 className="mb-8 text-3xl font-serif font-bold text-primaryaccent sm:text-4xl">
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
