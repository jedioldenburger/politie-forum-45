# 🌐 Custom Domain Setup - politie-forum.nl

## ✅ Domain Configuration Complete

**Custom Domain**: https://politie-forum.nl
**Vercel Deployment**: https://politie-forum-45-l9vey9psd-jedixcoms-projects.vercel.app

---

## 🔧 How to Configure Custom Domain in Vercel

### Step 1: Add Domain to Vercel

**Via Vercel Dashboard** (Recommended):

1. Go to: https://vercel.com/jedixcoms-projects/politie-forum-45/settings/domains
2. Click **Add Domain**
3. Enter: `politie-forum.nl`
4. Click **Add**
5. Also add: `www.politie-forum.nl` (optional)

**Via CLI**:

```bash
vercel domains add politie-forum.nl
vercel domains add www.politie-forum.nl
```

---

### Step 2: Configure DNS Records

After adding the domain, Vercel will provide DNS configuration instructions.

#### Required DNS Records:

**For Root Domain (politie-forum.nl)**:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

**For WWW Subdomain (www.politie-forum.nl)**:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

#### DNS Provider Examples:

**Cloudflare**:

1. Login to Cloudflare Dashboard
2. Select domain: politie-forum.nl
3. Go to **DNS** → **Records**
4. Click **Add record**
5. Add both A and CNAME records above
6. Set **Proxy status** to **DNS only** (gray cloud)

**GoDaddy**:

1. Login to GoDaddy
2. My Products → Domains → politie-forum.nl
3. Click **DNS** or **Manage DNS**
4. Add A record and CNAME record
5. Save changes

**Namecheap**:

1. Login to Namecheap
2. Domain List → Manage → Advanced DNS
3. Add A record and CNAME record
4. Save all changes

---

### Step 3: Verify Domain

1. Wait 5-60 minutes for DNS propagation
2. Check status in Vercel Dashboard
3. You'll see **Valid Configuration** when ready
4. HTTPS certificate auto-generates (Let's Encrypt)

---

## 🔍 Verification Commands

### Check DNS Propagation

```bash
# Check A record
dig politie-forum.nl +short
# Should return: 76.76.21.21

# Check CNAME record
dig www.politie-forum.nl +short
# Should return: cname.vercel-dns.com

# Check from multiple locations
dig @8.8.8.8 politie-forum.nl +short
dig @1.1.1.1 politie-forum.nl +short
```

### Check SSL Certificate

```bash
# Visit site and check for HTTPS
curl -I https://politie-forum.nl | grep -i "HTTP"
# Should return: HTTP/2 200

# Check certificate
openssl s_client -connect politie-forum.nl:443 -servername politie-forum.nl < /dev/null 2>/dev/null | openssl x509 -noout -dates
```

### Test Domain Resolution

```bash
# Check if domain resolves
nslookup politie-forum.nl

# Check HTTP redirect (HTTP → HTTPS)
curl -I http://politie-forum.nl | grep -i location
# Should redirect to: https://politie-forum.nl
```

---

## ⚙️ Vercel Domain Settings

### Recommended Configuration:

**1. Redirect www to root** (or vice versa):

- Go to: https://vercel.com/jedixcoms-projects/politie-forum-45/settings/domains
- Set `www.politie-forum.nl` to redirect to `politie-forum.nl`
- This ensures consistent URLs for SEO

**2. Enable HTTPS**:

- ✅ Auto-enabled by Vercel
- Uses Let's Encrypt certificate
- Auto-renews every 90 days

**3. Force HTTPS**:

- ✅ Auto-enabled by Vercel
- All HTTP requests redirect to HTTPS

**4. Enable HSTS** (HTTP Strict Transport Security):

- Go to: Project Settings → Headers
- Vercel automatically adds HSTS header
- Max-age: 63072000 seconds (2 years)

---

## 📊 SEO Impact

### Updated SEO URLs:

All SEO configurations now use `https://politie-forum.nl`:

**Metadata**:

- ✅ `metadataBase`: https://politie-forum.nl
- ✅ `canonical`: https://politie-forum.nl
- ✅ `og:url`: https://politie-forum.nl
- ✅ `twitter:url`: https://politie-forum.nl

**Sitemap**:

- ✅ `robots.txt` sitemap: https://politie-forum.nl/sitemap.xml
- ✅ All sitemap URLs use custom domain

**Structured Data**:

- ✅ Organization `@id`: https://politie-forum.nl/#org
- ✅ WebSite `@id`: https://politie-forum.nl/#website
- ✅ All JSON-LD URLs use custom domain

**Social Links**:

- ✅ RSS feed: https://politie-forum.nl/feed.xml
- ✅ Atom feed: https://politie-forum.nl/atom.xml

---

## 🚀 Post-Configuration Steps

### 1. Update Google Search Console

```
1. Go to: https://search.google.com/search-console
2. Add property: politie-forum.nl
3. Verify ownership (DNS TXT record or HTML file)
4. Submit sitemap: https://politie-forum.nl/sitemap.xml
```

### 2. Update Google Analytics

```
1. Go to: https://analytics.google.com
2. Admin → Property Settings
3. Update default URL to: https://politie-forum.nl
4. Verify tracking code still works
```

### 3. Test Social Media Previews

```
1. Facebook: https://developers.facebook.com/tools/debug/?q=https://politie-forum.nl
2. Twitter: https://cards-dev.twitter.com/validator
3. LinkedIn: https://www.linkedin.com/post-inspector/
```

### 4. Update External Links

- Update any external links to use new domain
- Update social media profiles
- Update email signatures
- Update business listings

### 5. Monitor Analytics

- Check for 404 errors
- Verify traffic is using new domain
- Check for mixed content warnings
- Monitor page load times

---

## 🔄 Domain Redirect Configuration

### Vercel Automatic Redirects:

- ✅ `http://politie-forum.nl` → `https://politie-forum.nl`
- ✅ `http://www.politie-forum.nl` → `https://politie-forum.nl`
- ✅ `https://www.politie-forum.nl` → `https://politie-forum.nl`
- ✅ Vercel deployment URL accessible (for testing)

### Custom Redirects (Optional):

If you need custom redirects, add to `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

---

## 🎯 Domain Status Checklist

After configuration, verify:

- [ ] DNS A record points to 76.76.21.21
- [ ] DNS CNAME record (www) points to cname.vercel-dns.com
- [ ] Domain shows "Valid Configuration" in Vercel
- [ ] HTTPS certificate issued and active
- [ ] HTTP redirects to HTTPS
- [ ] www redirects to root domain (or vice versa)
- [ ] Site loads at https://politie-forum.nl
- [ ] Google Search Console configured
- [ ] Google Analytics updated
- [ ] Social media previews work
- [ ] Sitemap accessible at /sitemap.xml
- [ ] robots.txt accessible at /robots.txt

---

## 🔗 Quick Links

**Vercel**:

- Domain Settings: https://vercel.com/jedixcoms-projects/politie-forum-45/settings/domains
- Project Dashboard: https://vercel.com/jedixcoms-projects/politie-forum-45
- Deployment Logs: https://vercel.com/jedixcoms-projects/politie-forum-45/deployments

**Google Tools**:

- Search Console: https://search.google.com/search-console
- Analytics: https://analytics.google.com
- Rich Results Test: https://search.google.com/test/rich-results

**DNS Tools**:

- DNS Checker: https://dnschecker.org/#A/politie-forum.nl
- SSL Checker: https://www.sslshopper.com/ssl-checker.html#hostname=politie-forum.nl
- What's My DNS: https://www.whatsmydns.net/#A/politie-forum.nl

---

## 🆘 Troubleshooting

### Domain not resolving

**Issue**: Site not loading at custom domain
**Solution**:

1. Check DNS records are correct
2. Wait 24-48 hours for full propagation
3. Clear browser cache
4. Try incognito/private mode
5. Check different network/device

### HTTPS certificate error

**Issue**: SSL certificate warning
**Solution**:

1. Vercel auto-issues Let's Encrypt cert
2. Usually takes 5-10 minutes after DNS validates
3. Check Vercel dashboard for cert status
4. Force cert renewal in Vercel settings if needed

### www not redirecting

**Issue**: www.politie-forum.nl not redirecting
**Solution**:

1. Ensure CNAME record is correct
2. Configure redirect in Vercel domain settings
3. Check "Redirect to Primary" option

### Mixed content warnings

**Issue**: Some assets loading over HTTP
**Solution**:

1. Check all URLs use HTTPS
2. Update hardcoded HTTP links
3. Check external resources
4. Use protocol-relative URLs: `//example.com/asset.js`

### Old domain still showing in search

**Issue**: Google showing old URLs
**Solution**:

1. Submit sitemap to Search Console
2. Request re-indexing of key pages
3. Wait 1-2 weeks for Google to update
4. Use 301 redirects (permanent)

---

## 📝 Notes

- **DNS Propagation**: Can take 5 minutes to 48 hours
- **HTTPS Certificate**: Auto-issued by Vercel (Let's Encrypt)
- **Auto-Renewal**: Certificates auto-renew 30 days before expiry
- **Cost**: Vercel custom domains are FREE on all plans
- **Multiple Domains**: Can add multiple domains to same project

---

**Status**: ✅ Custom domain ready to configure!

**Next**: Add domain in Vercel → Configure DNS → Wait for propagation → Site live!
