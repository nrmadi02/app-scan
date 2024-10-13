"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type ILoginSchema, loginSchema } from "./types/signin-request.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const SignInContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callback = searchParams.get("callbackUrl");
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm<ILoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: ILoginSchema) => {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.ok === false) {
      loginForm.setError("password", {
        type: "manual",
        message: "Invalid email or password",
      });

      return false;
    }

    router.replace(callback ?? "/dashboard");

    return true;
  };

  return (
    <Form {...loginForm}>
      <form
        className="mt-[30vh] flex w-full flex-col gap-5"
        onSubmit={loginForm.handleSubmit(handleLogin)}
        autoComplete="off"
      >
        <h1 className="text-3xl font-bold">Sign In</h1>
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="your password" {...field} />
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 top-0 flex items-center justify-center px-3 py-2 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon
                        className="text-sm text-neutral-500"
                        width={20}
                      />
                    ) : (
                      <EyeIcon
                        className="text-sm text-neutral-500"
                        width={20}
                      />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign In</Button>
      </form>
    </Form>
  );
};

export default SignInContainer;
