export default function FeaturesOverviewPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Features Overview</h1>
      <p className="text-muted-foreground">
        Get a comprehensive overview of all features available in the application.
      </p>
      <div className="prose prose-sm dark:prose-invert">
        <h2>Key Features</h2>
        <ul>
          <li>Comprehensive analytics dashboard</li>
          <li>Detailed reporting system</li>
          <li>Real-time data monitoring</li>
          <li>Customizable settings</li>
        </ul>
      </div>
    </div>
  )
} 