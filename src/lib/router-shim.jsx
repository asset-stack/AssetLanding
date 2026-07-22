// Shim for react-router-dom on the static marketing site.
// Astro serves each page as its own document, so a client-side router is
// unnecessary — <Link to="..."> becomes a plain <a href="...">.
// Wired up via the `react-router-dom` alias in astro.config.mjs, so the
// ported components keep their original imports untouched.
import React from 'react';

export const Link = React.forwardRef(function Link({ to, children, ...rest }, ref) {
  const href = typeof to === 'string' ? to : (to?.pathname ?? '/');
  return (
    <a ref={ref} href={href} {...rest}>
      {children}
    </a>
  );
});
