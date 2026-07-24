const iconClass = 'h-[18px] w-[18px] shrink-0';

export function IconHome({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMenu({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function IconTag({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M20 12V8.5A2.5 2.5 0 0 0 17.5 6H7L3 10v4l4 4h10.5A2.5 2.5 0 0 0 20 15.5V12Z" strokeLinejoin="round" />
      <circle cx="15" cy="11" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconBag({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M6 8h12l-1 12H7L6 8Z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}

export function IconHeart({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M12 20.5s-7-4.6-7-10a4 4 0 0 1 7-2.5 4 4 0 0 1 7 2.5c0 5.4-7 10-7 10Z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconStar({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.5 14.8 9h7.2l-5.8 4.2 2.2 7-7.4-4.8L4.8 20.2l2.2-7L1.2 9h7.2L12 2.5Z" />
    </svg>
  );
}

export function IconCart({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="9" cy="20" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.25" fill="currentColor" stroke="none" />
      <path d="M2 3h2l2.2 11.4a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L20 8H6" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPlus({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function IconHamburger({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function IconClose({ className = iconClass }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

const navIconMap = {
  inicio: IconHome,
  cardapio: IconMenu,
  promocoes: IconTag,
  pedidos: IconBag,
  favoritos: IconHeart,
  avaliacoes: IconStar,
};

export function NavIcon({ id, className }) {
  const Icon = navIconMap[id] ?? IconMenu;
  return <Icon className={className} />;
}
