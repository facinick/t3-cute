"use client";

export default function HomePage() {
	return (
		<div className="space-y-4">
			<h1 className="font-bold text-2xl">Dashboard</h1>
			<div className="grid auto-rows-min gap-4 md:grid-cols-3">
				<div className="aspect-video rounded-xl bg-muted/50" />
				<div className="aspect-video rounded-xl bg-muted/50" />
				<div className="aspect-video rounded-xl bg-muted/50" />
			</div>
			<div className="min-h-[50vh] flex-1 rounded-xl bg-muted/50" />
		</div>
	);
}
