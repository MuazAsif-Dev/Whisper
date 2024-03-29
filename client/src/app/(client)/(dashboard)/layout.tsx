import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import Sidebar from "./Sidebar";
import LogoutButton from "./LogoutButton";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		redirect("/login");
	}

	return (
		<div className=" flex h-screen">
			{/* <header className="flex w-full justify-center border-b border-gray-300 py-6">
				<div className="flex w-full max-w-4xl justify-center"></div>
			</header> */}
			<div className="p-5">
				<Sidebar />
			</div>
			<div>
				<div className="w-full">
					<nav className="w-full flex justify-end">
						<LogoutButton />
					</nav>
				</div>

				<pre>{JSON.stringify(session, undefined, 2)}</pre>
				<div className="flex-1 py-2">{children}</div>
			</div>
			{/* <footer className="flex w-full justify-center bg-mz-background px-5 pb-10">
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
			</footer> */}
		</div>
	);
}
