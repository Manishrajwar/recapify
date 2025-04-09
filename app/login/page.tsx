"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { YoutubeIcon } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, collection, query, where } from "firebase/firestore";
import { firestore, app } from "../../lib/firebase";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("manishsinghrajwar80@gmail.com");
  const [password, setPassword] = useState("manish");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setotherloading} = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setotherloading(true);
    setError("");

    const auth = getAuth(app);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userQuery = query(
        collection(firestore, "users"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
          Cookies.set("recapify_user", JSON.stringify("true"), { path: "/" });

        router.push("/dashboard"); 
      } else {
        setError("User data not found in Firestore.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      switch (error.code) {
        case "auth/user-not-found":
          setError("No user found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("The email address is not valid.");
          break;
        case "auth/invalid-credential":
          setError("Invalid Credential.");
          break;
        case "auth/user-disabled":
          setError("This user account has been disabled.");
          break;
        default:
          setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
      setotherloading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      {loading && (
       <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">
       <div className="flex flex-col items-center">
         <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" style={{ borderColor: "rgba(124, 58, 237, 0.996)" }}></div>
         <p className="mt-4 text-white font-bold">Wait...</p>
       </div>
     </div>
      )}
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <YoutubeIcon className="h-6 w-6 text-red-600" />
        <span className="font-bold">Recapify</span>
      </Link>
      <Card className="mx-auto max-w-sm relative">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login </CardTitle>
          <CardDescription>Enter your email and password to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary underline-offset-4 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-sm text-muted-foreground mt-2">
            Don&apos;t have an account? <Link href="/signup" className="text-primary underline-offset-4 hover:underline">Sign up</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
