// Public company information transcribed from the official website on 2026-10-31.
// See docs/company-sources.md for provenance and unresolved inconsistencies.
export const company = {
  name: "Savelanded Import and Export Company Limited",
  email: "admsavelandedimpexpcomltd@gmail.com",
  whatsapp: "https://wa.me/message/XZ3YJGBGKCMAG1",
  facebook: "https://www.facebook.com/share/1DfyCAj5a9/",
  instagram: "https://www.instagram.com/savelanded_impexp_comltd/",
  hours: [
    "Monday–Friday: 09:00–21:00",
    "Saturday: 09:00–19:00",
    "Sunday: closed",
  ],
  contacts: [
    {
      name: "Wolex · OLUYEMI ADEWOLE A.",
      role: "Founder / CEO",
      phone: "+86 182 4854 7224",
    },
    {
      name: "Star · OLUYEMI TITILAYO A.",
      role: "General manager",
      phone: "+86 157 5799 1458",
    },
    { name: "Mr. CHIBUEZE", role: "Lagos manager", phone: "+234 803 803 7353" },
    {
      name: "Lagos customer service",
      role: "Customer support",
      phone: "+234 814 775 4220",
    },
    { name: "MIC", role: "Guangzhou contact", phone: "+86 198 0641 4771" },
  ],
  offices: [
    {
      city: "Yiwu",
      label: "Head office · China",
      address:
        "16, 2nd Street, Longgang Road, Yiwu City, Zhejiang Province, China.",
    },
    {
      city: "Guangzhou",
      label: "China office",
      address:
        "Room 103, Warehouse 4, Huayag Warehouse, No. 498 Qinglong Road, Shijing Street, Baiyun District, Guangzhou City, China.",
    },
    {
      city: "Lagos",
      label: "Nigeria office",
      address:
        "Apt Market Exp Blk-PB7, Savelanded Plaza, No. 7, 10, 12 and 14, Trade Fair Complex, Lagos, Nigeria.",
    },
  ],
};
export const companyKnowledge = [
  {
    question: "Where are your offices in Yiwu Guangzhou Lagos?",
    answer:
      company.offices.map((o) => `${o.city}: ${o.address}`).join(" ") +
      " Please confirm directions with our team before visiting.",
  },
  {
    question: "What are your email phone WhatsApp contact details?",
    answer: `Email ${company.email}. Wolex: ${company.contacts[0].phone}. Star: ${company.contacts[1].phone}. Lagos customer service: ${company.contacts[3].phone}. WhatsApp: ${company.whatsapp}`,
  },
  {
    question: "Do you ship from China to Nigeria?",
    answer:
      "Savelanded supports shipping from China to Nigeria, with offices in Yiwu, Guangzhou, and Lagos. Share your cargo, origin, and destination for a confirmed quotation. Specific methods, pricing, and delivery dates require confirmation.",
  },
  {
    question: "Do you offer sourcing supplier verification quality assurance?",
    answer:
      "Savelanded connects manufacturers in China with businesses in Nigeria and publishes sourcing, supplier verification, quality assurance, and logistics coordination as part of its services. Contact the team to confirm the scope for your products.",
  },
  {
    question: "What are your business opening working hours?",
    answer: `The website publishes general hours of ${company.hours.join("; ")}. Office hours may differ; please confirm with the office before visiting. The source does not specify a time zone.`,
  },
];
