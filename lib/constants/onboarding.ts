/*  Onboarding  */

export const rules = [
  {
    id: "booking-limit",
    label: "Ich verstehe, dass Buchungen zeitlich begrenzt sind",
  },
  {
    id: "no-claim",
    label: "Nach Ablauf habe ich keinen Anspruch mehr auf den Platz",
  },
  {
    id: "house-rules",
    label: "Ich akzeptiere die Hausregeln der Location",
  },
  {
    id: "legal",
    label: "Ich akzeptiere AGB / Datenschutz",
  },
] as const;

export const timeOptions = [
  { id: "morning", label: "Morgen" },
  { id: "noon", label: "Mittag" },
  { id: "afternoon", label: "Nachmittag" },
  { id: "evening", label: "Abend" },
] as const;

export const preferenceOptions = [
  { id: "wifi", label: "WLAN" },
  { id: "power", label: "Steckdosen" },
  { id: "quiet", label: "Ruhig" },
  { id: "networking", label: "Networking" },
  { id: "coffee", label: "Kaffee / Drinks" },
] as const;

export const industryOptions = [
  { id: "it", label: "IT" },
  { id: "design", label: "Design" },
  { id: "marketing", label: "Marketing" },
  { id: "finance", label: "Finance" },
  { id: "startup", label: "Startup" },
  { id: "beratung", label: "Beratung" },
  { id: "sonstiges", label: "Sonstiges" },
] as const;

export const purposeOptions = [
  { id: "arbeiten", label: "Arbeiten" },
  { id: "networking", label: "Networking" },
  { id: "beides", label: "Beides" },
] as const;

export const guestRulesOptions = [
  {
    id: "booking-limit",
    label: "Ich verstehe, dass Buchungen zeitlich begrenzt sind",
  },
  {
    id: "no-claim",
    label: "Nach Ablauf habe ich keinen Anspruch mehr auf den Platz",
  },
  {
    id: "house-rules",
    label: "Ich akzeptiere die Hausregeln der Location",
  },
  {
    id: "legal",
    label: "Ich akzeptiere AGB / Datenschutz",
  },
] as const;

export const locationCategoryOptions = [
  { id: "cafe", label: "Café" },
  { id: "bar", label: "Bar" },
  { id: "restaurant", label: "Restaurant" },
  { id: "hotel-lounge", label: "Hotel Lounge" },
  { id: "other", label: "Sonstiges" },
] as const;

export const locationAmenityOptions = [
  { id: "wifi", label: "WLAN vorhanden" },
  { id: "power", label: "Steckdosen vorhanden" },
  { id: "laptop-zone", label: "Laptop-Zone vorhanden" },
  { id: "wc", label: "WC vorhanden" },
] as const;

export const yesNoOptions = [
  { id: "yes", label: "Ja" },
  { id: "no", label: "Nein" },
] as const;

export const slotDurationOptions = [
  { id: "2h", label: "2h" },
  { id: "3h", label: "3h" },
  { id: "4h", label: "4h" },
] as const;

export const weekdayOptions = [
  { id: "mon", label: "Montag" },
  { id: "tue", label: "Dienstag" },
  { id: "wed", label: "Mittwoch" },
  { id: "thu", label: "Donnerstag" },
  { id: "fri", label: "Freitag" },
  { id: "sat", label: "Samstag" },
  { id: "sun", label: "Sonntag" },
] as const;
