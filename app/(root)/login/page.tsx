import FormLogin from "@/components/login";
import Link from "next/link";

export default async function Login() {  

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <img className="w-[200px]" src="./onpe.png" alt="logo" />
        </Link>

        <FormLogin />
      </div>
    </div>    
    
  );
}