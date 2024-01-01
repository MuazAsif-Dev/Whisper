import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession();

	if (session) {
		redirect("/");
	}

	return (
		<div className=" flex h-screen flex-col">
			<header className="flex w-full justify-center border-b border-gray-300 py-6">
				<div className="flex w-full max-w-4xl justify-center"></div>
			</header>
			<div className="flex-1 py-2">{children}</div>
			<footer className="flex w-full justify-center bg-mz-background px-5 pb-10">
				<nav className="flex w-full max-w-4xl justify-end">
					<ul className="flex gap-2">
						<li>
							<Link href="">Help</Link>
						</li>
						<li>
							<Link href="">Privacy</Link>
						</li>
						<li>
							<Link href="">Terms</Link>
						</li>
					</ul>
				</nav>
			</footer>
		</div>
	);
}
