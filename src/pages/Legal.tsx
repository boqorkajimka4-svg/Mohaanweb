import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import { useSettings } from '../lib/useSettings';

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <Breadcrumbs items={[{ label: title }]} />
      <h1 className="text-4xl font-bold md:text-5xl"><span className="text-heading-gradient">{title}</span></h1>
      <p className="mt-2 text-sm text-[var(--text-tertiary)]">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="mt-8 space-y-5 leading-relaxed text-[var(--text-secondary)]">{children}</div>
    </div>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="pt-4 text-xl font-bold text-[var(--text-primary)]">{children}</h2>;
}

export function PrivacyPolicy() {
  const s = useSettings();
  const email = s?.email || 'yaqaneahamd@gmail.com';
  return (
    <Shell title="Privacy Policy">
      <Seo title="Privacy Policy — MohaanWeb" description="How MohaanWeb collects, uses and protects your data." />
      <p>At MohaanWeb, your privacy is important to us. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our services.</p>
      <H>Information We Collect</H>
      <p>We may collect personal information that you voluntarily provide, such as your name, email address, and phone number when you contact us or make a purchase. We also automatically collect certain technical data such as your IP address, browser type, and pages visited.</p>
      <H>How We Use Your Information</H>
      <p>We use collected information to provide and improve our services, respond to inquiries, process transactions through third-party providers such as Gumroad, and communicate important updates.</p>
      <H>Cookies &amp; Advertising</H>
      <p>We use cookies and similar technologies to enhance your experience. Third-party vendors, including Google, use cookies to serve ads based on your prior visits. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and other sites on the internet. You may opt out of personalized advertising by visiting Google Ads Settings.</p>
      <H>Data Security</H>
      <p>We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet is completely secure.</p>
      <H>Your Rights</H>
      <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us.</p>
      <H>Contact Us</H>
      <p>If you have questions about this Privacy Policy, contact us at <a href={`mailto:${email}`} className="text-sky-400">{email}</a>.</p>
    </Shell>
  );
}

export function Terms() {
  const s = useSettings();
  const email = s?.email || 'yaqaneahamd@gmail.com';
  return (
    <Shell title="Terms &amp; Conditions">
      <Seo title="Terms &amp; Conditions — MohaanWeb" description="The terms governing your use of MohaanWeb." />
      <p>Welcome to MohaanWeb. By accessing or using our website, you agree to be bound by these Terms &amp; Conditions.</p>
      <H>Use of the Website</H>
      <p>You agree to use this website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use and enjoyment of the site.</p>
      <H>Digital Products</H>
      <p>All products sold on MohaanWeb are digital goods delivered and purchased through Gumroad. Once a purchase is completed, refunds are subject to Gumroad's policies and our discretion.</p>
      <H>Intellectual Property</H>
      <p>All content on this website, including text, graphics, logos, and digital products, is the property of MohaanWeb and protected by copyright laws. You may not reproduce or redistribute our products without permission.</p>
      <H>Limitation of Liability</H>
      <p>MohaanWeb is not liable for any indirect, incidental, or consequential damages arising from your use of our website or products.</p>
      <H>Changes to Terms</H>
      <p>We reserve the right to update these terms at any time. Continued use of the site constitutes acceptance of the revised terms.</p>
      <H>Contact</H>
      <p>Questions about these terms? Reach us at <a href={`mailto:${email}`} className="text-sky-400">{email}</a>.</p>
    </Shell>
  );
}

export function CookiePolicy() {
  const s = useSettings();
  const email = s?.email || 'yaqaneahamd@gmail.com';
  return (
    <Shell title="Cookie Policy">
      <Seo title="Cookie Policy — MohaanWeb" description="How MohaanWeb uses cookies." />
      <p>This Cookie Policy explains how MohaanWeb uses cookies and similar technologies to recognize you when you visit our website.</p>
      <H>What Are Cookies?</H>
      <p>Cookies are small data files placed on your device that help websites function and provide reporting information.</p>
      <H>Types of Cookies We Use</H>
      <p><strong>Essential cookies</strong> are necessary for the website to function. <strong>Analytics cookies</strong> help us understand how visitors interact with the site. <strong>Advertising cookies</strong>, including those from Google AdSense, are used to deliver relevant ads.</p>
      <H>Managing Cookies</H>
      <p>You can control and delete cookies through your browser settings. Disabling cookies may affect the functionality of certain parts of the website.</p>
      <H>Contact</H>
      <p>For questions about our cookie usage, email <a href={`mailto:${email}`} className="text-sky-400">{email}</a>.</p>
    </Shell>
  );
}
