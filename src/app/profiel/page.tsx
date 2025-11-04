"use client";

import AuthModal from "@/components/AuthModal";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { updateUser } from "@/lib/database";
import { Camera, Save, Upload, User as UserIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { currentUser, userData } = useAuth();
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [nickname, setNickname] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    file: File;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setAuthModalOpen(true);
    } else if (userData) {
      setDisplayName(userData.displayName || "");
      setNickname(userData.nickname || userData.displayName || "");
      setPhotoURL(userData.photoURL || "");
      setBio(userData.bio || "");
      setLocation(userData.location || "");
      setWebsite(userData.website || "");
    }
  }, [currentUser, userData]);

  // Image upload handler with validation
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB for profile pictures
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        "❌ Ongeldig bestandstype. Alleen JPG, PNG, GIF en WebP zijn toegestaan."
      );
      setTimeout(() => setUploadError(null), 5000);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setUploadError(
        `❌ Bestand te groot! Maximale grootte is 2MB. Jouw bestand: ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB`
      );
      setTimeout(() => setUploadError(null), 5000);
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // Create preview URL
      const url = URL.createObjectURL(file);
      setUploadedImage({ url, file });
      setPhotoURL(url); // Set as current photo URL for preview
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("❌ Fout bij uploaden van afbeelding");
    } finally {
      setUploading(false);
    }
  };

  // Drag and drop handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleImageUpload(e.dataTransfer.files);
  };

  const handleRemoveImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.url);
    }
    setUploadedImage(null);
    setPhotoURL(userData?.photoURL || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    setMessage("");

    try {
      let finalPhotoURL = photoURL.trim();

      // If user uploaded an image, convert to base64 for storage
      if (uploadedImage) {
        const reader = new FileReader();
        finalPhotoURL = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(uploadedImage.file);
        });
      }

      await updateUser(currentUser.uid, {
        displayName: displayName.trim() || currentUser.email || "Gebruiker",
        nickname:
          nickname.trim() ||
          displayName.trim() ||
          currentUser.email ||
          "Gebruiker",
        photoURL: finalPhotoURL || undefined,
        bio: bio.trim() || undefined,
        location: location.trim() || undefined,
        website: website.trim() || undefined,
      });

      setMessage("✅ Profiel succesvol opgeslagen!");
      setUploadedImage(null); // Clear uploaded image after save
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("❌ Er is een fout opgetreden. Probeer het opnieuw.");
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <>
        <Header onOpenAuthModal={() => setAuthModalOpen(true)} />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Toegang geweigerd
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Je moet ingelogd zijn om je profiel te bewerken.
              </p>
            </div>
          </div>
        </div>
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => {
            setAuthModalOpen(false);
            router.push("/");
          }}
        />
      </>
    );
  }

  return (
    <>
      <Header onOpenAuthModal={() => setAuthModalOpen(true)} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Profiel bewerken
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Pas je profielinformatie aan
              </p>
            </div>

            {/* Profile Form */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
              <form onSubmit={handleSubmit}>
                {/* Avatar Section */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                    Profielfoto
                  </label>
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    {/* Avatar Preview */}
                    <div
                      className="relative group"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    >
                      {photoURL ? (
                        <img
                          src={photoURL}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover border-4 border-primary-200 dark:border-primary-700 shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center border-4 border-primary-200 dark:border-primary-700 shadow-lg">
                          <UserIcon className="h-16 w-16 text-white" />
                        </div>
                      )}

                      {/* Upload overlay */}
                      <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label
                          htmlFor="profile-upload"
                          className="cursor-pointer flex flex-col items-center gap-1"
                        >
                          <Camera className="h-8 w-8 text-white" />
                          <span className="text-xs text-white font-medium">
                            Upload
                          </span>
                        </label>
                      </div>

                      {/* Remove button */}
                      {uploadedImage && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}

                      <input
                        type="file"
                        id="profile-upload"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        className="hidden"
                      />
                    </div>

                    {/* Upload Instructions */}
                    <div className="flex-1">
                      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border-2 border-dashed border-slate-300 dark:border-slate-600">
                        <div className="flex items-start gap-3">
                          <Upload className="h-5 w-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                              Upload een profielfoto
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              Klik op je avatar, sleep een bestand hierheen, of
                              plak een URL hieronder
                            </p>
                            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                              <li>• Toegestaan: JPG, PNG, GIF, WebP</li>
                              <li>• Maximale grootte: 2MB</li>
                              <li>
                                • Aanbevolen: vierkante afbeelding (bijv.
                                400x400px)
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Upload Error */}
                      {uploadError && (
                        <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800">
                          {uploadError}
                        </div>
                      )}

                      {/* Upload Success */}
                      {uploadedImage && !uploadError && (
                        <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm border border-green-200 dark:border-green-800">
                          ✅ Afbeelding geüpload! Klik op &quot;Profiel
                          opslaan&quot; om te bewaren.
                        </div>
                      )}

                      {/* URL Input */}
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                          Of plak een foto URL:
                        </label>
                        <input
                          type="url"
                          value={uploadedImage ? "" : photoURL}
                          onChange={(e) => {
                            setPhotoURL(e.target.value);
                            if (uploadedImage) {
                              setUploadedImage(null);
                            }
                          }}
                          placeholder="https://example.com/avatar.jpg"
                          disabled={!!uploadedImage}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Name Field */}
                <div className="mb-6">
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Volledige naam
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Jan van der Berg"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Je volledige naam (niet zichtbaar voor anderen)
                  </p>
                </div>

                {/* Nickname Field */}
                <div className="mb-6">
                  <label
                    htmlFor="nickname"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Gebruikersnaam / Nickname
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="politieagent123"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Deze naam wordt getoond bij je berichten en reacties
                  </p>
                </div>

                {/* Bio Field */}
                <div className="mb-6">
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Bio / Over mij
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Vertel iets over jezelf..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    <span
                      className={
                        bio.length > 450 ? "text-orange-500 font-medium" : ""
                      }
                    >
                      {bio.length}
                    </span>
                    /500 tekens
                  </p>
                </div>

                {/* Location Field */}
                <div className="mb-6">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Locatie (optioneel)
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Amsterdam, Nederland"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Website Field */}
                <div className="mb-6">
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Website / Social Media (optioneel)
                  </label>
                  <input
                    type="url"
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://voorbeeld.nl"
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Email (Read-only) */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    E-mailadres
                  </label>
                  <input
                    type="email"
                    value={currentUser.email || ""}
                    disabled
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Je e-mailadres kan niet worden gewijzigd
                  </p>
                </div>

                {/* Success/Error Message */}
                {message && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      message.includes("succesvol")
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="h-5 w-5" />
                  {saving ? "Opslaan..." : "Profiel opslaan"}
                </button>
              </form>
            </div>

            {/* Account Stats */}
            <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Account statistieken
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {userData?.posts || 0}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Berichten
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                    {userData?.reputation || 0}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Reputatie
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {userData?.role === "admin"
                      ? "Admin"
                      : userData?.role === "moderator"
                      ? "Moderator"
                      : "Gebruiker"}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Rol
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                    {userData?.createdAt
                      ? new Date(userData.createdAt).toLocaleDateString(
                          "nl-NL",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "-"}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Lid sinds
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
