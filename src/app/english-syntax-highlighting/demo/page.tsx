import { SemanticHighlighter } from "~/components/semantic-highlighter";

export default function EnglishSyntaxHighlightingDemoPage() {
	return (
		<div className="space-y-4">
			<h1 className="font-bold text-2xl">English Syntax Highlighting Demo</h1>
			<div className="text-muted-foreground mb-8">
				Try out the semantic highlighter by entering text below. The tool will analyze and highlight
				different parts of speech, named entities, and other linguistic elements.
			</div>
			<SemanticHighlighter />
		</div>
	);
}
