// import { DeployButton } from "@/components/deploy-button";
// import { EnvVarWarning } from "@/components/env-var-warning";
// import { AuthButton } from "@/components/auth-button";
// import { Hero } from "@/components/hero";
// import { ThemeSwitcher } from "@/components/theme-switcher";
// import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
// import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
// import { hasEnvVars } from "@/lib/utils";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <main className="min-h-screen flex flex-col items-center">
//       <div className="flex-1 w-full flex flex-col gap-20 items-center">
//         <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
//           <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
//             <div className="flex gap-5 items-center font-semibold">
//               <Link href={"/"}>Next.js Supabase Starter</Link>
//               <div className="flex items-center gap-2">
//                 <DeployButton />
//               </div>
//             </div>
//             {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
//           </div>
//         </nav>
//         <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
//           <Hero />
//           <main className="flex-1 flex flex-col gap-6 px-4">
//             <h2 className="font-medium text-xl mb-4">Next steps</h2>
//             {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
//           </main>
//         </div>

//         <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
//           <p>
//             Powered by{" "}
//             <a
//               href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
//               target="_blank"
//               className="font-bold hover:underline"
//               rel="noreferrer"
//             >
//               Supabase
//             </a>
//           </p>
//           <ThemeSwitcher />
//         </footer>
//       </div>
//     </main>
//   );
// }






import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <main className="min-h-screen bg-black dark:bg-black flex flex-col">
      {/* Header */}
      <nav className="w-full flex items-center justify-between px-8 py-4">
        <Link
          href="/"
          className="text-2xl font-bold text-white dark:text-white tracking-tight"
        >
          Mental Health AI
        </Link>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <button className="bg-neutral-900 dark:bg-neutral-900 text-white px-4 py-2 rounded-full font-medium">
            Log in
          </button>
          <button className="bg-neutral-900 dark:bg-neutral-900 text-white px-4 py-2 rounded-full font-medium">
            Sign Up
          </button>
        </div>
      </nav>

      {/* Centered Main */}
      <section className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-white dark:text-white mb-8 text-center">
          How have you been feeling today?
        </h1>
        <form className="w-full max-w-2xl flex flex-col items-center">
          <div className="w-full flex items-center bg-neutral-900 dark:bg-neutral-900 rounded-2xl px-6 py-4 mb-6 shadow-lg">
            <Input
              type="text"
              placeholder="Tell me how you feel..."
              className="flex-1 bg-transparent text-white dark:text-white text-lg placeholder:text-neutral-400 outline-none"
            />
            <button
              type="submit"
              className="ml-4 bg-neutral-800 dark:bg-neutral-800 hover:bg-neutral-700 dark:hover:bg-neutral-700 p-2 rounded-full"
            >
              <ArrowUpIcon className="h-6 w-6 text-neutral-400" />
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
