import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-3 sm:gap-4 justify-center items-center min-h-[70vh] sm:min-h-130 px-4 py-8 text-center">
        <h1 className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-balance">
          به پرسشنامه ارزیابی دیجیتال خوش آمدید.
        </h1>
        <p className="text-sm sm:text-base text-pretty">
          برای شروع پرسشنامه کلیک کنید:
        </p>
        <Link href={"/industry"} className="w-full sm:w-auto max-w-xs">
          <Button className="w-full sm:w-auto">شروع پرسشنامه</Button>
        </Link>
      </main>
    </>
  );
}
