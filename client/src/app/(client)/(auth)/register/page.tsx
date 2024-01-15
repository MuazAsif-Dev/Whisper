import { Input } from "@nextui-org/react";
import Link from "next/link";

export default function Register() {
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
						Register for an account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6" action="#" method="POST">
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium leading-6"
							>
								Username
							</label>
							<div className="mt-2">
								<Input variant="bordered" />
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
								<Input variant="bordered" />
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Register
							</button>
						</div>
					</form>

					<p className="mt-10 text-center text-sm text-gray-500">
					Already have an account?{" "}
						<Link
							href="/login"
							className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
						>
							Log in
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
