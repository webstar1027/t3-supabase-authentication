import { useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import * as z from "zod";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { useToast } from "../components/ui/use-toast";
import { Toaster } from "../components/ui/toaster";

const formSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(2),
});

function SignIn() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);

  const signInWithPassword = async (email: string, password: string) => {
    const { error, data } = isSignUp
      ? await supabase.auth.signUp({
          email,
          password,
        })
      : await supabase.auth.signInWithPassword({
          email,
          password,
        });
    if (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Error with auth" + error.message,
      });
    } else if (data.user) {
      if(data.user.role == "admin"){
        router.push("/admin").catch((err) => {
          console.error("Failed to navigate", err);
        }); 
      } else if(data.user.role == "agent"){
        router.push("/agent").catch((err) => {
          console.error("Failed to navigate", err);
        }); 
      } else{
        router.push("/user").catch((err) => {
          console.error("Failed to navigate", err);
        }); 
      }
      
    }
  };


  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const handleSubmit= async (values: z.infer<typeof formSchema>) =>{
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    await signInWithPassword(values.email, values.password).catch((err) => {
      console.error(err);
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Toaster></Toaster>
      <div className="w-96">
        <div className="flex flex-col items-start">
          <Form {...form}>
            <h1 className="mb-4 text-3xl font-bold text-blue-800">Login</h1>

            <form onSubmit={(event)=>{
                event.preventDefault();
                void form.handleSubmit(handleSubmit)()
              }} 
            className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input className="w-96" placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="w-96"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">Sign In</Button>
               
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
