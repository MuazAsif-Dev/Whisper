"use client"

import { Button } from "@nextui-org/react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
	return (
		<div className="flex items-center gap-4">
			<Button onClick={() => signOut()}>Log Out</Button>
		</div>
	);
}
