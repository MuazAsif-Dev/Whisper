"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import LotteryIllustrationSVG from "@/assets/images/LotteryIllustrationSVG";
import Button from "@/components/Button";
// import Checkbox from "@/components/Checkbox";
import Input from "@/components/Input";
import { envClient } from "@/config/env.client";
import { UserSignUpSchema } from "@/schemas/signup.schema";

export default function SignUp() {
	const [verificationText, setVerificationText] = useState("Send Code");
	const router = useRouter();

	type UserSignUpType = z.infer<typeof UserSignUpSchema>;

	const {
		register,
		handleSubmit,
		getValues,
		trigger,
		formState: { isSubmitting, errors },
	} = useForm<UserSignUpType>({
		resolver: zodResolver(UserSignUpSchema),
	});

	const verifyNumber = async (data: string) => {
		try {
			const res = await fetch(
				`${envClient.NEXT_PUBLIC_API_BASE_URL}/auth/verify-number`,
				{
					method: "POST",
					body: JSON.stringify(data),
				},
			);
			const result = await res.json();
			return result;
		} catch (err) {
			console.log(err);
		}
	};

	const onSubmit: SubmitHandler<UserSignUpType> = async (data) => {
		try {
			const res = await fetch(
				`${envClient.NEXT_PUBLIC_API_BASE_URL}/auth/signup`,
				{
					method: "POST",
					body: JSON.stringify(data),
				},
			);

			const result = await res.json();

			toast(result.message);

			if (result.message === "User registered successfully") {
				return router.push("/login");
			}
			return;
		} catch (err) {
			console.log(err);
			toast.error("Failed to register");
		}
	};

	return (
		<div className="flex h-full w-full items-center justify-center px-5">
			<div className="flex w-full max-w-4xl rounded-xl border border-gray-400 bg-white py-10 md:gap-4">
				<div className="flex flex-1 flex-col gap-8 px-6 pb-16 md:px-10">
					<div className="space-y-2">
						<h2 className="text-2xl font-medium">Create an account</h2>
						<p className="flex gap-1 text-sm font-light">
							Already have an account?
							<Link
								href="/login"
								className="text-brand-primary-red underline underline-offset-4"
							>
								Log in
							</Link>
						</p>
					</div>
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-5"
					>
						<Input
							label="Phone number"
							inputMode="numeric"
							placeholder="Enter your phone number"
							{...register("phone", {
								required: true,
								onChange: () => trigger("phone"),
							})}
						/>
						{errors.phone && (
							<span className="text-sm text-red-600">
								{errors.phone.message}
							</span>
						)}
						<div className="flex items-end gap-10">
							<Input
								type="text"
								label="Verification Code"
								placeholder="Enter your verification code"
								{...register("verificationCode", { required: true })}
							/>
							<Button
								className="p-5"
								size="sm"
								disabled={verificationText === "Sending..."}
								onClick={async () => {
									const number = getValues("phone");
									if (!number || number === "") {
										await trigger("phone", { shouldFocus: true });
										return;
									}

									if (!errors.phone) {
										setVerificationText("Sending...");
										toast.promise(verifyNumber(number), {
											loading: "Sending Verification Code",
											success: (data) => {
												setVerificationText("Resend");
												return data.message;
											},
											error: "Error sending verification code",
										});
									}
								}}
							>
								{verificationText}
							</Button>
						</div>
						{errors.verificationCode && (
							<span className="text-sm text-red-600">
								{errors.verificationCode.message}
							</span>
						)}

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
						<Input
							type="text"
							label="Referral Code"
							placeholder="Enter your referral code"
							{...register("referralCode", { required: true })}
						/>
						{errors.referralCode && (
							<span className="text-sm text-red-600">
								{errors.referralCode.message}
							</span>
						)}
						<label className="flex flex-col gap-2 text-sm">
							{/* <Checkbox
								value={"test"}
								isRequired
								{...register("acceptTerms", { required: true })}
								onChange={(e) => {
									e.target.checked
										? (e.target.value = "accept")
										: (e.target.value = "");
									console.log(e.target.value, e.target.checked);
								}}
							> */}
							<span className="flex gap-2">
								<input
									value={"accept"}
									type="checkbox"
									{...register("acceptTerms", { required: true })}
								/>
								I agree to all the{" "}
								<Link
									href="#"
									className="text-brand-primary-red underline underline-offset-4"
								>
									privacy policy
								</Link>
							</span>

							{/* </Checkbox> */}
							{errors.acceptTerms && (
								<span className="text-red-600">
									{errors.acceptTerms.message}
								</span>
							)}
						</label>
						<div className="flex items-center justify-between">
							<Link href="/login" className="underline underline-offset-4">
								Log in instead
							</Link>
							<Button type="submit" isLoading={isSubmitting}>
								Register
							</Button>
						</div>
					</form>
				</div>
				<LotteryIllustrationSVG
					className="hidden sm:block"
					width="300"
					height="390"
				/>
			</div>
		</div>
	);
}
