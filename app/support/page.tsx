import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
    return (
        <div className="flex min-h-screen flex-col bg-black text-white">
            {/* Header */}
            <header className="flex h-20 items-center justify-between px-4 md:px-6 border-b border-zinc-800">
                <div className="relative h-10 w-24 md:w-32">
                    <Image
                        src="/logo.png"
                        alt="Trend Analyzer"
                        fill
                        className="object-contain invert"
                        priority
                    />
                </div>
                <Link href="/">
                    <Button variant="ghost" className="text-gray-300 hover:text-white text-sm md:text-base">
                        Back to Home
                    </Button>
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-2xl space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                            Thank You! ☕
                        </h1>
                        <p className="text-base md:text-lg text-gray-400 max-w-xl mx-auto px-4">
                            Your support helps keep Trend Analyzer running and continuously improving. 
                            Every contribution, no matter how small, is deeply appreciated!
                        </p>
                    </div>

                    {/* QR Code */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-md mx-auto">
                        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-4">
                            <Image
                                src="/qr-payment.png"
                                alt="Payment QR Code"
                                fill
                                className="object-contain rounded-lg"
                                priority
                            />
                        </div>
                        <p className="text-xs md:text-sm text-gray-500">
                            Scan the QR code with your payment app
                        </p>
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2 text-sm md:text-base text-gray-400 px-4">
                        <p> Your support fuels new features</p>
                        <p> Helps maintain AI model infrastructure</p>
                        <p> Enables continuous trend analysis updates</p>
                    </div>

                    <div className="pt-6">
                        <Link href="/dashboard">
                            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                                Continue to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 border-t border-zinc-900 text-center text-gray-600 text-xs md:text-sm">
                <p>Built with ❤️ by the W&W Tech team</p>
            </footer>
        </div>
    );
}
