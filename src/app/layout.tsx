"use client"

import "~/styles/globals.css"

import { Separator } from "@radix-ui/react-context-menu"
import { Geist } from "next/font/google"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { AppSidebar } from "~/components/app-sidebar"
import { ModeToggle } from "~/components/mode-toggle"
import { ThemeProvider } from "~/components/theme-provider"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar"
import { getBreadcrumbs } from "~/config/navigation"
import { TRPCReactProvider } from "~/trpc/react"

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
})

export default function RootLayoutClient({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const breadcrumbs = getBreadcrumbs(pathname)

	return (
		<html lang="en" suppressHydrationWarning className={geist.variable}>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<TRPCReactProvider>
						<div className="relative min-h-screen bg-background">
							<SidebarProvider>
								<AppSidebar />
								<SidebarInset>
									<header className="flex h-16 shrink-0 items-center justify-between border-b px-3">
										<div className="flex items-center gap-2">
											<SidebarTrigger />
											<Separator className="mr-2 h-4" />
											<Breadcrumb>
												<BreadcrumbList>
													{breadcrumbs.map((item, index) => (
														<React.Fragment key={item.path}>
															{index > 0 && <BreadcrumbSeparator />}
															<BreadcrumbItem>
																{index === breadcrumbs.length - 1 ? (
																	<BreadcrumbPage>{item.title}</BreadcrumbPage>
																) : (
																	<BreadcrumbLink asChild>
																		<Link href={item.path}>{item.title}</Link>
																	</BreadcrumbLink>
																)}
															</BreadcrumbItem>
														</React.Fragment>
													))}
												</BreadcrumbList>
											</Breadcrumb>
										</div>
										<div className="flex items-center gap-2">
											<ModeToggle />
										</div>
									</header>
									<main className="flex-1 p-4">
										{children}
									</main>
								</SidebarInset>
							</SidebarProvider>
						</div>
					</TRPCReactProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
