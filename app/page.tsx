import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Navbar */}
      <header className="flex h-20 items-center justify-between px-6 border-b border-zinc-800">
        <div className="relative h-10 w-32">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain invert"
            priority
          />
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-300 hover:text-white">Sign In</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-white text-black hover:bg-gray-200">Request Access</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="relative h-24 w-64 mx-auto mb-8">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain invert"
              priority
            />
          </div>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl text-white">
            Dominate the <span className="text-gray-500">Algorithm</span>.
          </h1>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            The advanced AI platform for analyzing viral trends, generating retention-focused captions, and automating your Instagram strategy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/login">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 h-14 px-8 text-lg w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-zinc-700 text-gray-300 hover:text-white hover:bg-zinc-800 h-14 px-8 text-lg w-full sm:w-auto">
                Member Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Grid (Minimal) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full border-t border-zinc-900 pt-16">
          <div className="p-6 border border-zinc-900 rounded-lg bg-zinc-950/50">
            <h3 className="text-xl font-semibold mb-2 text-white">Deep Trend Analysis</h3>
            <p className="text-gray-500">Semantic matching using Sentence-BERTino to find what's actually working.</p>
          </div>
          <div className="p-6 border border-zinc-900 rounded-lg bg-zinc-950/50">
            <h3 className="text-xl font-semibold mb-2 text-white">Visual Intelligence</h3>
            <p className="text-gray-500">Vision Transformers analyze your content for aesthetic and safety compliance.</p>
          </div>
          <div className="p-6 border border-zinc-900 rounded-lg bg-zinc-950/50">
            <h3 className="text-xl font-semibold mb-2 text-white">Audio Transcription</h3>
            <p className="text-gray-500">Whisper-AR integration to extract and analyze hooks from trending audio.</p>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-zinc-900 text-center text-sm">
        <p className="text-gray-600">&copy; {new Date().getFullYear()} Trend Analyzer. Private Access Only.</p>
        <div className="mt-4">
          <Link href="/support">
            <Button variant="ghost" className="text-gray-500 hover:text-white text-xs">
              ☕ Buy the developer a coffee
            </Button>
          </Link>
        </div>
      </footer>
    </div>
  );
}
