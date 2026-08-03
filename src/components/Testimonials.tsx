import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const testimonials = [
  { name: 'Sarah Chen', role: 'Product Designer at Figma', text: 'MohaanWeb templates saved me weeks of work. The quality is unmatched — every component feels production-ready out of the box.', rating: 5 },
  { name: 'Marcus Johnson', role: 'Founder at LaunchPad', text: 'I bought the Notion Life OS and it completely transformed how I organize my business. Worth every penny.', rating: 5 },
  { name: 'Elena Rodriguez', role: 'Freelance Developer', text: 'The UI kits are incredibly well-structured. Clean naming, consistent spacing, and the dark mode variants are beautiful.', rating: 5 },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20">
      <ScrollReveal>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl"><span className="text-heading-gradient">Loved by Creators</span></h2>
          <p className="mt-3 text-[var(--text-secondary)]">See what our customers are saying.</p>
        </div>
      </ScrollReveal>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <ScrollReveal key={i} delay={i * 0.1}>
            <div className="rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-card)] p-6 transition hover:border-[var(--border-hover)]">
              <div className="mb-3 flex gap-1">{Array.from({length: t.rating}).map((_, j) => <Star key={j} size={14} className="fill-amber-400 text-amber-400"/>)}</div>
              <p className="text-[var(--text-secondary)] leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">{t.name[0]}</div>
                <div><p className="text-sm font-semibold text-[var(--text-primary)]">{t.name}</p><p className="text-xs text-[var(--text-tertiary)]">{t.role}</p></div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
