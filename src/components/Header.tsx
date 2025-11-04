"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
    markAllNotificationsAsRead,
    markNotificationAsRead,
    subscribeToNotifications,
} from "@/lib/database";
import { Notification } from "@/lib/types";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Bell, LogOut, Menu, Moon, Sun, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface HeaderProps {
  onOpenAuthModal?: () => void;
}

export default function Header({ onOpenAuthModal }: HeaderProps) {
  const { currentUser, userData, signOut } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileCardOpen, setProfileCardOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    // Load theme from localStorage
    const savedTheme =
      (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // Subscribe to notifications
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    const unsubscribe = subscribeToNotifications(
      currentUser.uid,
      setNotifications
    );
    return () => unsubscribe();
  }, [currentUser]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileCardRef.current &&
        !profileCardRef.current.contains(event.target as Node)
      ) {
        setProfileCardOpen(false);
      }
      if (
        notificationMenuRef.current &&
        !notificationMenuRef.current.contains(event.target as Node)
      ) {
        setNotificationMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const themeLabel = theme === "light" ? "Schakel naar donker thema" : "Schakel naar licht thema";

  const handleNotificationClick = async (notification: Notification) => {
    await markNotificationAsRead(notification.id);
    if (notification.link) {
      window.location.href = notification.link;
    }
    setNotificationMenuOpen(false);
  };

  const handleMarkAllRead = async () => {
    if (currentUser) {
      await markAllNotificationsAsRead(currentUser.uid);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className="bg-primary-800 text-white shadow-lg border-b-[3px] border-white"
      itemScope
      itemType="https://schema.org/WPHeader"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-3"
            itemScope
            itemType="https://schema.org/Organization"
          >
            {isMounted && (
              <Image
                src="/police_badge_icon_64x64.png"
                alt="Politie Badge"
                title="Politie Forum Nederland Logo"
                width={40}
                height={40}
                className="h-10 w-10"
                quality={90}
                unoptimized={false}
              />
            )}
            <div>
              <div className="text-2xl font-bold" itemProp="name">
                Politie Forum Nederland
              </div>
              <p className="text-sm text-primary-200" itemProp="description">
                Jouw community voor politie-informatie
              </p>
              <meta itemProp="url" content="https://politie-forum.nl/" />
            </div>
          </Link>

          {/* Search Form (for SearchAction compatibility) */}
          <form
            action="/zoeken"
            method="get"
            role="search"
            aria-label="Zoek in het forum"
            className="hidden lg:flex items-center"
          >
            <label htmlFor="forum-search-header" className="sr-only">
              Zoek in het forum
            </label>
            <input
              id="forum-search-header"
              name="q"
              type="search"
              placeholder="Zoek..."
              autoComplete="off"
              className="px-3 py-1.5 rounded-lg bg-primary-700 text-white placeholder-primary-300 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 w-48"
            />
          </form>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center space-x-6"
            itemScope
            itemType="https://schema.org/SiteNavigationElement"
          >
            <Link
              href="/"
              itemProp="url"
              className="hover:text-accent-400 transition-colors"
            >
              <span itemProp="name">Home</span>
            </Link>
            <Link
              href="/categorieen"
              itemProp="url"
              className="hover:text-accent-400 transition-colors"
            >
              <span itemProp="name">Categorieën</span>
            </Link>
            <Link
              href="/nieuws"
              itemProp="url"
              className="hover:text-accent-400 transition-colors"
            >
              <span itemProp="name">Nieuws</span>
            </Link>
            <Link
              href="/faq"
              itemProp="url"
              className="hover:text-accent-400 transition-colors"
            >
              <span itemProp="name">FAQ</span>
            </Link>
            {currentUser && (
              <Link
                href="/profiel"
                itemProp="url"
                className="hover:text-accent-400 transition-colors"
              >
                <span itemProp="name">Profiel</span>
              </Link>
            )}
            <Link
              href="/leden"
              itemProp="url"
              className="hover:text-accent-400 transition-colors"
            >
              <span itemProp="name">Leden</span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-primary-700 transition-colors"
                  aria-label={isMounted ? themeLabel : "Wissel thema"}
                >
                  {!isMounted ? (
                    <Moon className="h-5 w-5" />
                  ) : theme === "light" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </button>

                {/* Notifications */}
                <div className="relative" ref={notificationMenuRef}>
                  <button
                    onClick={() =>
                      setNotificationMenuOpen(!notificationMenuOpen)
                    }
                    aria-label={`Notificaties${unreadCount > 0 ? ` (${unreadCount} ongelezen)` : ''}`}
                    aria-expanded={notificationMenuOpen}
                    className="p-2 rounded-lg hover:bg-primary-700 transition-colors relative"
                  >
                    <Bell className="h-5 w-5" aria-hidden="true" focusable="false" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 bg-accent-500 rounded-full"></span>
                    )}
                  </button>

                  {notificationMenuOpen && (
                    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-lg shadow-xl border-2 border-slate-200 dark:border-slate-700 z-50 max-h-[500px] overflow-y-auto">
                      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          Notificaties
                        </h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
                          >
                            Markeer alles als gelezen
                          </button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                          <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Geen notificaties</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                          {notifications.map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                                !notification.read
                                  ? "bg-primary-50 dark:bg-primary-900/20"
                                  : ""
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                                    !notification.read
                                      ? "bg-accent-500"
                                      : "bg-transparent"
                                  }`}
                                ></div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-slate-900 dark:text-white text-sm">
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                    {format(
                                      new Date(notification.createdAt),
                                      "d MMM yyyy 'om' HH:mm",
                                      { locale: nl }
                                    )}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Profile */}
                <div className="relative" ref={profileCardRef}>
                  <button
                    onClick={() => setProfileCardOpen(!profileCardOpen)}
                    aria-label={`Profiel menu voor ${userData?.nickname || userData?.displayName || 'gebruiker'}`}
                    aria-expanded={profileCardOpen}
                    className="flex items-center gap-2 p-1 pr-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {userData?.photoURL ? (
                      <img
                        src={userData.photoURL}
                        alt={userData.nickname || userData.displayName}
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-white/50"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-white/50">
                        {(userData?.nickname || userData?.displayName)
                          ?.charAt(0)
                          .toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-sm font-medium">
                      {userData?.nickname ||
                        userData?.displayName ||
                        "Gebruiker"}
                    </span>
                  </button>

                  {profileCardOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border-2 border-slate-200 dark:border-slate-700 z-50">
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          {userData?.photoURL ? (
                            <img
                              src={userData.photoURL}
                              alt={userData.nickname || userData.displayName}
                              className="h-16 w-16 rounded-full object-cover ring-4 ring-white dark:ring-slate-700"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center text-white font-bold text-2xl ring-4 ring-white dark:ring-slate-700">
                              {(userData?.nickname || userData?.displayName)
                                ?.charAt(0)
                                .toUpperCase() || "U"}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                              {userData?.nickname ||
                                userData?.displayName ||
                                "Gebruiker"}
                            </h3>
                            {userData?.displayName &&
                              userData?.nickname &&
                              userData.displayName !== userData.nickname && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  {userData.displayName}
                                </p>
                              )}
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                              {userData?.email}
                            </p>
                            {userData?.bio && (
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                {userData.bio}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Link
                            href="/profiel"
                            onClick={() => setProfileCardOpen(false)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300"
                          >
                            <User className="h-4 w-4" aria-hidden="true" focusable="false" />
                            <span>Profiel bewerken</span>
                          </Link>
                          <button
                            onClick={() => {
                              signOut();
                              setProfileCardOpen(false);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-left rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                          >
                            <LogOut className="h-4 w-4" aria-hidden="true" focusable="false" />
                            <span>Uitloggen</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-primary-700 transition-colors"
                  aria-label={isMounted ? themeLabel : "Wissel thema"}
                >
                  {!isMounted ? (
                    <Moon className="h-5 w-5" />
                  ) : theme === "light" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={onOpenAuthModal}
                  aria-label="Open inlog dialoog"
                  className="bg-accent-600 hover:bg-accent-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Inloggen
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary-700 transition-colors"
            aria-label={mobileMenuOpen ? "Sluit menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" focusable="false" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" focusable="false" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-primary-700">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="hover:text-accent-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/categorieen"
                className="hover:text-accent-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categorieën
              </Link>
              <Link
                href="/nieuws"
                className="hover:text-accent-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Nieuws
              </Link>
              <Link
                href="/faq"
                className="hover:text-accent-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              {currentUser && (
                <Link
                  href="/profiel"
                  className="hover:text-accent-400 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profiel
                </Link>
              )}
              <Link
                href="/leden"
                className="hover:text-accent-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Leden
              </Link>
              <div className="pt-3 border-t border-primary-700 flex items-center justify-between">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-primary-700 transition-colors"
                  aria-label={isMounted ? themeLabel : "Wissel thema"}
                >
                  {!isMounted ? (
                    <Moon className="h-5 w-5" />
                  ) : theme === "light" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </button>
                {currentUser ? (
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-accent-600 hover:bg-accent-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Uitloggen
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onOpenAuthModal?.();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-accent-600 hover:bg-accent-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Inloggen
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
