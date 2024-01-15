"use client"

import { UserLoginSchema } from "@/schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const {AnonymousUserLoginSchema} = UserLoginSchema

export default function Login() {
	const router = useRouter();

	type UserLoginType = z.infer<typeof AnonymousUserLoginSchema>;

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<UserLoginType>({
		resolver: zodResolver(AnonymousUserLoginSchema),
	});

	const onSubmit: SubmitHandler<UserLoginType> = async (data) => {
		try {
			const res = await signIn("credentials", {
				username:data.username,
				password: data.password,
				redirect: false,
			});

			if (res?.error) {
				toast.error("Failed to login");
			}

			if (!res?.error) {
				router.push("/chat");
				router.refresh();
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			{/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					{/* <Image
						className="mx-auto h-10 w-auto"
						src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
						alt="Your Company"
					/> */}
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
						Sign in to your account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6" action="#" method="POST">
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium leading-6"
							>
								Username
							</label>
							<div className="mt-2">
								<Input variant="bordered" 
								{...register("username", { required: true })}
								/>
						{errors.username && (
							<span className="text-sm text-red-600">
								{errors.username.message}
							</span>
						)}

							</div>
						</div>

						<div>
							<div >
								<label
									htmlFor="password"
									className="block text-sm font-medium leading-6 "
								>
									Password
								</label>
							</div>
							<div className="mt-2">
								<Input variant="bordered" 
								{...register("password", { required: true })}
								/>
								{errors.password && (
							<span className="text-sm text-red-600">
								{errors.password.message}
							</span>
						)}

							</div>
						</div>

						<div>
							<Button
								type="submit"
								className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								isLoading={isSubmitting}
							>
								Log in
							</Button>
						</div>
					</form>

					<p className="mt-10 text-center text-sm text-gray-500">
					Don&apos;t have an account?{" "}
						<Link
							href="/register"
							className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
