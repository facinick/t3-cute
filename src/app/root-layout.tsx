import RootLayoutClient from "./layout";
import { metadata } from "./metadata";

export { metadata };

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <RootLayoutClient>{children}</RootLayoutClient>;
}
