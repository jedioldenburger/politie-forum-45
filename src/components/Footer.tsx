import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-white mt-16 py-12 border-t-4 border-accent-500" aria-labelledby="site-footer">
      <h2 id="site-footer" className="sr-only">Site Footer</h2>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Politie Forum Nederland</h3>
            <p className="text-primary-200 text-sm">
              Het grootste Nederlandse forum over politie, veiligheid en justitie.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-primary-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/nieuws" className="text-primary-200 hover:text-white transition-colors">
                  Nieuws
                </Link>
              </li>
              <li>
                <Link href="/categorieen" className="text-primary-200 hover:text-white transition-colors">
                  Categorieën
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Informatie</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/over" className="text-primary-200 hover:text-white transition-colors">
                  Over ons
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-primary-200 hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/voorwaarden" className="text-primary-200 hover:text-white transition-colors">
                  Voorwaarden
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-primary-200 text-sm mb-2">
              <a href="mailto:jedi@xcom.dev" rel="nofollow" className="hover:text-white transition-colors">
                jedi@xcom.dev
              </a>
              {" - "}
              <a href="mailto:info@politie-forum.nl" rel="nofollow" className="hover:text-white transition-colors">
                info@politie-forum.nl
              </a>
            </p>
            <div className="mb-4">
              <p className="text-primary-200 text-sm">
                <a href="tel:+31648319167" rel="nofollow" className="hover:text-white transition-colors" aria-describedby="tip-disclaimer">
                  +31 6 48319167
                </a>
              </p>
              <p id="tip-disclaimer" className="text-primary-300 text-xs mt-1">
                💡 WhatsApp Tip Lijn - Anonieme tips welkom
              </p>
            </div>
            <p className="text-primary-200 text-xs leading-relaxed">
              Sint Olofssteeg 4<br />
              1012AK Amsterdam<br />
              Netherlands
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://x.com/politieforum"
                target="_blank"
                rel="me noopener nofollow noreferrer"
                className="text-primary-200 hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://facebook.com/politieforum"
                target="_blank"
                rel="me noopener nofollow noreferrer"
                className="text-primary-200 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="https://instagram.com/politieforum"
                target="_blank"
                rel="me noopener nofollow noreferrer"
                className="text-primary-200 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-primary-800 text-center text-sm text-primary-200">
          <p>© 2025 Politie Forum Nederland. Alle rechten voorbehouden.</p>
          <p className="mt-2 text-xs">
            Publisher: <a href="https://digestpaper.com" target="_blank" rel="noopener nofollow noreferrer" className="hover:text-white transition-colors">DigestPaper.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
