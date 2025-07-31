import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl">Welcome to Paletto</h1>
      <p className="mt-4">
        Paletto is a friendly tool for developers to design and preview a custom theme for their
        next project.
      </p>
      <p className="mt-2">
        Whether you’re a solo developer or working without a dedicated designer, Paletto lets you
        generate a palette, adjust spacing and borders, and instantly see the results.
      </p>
      <p className="mt-2">
        Export your theme settings for frameworks like MUI or shadcn/ui, and use them right away.
      </p>
      <p className="mt-4 text-center">
        <Link href="/palette">
          <Button variant="outline" className="cursor-pointer">
            Create palette
          </Button>
        </Link>
      </p>
    </main>
  );
}
