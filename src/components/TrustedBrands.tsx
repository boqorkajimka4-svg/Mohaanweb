import ScrollReveal from './ScrollReveal';

const brands = ['Figma', 'Notion', 'Slack', 'Stripe', 'Vercel', 'Linear'];

export default function TrustedBrands() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <ScrollReveal>
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-[var(--text-tertiary)]">Trusted by teams at</p>
      </ScrollReveal>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {brands.map((b, i) => (
          <ScrollReveal key={i} delay={i * 0.06}>
            <span className="text-xl font-bold text-[var(--text-tertiary)] opacity-40 transition hover:opacity-70">{b}</span>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
