import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 bg-[#f4f4f4]">{children}</div>
      <Footer />
    </div>
  );
}
