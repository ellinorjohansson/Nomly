"use client";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-primary">
      <div className="max-w-xl w-full text-center p-8 rounded-2xl bg-primary/60 backdrop-blur-sm">
        <h2 className="text-3xl text-primaryaccent mb-2">Whoops!</h2>
        <p className="text-secondaryaccent mb-6">This page do not exist</p>

        <div className="flex justify-center gap-4"></div>
      </div>
    </main>
  );
}
