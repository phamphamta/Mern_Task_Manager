import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo";
import GoogleOauthButton from "@/components/auth/google-oauth-button";
import { useMutation } from "@tanstack/react-query";
import { loginMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const formSchema = z.object({
    email: z.string().trim().email("Invalid email address").min(1, {
      message: "Email is required",
    }),
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    mutate(values, {
      onSuccess: (data) => {
        const user = data.user;
        console.log(user);
        const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;
        navigate(decodedUrl || `/workspace/${user.currentWorkspace}`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-0">
      <div className="flex w-full min-h-svh md:flex-row flex-col">
        {/* Left Form Panel */}
        <div className="flex w-full md:w-1/2 flex-col items-center justify-center p-6 md:p-10 bg-background relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 self-start font-medium text-2xl mb-4">
              <Logo />
              <span className="font-bold tracking-tight">Team Sync.</span>
            </Link>
            
            <div className="flex flex-col gap-6">
              <Card className="border-0 shadow-none bg-transparent sm:bg-card sm:border sm:shadow-sm sm:rounded-2xl">
                <CardHeader className="text-left px-0 sm:px-6">
                  <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Login with your Email or Google account
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 sm:px-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="grid gap-6">
                        <div className="flex flex-col gap-4">
                          <GoogleOauthButton label="Login" />
                        </div>
                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                          <span className="relative z-10 bg-background sm:bg-card px-2 text-muted-foreground">
                            Or continue with
                          </span>
                        </div>
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-sm font-medium">
                                    Email
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="m@example.com"
                                      className="!h-[48px] rounded-xl bg-input/50 focus:bg-background transition-colors"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-2">
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center">
                                    <FormLabel className="text-sm font-medium">
                                      Password
                                    </FormLabel>
                                    <a
                                      href="#"
                                      className="ml-auto text-sm text-primary hover:underline font-medium"
                                    >
                                      Forgot your password?
                                    </a>
                                  </div>
                                  <FormControl>
                                    <Input
                                      type="password"
                                      className="!h-[48px] rounded-xl bg-input/50 focus:bg-background transition-colors"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <Button
                            disabled={isPending}
                            type="submit"
                            className="w-full h-[48px] rounded-xl font-semibold text-md mt-2 shadow-lg hover:shadow-primary/25 transition-all duration-300"
                          >
                            {isPending && <Loader className="animate-spin mr-2" />}
                            Login
                          </Button>
                        </div>
                        <div className="text-center text-sm font-medium text-muted-foreground">
                          Don&apos;t have an account?{" "}
                          <Link
                            to="/sign-up"
                            className="text-primary underline-offset-4 hover:underline"
                          >
                            Sign up
                          </Link>
                        </div>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              <div className="text-balance text-left text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </div>
            </div>
          </div>
        </div>

        {/* Right Abstract Image Panel */}
        <div className="hidden md:flex w-1/2 relative bg-primary items-center justify-center overflow-hidden">
          <img 
            src="/abstract-bg.png" 
            alt="Abstract Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
          
          <div className="relative z-20 flex flex-col items-center justify-center text-white p-12 text-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 fill-mode-both">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl max-w-md">
              <h1 className="text-4xl font-extrabold mb-4 tracking-tight drop-shadow-md">Sync Your Team.</h1>
              <p className="text-lg opacity-90 leading-relaxed text-white/80">
                Experience the future of organizational productivity. Seamless, intuitive, and remarkably powerful.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
