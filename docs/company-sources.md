# Official company content and image sources

Retrieved successfully on 31 October 2026 after the environment's network policy was updated. The website is company-published evidence, not independent certification of promotional claims.

## Pages reviewed

- https://savelandedcompany.com/wp/ — company name, China–Nigeria shipping, sourcing, supplier verification, quality assurance, logistics coordination, three office addresses, WhatsApp, social links, general hours, company logo and photos.
- https://savelandedcompany.com/wp/yiwu/ — Yiwu head office, Wolex and Star contact numbers, sourcing product categories, office hours.
- https://savelandedcompany.com/wp/guangzhou/ — sourcing markets (Baima, Shisanhang, Zhongda), Wolex and MIC contact numbers.
- https://savelandedcompany.com/wp/lagos/ — Lagos manager and customer service numbers.
- https://savelandedcompany.com/wp/our-executives/ — executive names and associated numbers. Titles cross-checked against the executive summaries shown at `/wp/contact-us/`.
- https://savelandedcompany.com/wp/contact-us/ currently displays a post archive, including executive summaries and a default WordPress post. Placeholder/default posts were not imported.

## Information used

Central public values live in `src/lib/company.ts`: Savelanded Import and Export Company Limited; Yiwu, Guangzhou, and Lagos addresses; email; five public contacts; WhatsApp message link; Facebook and Instagram links; published general hours. Addresses retain the published street/building wording, with basic punctuation and the obvious “province” typo normalized. No unverified coordinates are invented: map links perform an address search.

The footer lists Monday–Friday 09:00–21:00, Saturday 09:00–19:00, Sunday closed. The Yiwu page instead lists weekdays 08:00–17:00 and weekends 10:00–17:00. No timezone is specified. The application labels the general schedule and asks visitors to confirm office hours locally rather than asserting that one schedule applies to every branch. Guangzhou's “Huayag Warehouse” spelling and the Lagos address shorthand should be confirmed with the company before directions are relied on.

No “cheapest/fastest” superlative, third-party accreditation, insurance guarantee, delivery-time promise, testimonial, or zero-valued counter was imported. Sea/air/road/rail remain methods to enquire about, not newly confirmed service capabilities. Product markets are sourcing destinations, not formal partners. Generated executive portraits were not imported as genuine photographs.

## Downloaded assets

Files under `public/images/company/` preserve the downloaded originals. Next.js Image optimizes delivery. All URLs are under `https://savelandedcompany.com/wp/wp-content/uploads/`:

| Local file    | Original path                                     | Use                                                                                                                               |
| ------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| brand.png     | 2025/12/ChatGPT-Image-Dec-26-2025-09_38_48-AM.png | Existing company-published gold/black logo; replaces provisional globe                                                            |
| yiwu.jpg      | 2026/01/photo_5949713205133249400_y.jpg           | Office sign in About and service card                                                                                             |
| guangzhou.jpg | 2026/01/photo_5949713205133249422_y-1024x768.jpg  | Retained company-published cargo-handling photo; not assigned a physical location                                                 |
| lagos.jpg     | 2026/01/photo_5949713205133249426_y-1024x768.jpg  | Retained company-published loading photo; despite being used on the Lagos page, the image itself does not verify a Lagos location |
| warehouse.jpg | 2026/01/photo_5949713205133249425_y-1024x768.jpg  | Cargo handling in process and logistics sections                                                                                  |
| sea.jpg       | 2025/12/steptodown.com944874-1024x682.jpg         | Company-published shipping illustration in hero and social metadata; does not imply company-owned ship/truck                      |
| cargo.jpg     | 2025/12/steptodown.com533599-1024x682.jpg         | Retained company-published logistics illustration                                                                                 |
| shipping.webp | 2026/03/79554.webp                                | Yiwu market sourcing information                                                                                                  |

Contact defaults are public company information, not secrets. Existing NEXT_PUBLIC business contact overrides remain supported for the contact page's primary email/phone/WhatsApp. No environment draft, published configuration, Vercel deployment, or source WordPress site was changed by this content update.
