#!/bin/bash

echo "🔧 Setting up Vercel environment variables..."

# Firebase Admin SDK - Production
echo "📦 Adding Firebase Admin SDK variables..."
echo "blockchainkix-com-fy" | npx vercel env add FIREBASE_ADMIN_PROJECT_ID production
echo "6fbf1d7646e214bc1f3ddd61a807b409e1977916" | npx vercel env add FIREBASE_ADMIN_PRIVATE_KEY_ID production
echo "-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCf6DdTHNMQ7SGe
gq7IE0HNvER44tGNxvUT57D0lxDG0FR7UuVZuppyIlOXI8SBCN9nHMt+3XCd4tHi
D2GgJ+AiAdsXye33CH9PssdDZXZfdn69axIbDFniYp7VeEgT1l/Zu/J+SL3yAJju
Ss8RtPA7+Ba19vQJ410XWwAh3mSFQAlCoVdSlAB6NpcfurYCYcfcE57AkI2yNFqL
GnaU64iFyAX1olfXvRE2hrwuNoJY5+WrWKr/kq+nmOBvW+42tzjGn3WJ3BEN0OtD
AHApqdyg/lB4pqrdb9P2K8g8eJWSwyC7sJ8Bon0x2II41i+xGqMob+6omMX5OOof
ZLu31l5RAgMBAAECggEADUEvYiPv2ZBTtWg5r/tAp3AP8Ovu2M9WveP6RrFFl7qU
YMs57Zp1IOQi2lKsVXx0dX9CiEKMtNmknMC6To807zyzeiD9KPk7AafdB9jKMMGJ
YeQVJ8l5+IpE24b72oEY3YXMZOwHVUmiuOXZ4irbBZgxMbtwS72H7YlX1SGHuC+5
bF0O0qGkMXjbrUlA9FbndivORd+wrw/xg8egHeQhdjLGfbJe2Hcb/MYXKyeo2uNO
Ngq6y+u9XS9Kd/cA851glgNYVl1L9TCXR0B4E3yvsrjqvSe3oOH/ngUoBdCfXVhk
w3iaDDdzr3nhZ4kSvx8O274l6bgi2Iz45TWUMZ+YnQKBgQDTbCnXiSCa2YVNViOE
Q6usZQo7DKpkNemFmASAcrzeq8puucjK6G7aUCIGQp+6MqZn8JxH9xJvGtwbNROe
vjiprPcOVaRehcVsjnC4B8Mbi2HJEUMpJXlWCIpMNRbjHgCzk76vSn0fXuNAeNWw
QwAwaMDt36BmXAT3p5G6XRNM0wKBgQDBn27p4WZiCnRxSY36VEMZg3sY8h8wUIvW
ZF5FrBsvIzpNffEOYT2i7qcAulXj0UwS7WHyBxPh0N2F6SRXlBghc+vuzAZzuNM4
lyLAETbr1tPNASMIrDb/nbOMEYfAB5jvcq8mtBMyTKfmBlJbUq+Fo8D1Uvtk8DLz
w2gPIxHhywKBgQC2AS1cEP5yj8NDul3E5QSK2kieYN7mecrYaO+nLB8PidAw1drX
YpTbd5Ry0zPx9NxwKiA/i6Dg6LyG54BGbfcVioL8YhmoDXzRYSYEJxp9QdYiY6vv
ZgU4XQ3BYQqc5h0weoXzHSrtsJ/txpgeru8gvW0o2hSZSao1EJpRVwLgZQKBgBaf
Mw0+WYDw6cPmrSDnQWO0uegjOcOiVYQ5+822GwL54bD2GvjsIZBsw7RREQHqDTJU
69GkRA1pIsingah91AfsjE89JS/WE0+UUOoR2NHbKqnUDSzROifJXBXsYmjsOlEX
nCEwfuGslR1J9ctXsMwzYrMG+/pCGiHi3cCO/2LbAoGBAKiT/JdQfTk9o1UTwq5e
N4MuUP7eNrumGmw5XkoQ1NW3I7pA/YU6DE/GWjYnPbKDCxdVvQ3MxLx6gRdMi/Yj
NuImtBYD9ATmqslZGgdgHUc0LIqyuJwcL7OjSPcnFfyUc4fJWSRgu4fhr+yCOA/m
pfm/+40S86fTqSAtVXsu9Ea0
-----END PRIVATE KEY-----" | npx vercel env add FIREBASE_ADMIN_PRIVATE_KEY production
echo "firebase-adminsdk-i3dcq@blockchainkix-com-fy.iam.gserviceaccount.com" | npx vercel env add FIREBASE_ADMIN_CLIENT_EMAIL production
echo "108398841790393991794" | npx vercel env add FIREBASE_ADMIN_CLIENT_ID production

# Firebase Client SDK - Production
echo "🌐 Adding Firebase Client SDK variables..."
echo "AIzaSyDCRYKrWUvtOtDAY4TThjlm7AxkzHG-62s" | npx vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
echo "blockchainkix-com-fy.firebaseapp.com" | npx vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
echo "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app" | npx vercel env add NEXT_PUBLIC_FIREBASE_DATABASE_URL production
echo "blockchainkix-com-fy" | npx vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
echo "blockchainkix-com-fy.firebasestorage.app" | npx vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
echo "148890561425" | npx vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
echo "1:148890561425:web:217d6d0f854783f6880830" | npx vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
echo "G-PYNT9RRWHB" | npx vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production

# Revalidation secret - Production
echo "🔑 Adding revalidation secret..."
echo "politie-forum-secret-2025" | npx vercel env add REVALIDATE_SECRET production

echo ""
echo "✅ Environment variables set for Production!"
echo "🔄 Redeploy to apply changes: npx vercel --prod --force"

MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCf6DdTHNMQ7SGe
gq7IE0HNvER44tGNxvUT57D0lxDG0FR7UuVZuppyIlOXI8SBCN9nHMt+3XCd4tHi
D2GgJ+AiAdsXye33CH9PssdDZXZfdn69axIbDFniYp7VeEgT1l/Zu/J+SL3yAJju
Ss8RtPA7+Ba19vQJ410XWwAh3mSFQAlCoVdSlAB6NpcfurYCYcfcE57AkI2yNFqL
GnaU64iFyAX1olfXvRE2hrwuNoJY5+WrWKr/kq+nmOBvW+42tzjGn3WJ3BEN0OtD
AHApqdyg/lB4pqrdb9P2K8g8eJWSwyC7sJ8Bon0x2II41i+xGqMob+6omMX5OOof
ZLu31l5RAgMBAAECggEADUEvYiPv2ZBTtWg5r/tAp3AP8Ovu2M9WveP6RrFFl7qU
YMs57Zp1IOQi2lKsVXx0dX9CiEKMtNmknMC6To807zyzeiD9KPk7AafdB9jKMMGJ
YeQVJ8l5+IpE24b72oEY3YXMZOwHVUmiuOXZ4irbBZgxMbtwS72H7YlX1SGHuC+5
bF0O0qGkMXjbrUlA9FbndivORd+wrw/xg8egHeQhdjLGfbJe2Hcb/MYXKyeo2uNO
Ngq6y+u9XS9Kd/cA851glgNYVl1L9TCXR0B4E3yvsrjqvSe3oOH/ngUoBdCfXVhk
w3iaDDdzr3nhZ4kSvx8O274l6bgi2Iz45TWUMZ+YnQKBgQDTbCnXiSCa2YVNViOE
Q6usZQo7DKpkNemFmASAcrzeq8puucjK6G7aUCIGQp+6MqZn8JxH9xJvGtwbNROe
vjiprPcOVaRehcVsjnC4B8Mbi2HJEUMpJXlWCIpMNRbjHgCzk76vSn0fXuNAeNWw
QwAwaMDt36BmXAT3p5G6XRNM0wKBgQDBn27p4WZiCnRxSY36VEMZg3sY8h8wUIvW
ZF5FrBsvIzpNffEOYT2i7qcAulXj0UwS7WHyBxPh0N2F6SRXlBghc+vuzAZzuNM4
lyLAETbr1tPNASMIrDb/nbOMEYfAB5jvcq8mtBMyTKfmBlJbUq+Fo8D1Uvtk8DLz
w2gPIxHhywKBgQC2AS1cEP5yj8NDul3E5QSK2kieYN7mecrYaO+nLB8PidAw1drX
YpTbd5Ry0zPx9NxwKiA/i6Dg6LyG54BGbfcVioL8YhmoDXzRYSYEJxp9QdYiY6vv
ZgU4XQ3BYQqc5h0weoXzHSrtsJ/txpgeru8gvW0o2hSZSao1EJpRVwLgZQKBgBaf
Mw0+WYDw6cPmrSDnQWO0uegjOcOiVYQ5+822GwL54bD2GvjsIZBsw7RREQHqDTJU
69GkRA1pIsingah91AfsjE89JS/WE0+UUOoR2NHbKqnUDSzROifJXBXsYmjsOlEX
nCEwfuGslR1J9ctXsMwzYrMG+/pCGiHi3cCO/2LbAoGBAKiT/JdQfTk9o1UTwq5e
N4MuUP7eNrumGmw5XkoQ1NW3I7pA/YU6DE/GWjYnPbKDCxdVvQ3MxLx6gRdMi/Yj
NuImtBYD9ATmqslZGgdgHUc0LIqyuJwcL7OjSPcnFfyUc4fJWSRgu4fhr+yCOA/m
pfm/+40S86fTqSAtVXsu9Ea0
-----END PRIVATE KEY-----"
pfm/+40S86fTqSAtVXsu9Ea0
-----END PRIVATE KEY-----" | npx vercel env add FIREBASE_ADMIN_PRIVATE_KEY production
echo "firebase-adminsdk-i3dcq@blockchainkix-com-fy.iam.gserviceaccount.com" | npx vercel env add FIREBASE_ADMIN_CLIENT_EMAIL production
echo "108398841790393991794" | npx vercel env add FIREBASE_ADMIN_CLIENT_ID production

# Firebase Client SDK - Production
echo "🌐 Adding Firebase Client SDK variables..."
echo "AIzaSyDCRYKrWUvtOtDAY4TThjlm7AxkzHG-62s" | npx vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
echo "blockchainkix-com-fy.firebaseapp.com" | npx vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
echo "https://blockchainkix-com-fy-default-rtdb.europe-west1.firebasedatabase.app" | npx vercel env add NEXT_PUBLIC_FIREBASE_DATABASE_URL production
echo "blockchainkix-com-fy" | npx vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
echo "blockchainkix-com-fy.firebasestorage.app" | npx vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
echo "148890561425" | npx vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
echo "1:148890561425:web:217d6d0f854783f6880830" | npx vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
echo "G-PYNT9RRWHB" | npx vercel env add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID production

# Revalidation secret - Production
echo "🔑 Adding revalidation secret..."
echo "politie-forum-secret-2025" | npx vercel env add REVALIDATE_SECRET production
echo "🔄 Redeploy to apply changes: npx vercel --prod --force"
