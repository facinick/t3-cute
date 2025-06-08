import { Code2, GalleryVerticalEnd } from "lucide-react";

export type NavItem = {
	title: string;
	path: string;
	icon?: React.ComponentType<{ className?: string }>;
	items?: NavItem[];
};

export const navigation: NavItem[] = [
	{
		title: "Dashboard",
		path: "/",
		icon: GalleryVerticalEnd,
	},
	{
		title: "Features",
		path: "/features",
		items: [
			{
				title: "Overview",
				path: "/features/overview",
			},
			{
				title: "Analytics",
				path: "/features/analytics",
			},
			{
				title: "Reports",
				path: "/features/reports",
			},
		],
	},
	{
		title: "English Syntax Highlighting",
		path: "/english-syntax-highlighting",
		icon: Code2,
		items: [
			{
				title: "Demo",
				path: "/english-syntax-highlighting/demo",
			},
		],
	},
];

// Helper function to get breadcrumbs for a given path
export function getBreadcrumbs(path: string): NavItem[] {
	const segments = path.split("/").filter(Boolean);
	const breadcrumbs: NavItem[] = [];
	let currentPath = "";

	for (const segment of segments) {
		currentPath += `/${segment}`;
		const findInNav = (items: NavItem[]): NavItem | undefined => {
			for (const item of items) {
				if (item.path === currentPath) return item;
				if (item.items) {
					const found = findInNav(item.items);
					if (found) return found;
				}
			}
		};
		const item = findInNav(navigation);
		if (item) breadcrumbs.push(item);
	}

	return breadcrumbs;
}
