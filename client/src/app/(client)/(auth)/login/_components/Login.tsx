"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { UserLoginSchema } from "@/schemas/login.schema";

export default function Login() {
	const router = useRouter();

	type UserLoginType = z.infer<typeof UserLoginSchema>;

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<UserLoginType>({
		resolver: zodResolver(UserLoginSchema),
	});

	const onSubmit: SubmitHandler<UserLoginType> = async (data) => {
		try {
			const res = await signIn("credentials", {
				password: data.password,
				redirect: false,
			});

			if (res?.error) {
				toast.error("Failed to login");
			}

			if (!res?.error) {
				router.push("/");
				router.refresh();
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="flex h-full w-full items-center justify-center px-5">
			<div className="flex w-full max-w-4xl rounded-xl border border-gray-400 bg-white py-10 md:gap-4">
				<div className="flex flex-1 flex-col gap-8 px-6 pb-16 md:px-10">
					<div className="space-y-2">
						<h2 className="text-2xl font-medium">Log in</h2>
						<p className="flex gap-1 text-sm font-light">
							Don&apos;t have an account?
							<Link href="/signup" className="text-red-500 underline">
								Sign up
							</Link>
						</p>
					</div>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-5"
					>
						<Input
							type="password"
							label="Password"
							placeholder="Enter your password"
							{...register("password", { required: true })}
						/>
						{errors.password && (
							<span className="text-sm text-red-600">
								{errors.password.message}
							</span>
						)}
						<div className="flex justify-end">
							<Link
								href="/forgot-password"
								className="underline underline-offset-4"
							>
								Forgot your password
							</Link>
						</div>
						<div className="flex items-center justify-between">
							<Link href="/signup" className="underline underline-offset-4">
								Sign up instead
							</Link>
							<Button type="submit" isLoading={isSubmitting}>
								Log in
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
