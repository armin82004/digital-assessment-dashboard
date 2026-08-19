
// import Footer from "@/app/_components/Footer";
import { Toaster } from "@/components/ui/toast";
import Header from "../_components/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main >{children}</main>
      <Toaster />
      {/* <Footer /> */}
    </>
  );
}
