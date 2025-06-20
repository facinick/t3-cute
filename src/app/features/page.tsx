export default function FeaturesPage() {
	return (
		<div className="space-y-4">
			<h1 className="font-bold text-2xl">Features</h1>
			<p className="text-muted-foreground">
				Welcome to the features section. Here you can explore all the features
				of our application.
			</p>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg border p-4">
					<h2 className="font-semibold">Overview</h2>
					<p className="text-muted-foreground text-sm">
						Get a comprehensive overview of all features.
					</p>
				</div>
				<div className="rounded-lg border p-4">
					<h2 className="font-semibold">Analytics</h2>
					<p className="text-muted-foreground text-sm">
						View detailed analytics and insights.
					</p>
				</div>
				<div className="rounded-lg border p-4">
					<h2 className="font-semibold">Reports</h2>
					<p className="text-muted-foreground text-sm">
						Generate and view detailed reports.
					</p>
				</div>
			</div>
		</div>
	);
}
