import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="flex flex-col gap-3 justify-center items-center min-h-130">
        <h1 className="text-2xl">به پرسشنامه ارزیابی دیجیتال خوش آمدید.</h1>
        <p>برای شروع پرسشنامه کلیک کنید:</p>
        <Link href={"/industry"}>
          {" "}
          <Button>شروع پرسشنامه</Button>
        </Link>
      </main>
    </>
  );
}
