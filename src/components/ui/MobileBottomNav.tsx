type MobileBottomNavProps = {
  active?: "account" | "ar" | "designs" | "explore" | "home";
};

const items = [
  { href: "/products", id: "home", label: "Home", mark: "H" },
  { href: "/products", id: "explore", label: "Explore", mark: "E" },
  { href: "/try", id: "ar", label: "AR", mark: "A" },
  { href: "/products", id: "designs", label: "Designs", mark: "D" },
  { href: "/products", id: "account", label: "Account", mark: "U" },
] as const;

export function MobileBottomNav({ active = "explore" }: MobileBottomNavProps) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {items.map((item) => (
        <a
          aria-current={active === item.id ? "page" : undefined}
          href={item.href}
          key={item.id}
        >
          <span aria-hidden="true">{item.mark}</span>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
