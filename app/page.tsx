import Link from "next/link"
import { Button } from "@/components/ui/button"
import { YoutubeIcon, BookOpen, Clock, Brain, Download, CheckCircle, Image } from "lucide-react"
import recapify from "../public/recapify.png"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <YoutubeIcon className="h-6 w-6 text-red-600" />
             {/* <Image src={recapify} alt="recapify" /> */}
            <span className="text-xl font-bold">Recapify</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:scale-105 transition-transform">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-md">
                Sign Up
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Gradient */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
          <div className="container relative py-20 md:py-32 lg:py-40">
            <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
              <div className="animate-fade-in-up">
                <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1] bg-gradient-to-r from-purple-700 via-red-500 to-orange-500 bg-clip-text text-transparent">
                  Transform YouTube Videos into Detailed Notes
                </h1>
                <p className="mt-6 max-w-[750px] tex-center text-lg text-muted-foreground sm:text-xl">
                  Enter a YouTube video ID and get comprehensive notes generated for you. Perfect for students,
                  researchers, and content creators.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row animate-fade-in-up animation-delay-300">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 border-2 hover:scale-105 transition-all duration-300 shadow-md"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>

              {/* Floating elements animation */}
              <div className="absolute top-1/4 left-10 animate-float-slow opacity-20">
                <YoutubeIcon size={80} className="text-red-500" />
              </div>
              <div className="absolute bottom-1/4 right-10 animate-float opacity-20">
                <BookOpen size={60} className="text-blue-500" />
              </div>
              <div className="absolute top-2/3 left-1/4 animate-float-slow opacity-20">
                <Brain size={50} className="text-purple-500" />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container py-20 md:py-32">
          <div className="mx-auto grid max-w-5xl items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6 animate-fade-in-up">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  How It Works
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes it easy to create, organize, and review notes from any YouTube video.
                </p>
              </div>
              <ul className="grid gap-8">
                <li className="flex items-start gap-4 group">
                  <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-2 shadow-md group-hover:shadow-lg transition-all duration-300">
                    <YoutubeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold group-hover:translate-x-1 transition-transform">
                      1. Enter Video ID
                    </h3>
                    <p className="text-muted-foreground">
                      Simply paste the YouTube video ID into our generator. You can find this in the URL of any YouTube
                      video.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group">
                  <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-2 shadow-md group-hover:shadow-lg transition-all duration-300">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold group-hover:translate-x-1 transition-transform">
                      2. Generate Notes
                    </h3>
                    <p className="text-muted-foreground">
                      Our advanced AI system analyzes the video content, transcribes the audio, and creates
                      comprehensive, structured notes.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4 group">
                  <div className="rounded-full bg-gradient-to-br from-pink-500 to-red-500 p-2 shadow-md group-hover:shadow-lg transition-all duration-300">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="grid gap-1">
                    <h3 className="text-xl font-bold group-hover:translate-x-1 transition-transform">3. Edit & Save</h3>
                    <p className="text-muted-foreground">
                      Review, edit, and save your notes for future reference. Download them in print-friendly format for
                      offline use.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mx-auto aspect-video w-full max-w-[500px] overflow-hidden rounded-xl border bg-background p-2 shadow-xl animate-fade-in-up animation-delay-300 group hover:shadow-2xl transition-all duration-500">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg group-hover:scale-[1.02] transition-transform duration-500">
                <YoutubeIcon className="h-20 w-20 text-red-600 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Powerful Features
              </h2>
              <p className="mt-4 max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed">
                Everything you need to transform video content into organized, accessible notes
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Clock,
                  title: "Time-Saving",
                  description:
                    "Convert hours of video content into concise notes in minutes, saving you valuable time.",
                },
                {
                  icon: Brain,
                  title: "AI-Powered Analysis",
                  description:
                    "Our advanced AI identifies key concepts, important points, and creates structured notes.",
                },
                {
                  icon: Download,
                  title: "Export & Print",
                  description: "Download your notes in print-friendly format for offline study or sharing with others.",
                },
                {
                  icon: CheckCircle,
                  title: "Accuracy",
                  description: "High-quality transcription and summarization ensures you don't miss important details.",
                },
                {
                  icon: YoutubeIcon,
                  title: "Works with Any Video",
                  description:
                    "Compatible with any YouTube video - educational content, tutorials, lectures, and more.",
                },
                {
                  icon: BookOpen,
                  title: "Organized Library",
                  description: "Keep all your notes organized in one place for easy reference and review.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="rounded-full bg-gradient-to-br from-purple-500 to-blue-500 p-3 w-fit mb-4 shadow-md">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container py-20 md:py-32">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="mt-4 max-w-[700px] mx-auto text-muted-foreground md:text-xl/relaxed">
              Join thousands of students and professionals who save time with Recapify
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                role: "Graduate Student",
                content:
                  "Recapify has been a game-changer for my research. I can quickly convert lecture videos into comprehensive notes without spending hours transcribing.",
              },
              {
                name: "Michael Chen",
                role: "Content Creator",
                content:
                  "As someone who watches a lot of tutorial videos, this tool helps me organize what I learn. The print feature is especially useful when I need to reference techniques offline.",
              },
              {
                name: "Priya Patel",
                role: "High School Teacher",
                content:
                  "I use Recapify to create study guides for my students. The AI does an amazing job of capturing key points from educational videos.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="space-y-4">
                  <p className="italic text-muted-foreground">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-16 md:py-24">
          <div className="container text-center">
            <div className="mx-auto max-w-[800px] animate-fade-in-up">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white mb-6">
                Ready to Transform How You Learn from Videos?
              </h2>
              <p className="mb-8 text-lg text-white/90">
                Join thousands of students, researchers, and professionals who use Recapify to save time and
                learn more effectively.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="h-12 px-8 bg-white text-purple-600 hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Get Started for Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 border-2 border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-300"
                  >
                    Login to Your Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <YoutubeIcon className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold">Recapify</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 text-sm">
              <div>
                <h3 className="font-semibold mb-3">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                      Cookies
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Recapify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

