import Script from "next/script";

export function GoogleAnalytics() {
  return (
    <>
      {/* Google tag (gtag.js) - Lazy loaded for better performance */}
      <Script
        strategy="lazyOnload"
        src="https://www.googletagmanager.com/gtag/js?id=G-PYNT9RRWHB"
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PYNT9RRWHB');
          `,
        }}
      />
    </>
  );
}
