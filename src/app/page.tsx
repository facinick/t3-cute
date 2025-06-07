import { ChatInterface } from "~/components/chat-interface";
import { ModeToggle } from "~/components/mode-toggle";
import { MusicPlayer } from "~/components/music-player";
import { WeatherCard } from "~/components/weather-card";

export default function Home() {
	return (
		<div className="relative min-h-screen bg-background">
			{/* Header */}
			<header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<a className="flex items-center space-x-2" href="/">
								<span className="text-xl font-bold tracking-tight">UI Components</span>
							</a>
						</div>
						<div className="flex items-center gap-4">
							<ModeToggle />
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
				<div className="mx-auto max-w-7xl space-y-8">
					<div className="space-y-2 text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
							UI Components Showcase
						</h1>
						<p className="text-lg text-muted-foreground">
							A collection of beautiful and functional UI components built with shadcn/ui
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-2">
						<div className="space-y-8">
							<div className="flex justify-center">
								<MusicPlayer />
							</div>
							<div className="flex justify-center">
								<ChatInterface />
							</div>
						</div>
						<div className="space-y-8">
							<div className="flex justify-center">
								<WeatherCard />
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
