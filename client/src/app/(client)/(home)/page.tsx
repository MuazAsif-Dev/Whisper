import Link from "next/link";

export default function Page() {
	return (
		<>
			<main className="flex flex-col items-center justify-center gap-10 bg-brand-primary-gray py-10">
				<Link href={"/chat"}>Get Started</Link>
			</main>
		</>
	);
}
