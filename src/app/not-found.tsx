import { Header } from "@/components/header";
import { ArrowLink } from "@/components/ui";
export default function NotFound() {
  return (
    <>
      <Header />
      <section className="page-intro content" style={{ paddingBottom: 100 }}>
        <h1>A little off route.</h1>
        <p>Let’s get you back to the right place.</p>
        <ArrowLink href="/" dark>
          Back to home
        </ArrowLink>
      </section>
    </>
  );
}
