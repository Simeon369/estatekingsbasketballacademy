import Navbar from "@/components/layout/Navbar";
import TopBar from "@/components/layout/TopBar";
import Footer from "@/components/layout/Footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TopBar />
      <main>{children}</main>
      <Footer />
      <Navbar />
    </>
  );
}
