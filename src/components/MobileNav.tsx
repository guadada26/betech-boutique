import { siteConfig } from '@/config/siteData';

export default function MobileNav() {
  const { mobileNav, contact } = siteConfig;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-stone-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-center justify-around">
        {mobileNav.map((item) => (
          <a
            key={item.label}
            href={item.href === '#contact' ? contact.whatsapp : item.href}
            target={item.href === '#contact' ? '_blank' : undefined}
            rel={item.href === '#contact' ? 'noreferrer' : undefined}
            className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-3 text-center text-xs font-medium text-stone-700 hover:text-stone-900 transition"
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
