import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const faqs = [
  { q: 'How do I download my purchase?', a: 'After completing your purchase through Gumroad, you\'ll receive an email with a direct download link. You can also access your files from your Gumroad library at any time.' },
  { q: 'Can I use products in commercial projects?', a: 'Yes! All products include a license that allows commercial use. Check the specific product page for any additional licensing details.' },
  { q: 'Do you offer refunds?', a: 'Since digital products are delivered instantly, refunds are handled on a case-by-case basis. If you experience any issues, contact us and we\'ll work with you to find a solution.' },
  { q: 'Will I get future updates?', a: 'Absolutely. When a product is updated, you\'ll receive an email notification and can download the latest version from your Gumroad library at no extra cost.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and Apple Pay through Gumroad\'s secure checkout system.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="mx-auto max-w-3xl px-5 py-20">
      <ScrollReveal>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold md:text-4xl"><span className="text-heading-gradient">Frequently Asked Questions</span></h2>
          <p className="mt-3 text-[var(--text-secondary)]">Everything you need to know about our products and services.</p>
        </div>
      </ScrollReveal>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <ScrollReveal key={i} delay={i * 0.05}>
            <div className="card-premium overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between px-6 py-5 text-left">
                <span className="pr-4 font-semibold text-[var(--text-primary)]">{f.q}</span>
                <ChevronDown size={18} className={`shrink-0 text-[var(--text-tertiary)] transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}/>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="px-6 pb-5 text-sm leading-relaxed text-[var(--text-secondary)]">{f.a}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
