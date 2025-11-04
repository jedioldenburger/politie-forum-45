"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ShieldCheckIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  KeyIcon
} from "@heroicons/react/24/outline";

export default function ContactClient() {
  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: "Algemene Vragen",
      email: "info@politie-forum.nl",
      description: "Voor algemene informatie, lidmaatschap en forumvragen",
    },
    {
      icon: ShieldCheckIcon,
      title: "Technische Support",
      email: "support@politie-forum.nl",
      description: "Login problemen, bugs, technische issues",
    },
    {
      icon: NewspaperIcon,
      title: "Redactie & Nieuws",
      email: "redactie@politie-forum.nl",
      description: "Nieuwstips, persberichten, journalistieke vragen",
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Moderatie & Meldingen",
      email: "moderatie@politie-forum.nl",
      description: "Overtredingen melden, moderatievragen",
    },
    {
      icon: UserGroupIcon,
      title: "Partnerships & Advertenties",
      email: "partnerships@politie-forum.nl",
      description: "Samenwerkingen, sponsoring, advertentiemogelijkheden",
    },
    {
      icon: KeyIcon,
      title: "Copyright & Juridisch",
      email: "copyright@politie-forum.nl",
      description: "Auteursrecht, juridische vragen, DMCA",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-600 mb-4">
            Contact
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Heeft u vragen, suggesties of wilt u contact opnemen met onze redactie? 
            Kies hieronder de juiste afdeling voor uw vraag.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <IconComponent className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {method.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {method.description}
                    </p>
                    <a 
                      href={`mailto:${method.email}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm hover:underline"
                    >
                      {method.email}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Contact Info */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Address & Phone */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <MapPinIcon className="h-6 w-6 text-primary-600 mr-2" />
              Bezoekadres
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Politie Forum Nederland</strong><br />
                Alexanderstraat 123<br />
                2514 JR Den Haag<br />
                Nederland
              </p>
              <p className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-primary-600 mr-2" />
                <a href="tel:+31201234567" className="hover:text-primary-600">
                  +31 (0)20 123 4567
                </a>
              </p>
              <p className="text-sm text-gray-600">
                <strong>Openingstijden:</strong><br />
                Maandag - Vrijdag: 09:00 - 17:00<br />
                Weekend: Gesloten
              </p>
            </div>
          </div>

          {/* Anonymous Tips */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg p-8 border-2 border-red-200">
            <h2 className="text-2xl font-semibold text-red-900 mb-6 flex items-center">
              <ShieldCheckIcon className="h-6 w-6 text-red-600 mr-2" />
              Anonieme Tips
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-red-900 mb-2">WhatsApp Tip Lijn</h3>
                <a 
                  href="https://wa.me/31612345678" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-700 hover:text-red-800 font-medium hover:underline flex items-center"
                >
                  +31 6 1234 5678
                  <span className="ml-2 text-sm">(Klik om te openen)</span>
                </a>
                <p className="text-sm text-red-800 mt-1">
                  Verstuur veilig anonieme tips over misdaad of misstanden
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-red-900 mb-2">PGP Versleutelde Email</h3>
                <a 
                  href="mailto:tips@politie-forum.nl"
                  className="text-red-700 hover:text-red-800 font-medium hover:underline"
                >
                  tips@politie-forum.nl
                </a>
                <p className="text-sm text-red-800 mt-1 mb-2">
                  Voor maximale privacy, gebruik onze PGP public key
                </p>
                <a 
                  href="/pgp-public-key.asc"
                  download
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                >
                  <KeyIcon className="h-4 w-4 mr-2" />
                  Download PGP Key
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Volg Ons op Social Media
          </h2>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://twitter.com/politieforum" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a 
              href="https://facebook.com/politieforum" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="https://linkedin.com/company/politie-forum-nederland" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        {/* Response Time Notice */}
        <div className="bg-blue-50 border-l-4 border-primary-600 p-6 mt-8 rounded-r-lg">
          <p className="text-sm text-gray-700">
            <strong>Reactietijd:</strong> Wij streven ernaar alle emails binnen 24-48 uur te beantwoorden 
            tijdens werkdagen. Voor urgente technische problemen, gebruik onze support email. 
            Anonieme tips worden binnen 7 dagen behandeld met volledige discretie.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
