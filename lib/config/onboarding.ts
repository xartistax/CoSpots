import { error } from "console";

export const onboardingConfig = {
  welcome: {
    step: "Schritt 1",
    title: "Willkommen bei CoWorking",
    description: "Finde deinen passenden Flow für flexible Arbeitsplätze.",
    error: "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.",
    cta: {
      guest: "Ich suche einen Platz",
      host: "Ich biete Plätze an",
      login: "Login",
    },
  },

  guest: {
    profile: {
      step: "Schritt 1 von 3",
      title: "Dein Profil",
      description: "Erzähl uns kurz, was zu dir und deinem Arbeitsstil passt.",
      fields: {
        industry: {
          label: "Branche",
          id: "industry",
          placeholder: "Branche wählen",
        },
        networking: {
          label: "Offen für Networking",
          id: "networking",
          description: "Zeige anderen, dass du offen für Gespräche bist.",
        },
        purpose: {
          label: "Zweck",
          id: "purpose",
          placeholder: "Zweck wählen",
        },
        bio: {
          label: "Kurzbeschreibung",
          id: "bio",
          placeholder: "Erzähl kurz, woran du arbeitest oder wonach du suchst.",
        },
        linkedin: {
          label: "LinkedIn",
          id: "linkedin",
          placeholder: "https://linkedin.com/in/...",
        },
        website: {
          label: "Website",
          id: "website",
          placeholder: "https://deine-seite.com",
        },
      },
      cta: {
        submit: "Weiter",
      },
    },

    preferences: {
      step: "Schritt 2 von 3",
      title: "Deine Präferenzen",
      description: "Hilf uns, dir passende Spots vorzuschlagen.",
      fields: {
        city: {
          label: "Bevorzugte Stadt",
          id: "city",
          placeholder: "Zürich",
        },
      },
      time: {
        label: "Bevorzugte Zeiten",
      },
      important: {
        label: "Was ist dir wichtig?",
      },
      cta: {
        submit: "Weiter",
      },
    },

    rules: {
      step: "Schritt 3 von 3",
      title: "Regeln bestätigen",
      description: "Bitte bestätige die wichtigsten Punkte, bevor du startest.",
      cta: {
        submit: "Konto erstellen",
      },
    },

    success: {
      step: "Schritt 6 von 6",
      title: "Alles bereit",
      description: "Dein Profil ist erstellt. Jetzt kannst du passende Spots entdecken.",
      alert: "Dein Konto wurde erfolgreich eingerichtet.",
      cta: {
        primary: "Spots entdecken",
      },
    },
  },

  host: {
    profile: {
      step: "Schritt 3 von 8",
      title: "Betreiberprofil",
      description: "Erfasse die wichtigsten Informationen zu dir und deiner Location.",
      fields: {
        operatorName: {
          label: "Name Betreiber / Ansprechpartner",
          id: "operatorName",
          placeholder: "Max Muster",
        },
        phone: {
          label: "Telefonnummer",
          id: "phone",
          placeholder: "+41 79 123 45 67",
        },
        locationName: {
          label: "Name der Location",
          id: "locationName",
          placeholder: "Cafe Downtown",
        },
        city: {
          label: "Stadt",
          id: "city",
          placeholder: "Zürich",
        },
        address: {
          label: "Adresse",
          id: "address",
          placeholder: "Bahnhofstrasse 1, 8001 Zürich",
        },
      },
      cta: {
        submit: "Weiter",
      },
    },

    location: {
      step: "Schritt 4 von 8",
      title: "Location Details",
      description: "Beschreibe deine Location und vorhandene Ausstattung.",
      fields: {
        locationAmenityOptions: {
          label: "Ausstattung",
        },
        category: {
          label: "Kategorie",
          id: "category",
          placeholder: "Kategorie wählen",
        },
        description: {
          label: "Beschreibung",
          id: "description",
          placeholder: "Kurzbeschreibung deiner Location",
        },
        website: {
          label: "Website",
          id: "website",
          placeholder: "https://deine-location.com",
        },
        instagram: {
          label: "Instagram",
          id: "instagram",
          placeholder: "@deinelocation",
        },
      },
      cta: {
        submit: "Weiter",
      },
    },

    setup: {
      step: "Schritt 5 von 8",
      title: "CoSpot Setup",
      description: "Definiere Plätze, Regeln und die Standarddauer deiner Slots.",
      fields: {
        spots: {
          label: "Anzahl CoSpot-Plätze",
          id: "spots",
          placeholder: "8",
        },
        price: {
          label: "Standard-Preis pro CoSpot Slot",
          id: "price",
          placeholder: "12",
        },
        marked: {
          label: "Sind die Plätze markiert?",
          id: "marked",
        },
        laptopZone: {
          label: "Dürfen Laptops nur in CoSpot-Zone genutzt werden?",
          id: "laptopZone",
        },
        slotDuration: {
          label: "Standard-Slotdauer",
          id: "slotDuration",
        },
      },
      cta: {
        submit: "Weiter",
      },
    },

    availability: {
      step: "Schritt 6 von 8",
      title: "Verfügbarkeiten",
      description: "Lege fest, wann und wie oft deine CoSpots verfügbar sind.",
      fields: {
        weekdayOptions: {
          label: "Verfügbare Tage",
        },
        recurring: {
          label: "Wiederkehrend",
          id: "recurring",
          description: "Gilt dieser Zeitraum jede Woche?",
        },
        from: {
          label: "Zeitfenster von",
          id: "from",
        },
        to: {
          label: "Zeitfenster bis",
          id: "to",
        },
        gracePeriod: {
          label: "Grace Period in Minuten",
          id: "gracePeriod",
          placeholder: "15",
        },
        extend: {
          label: "Automatische Verlängerung",
          id: "extend",
          description: "Soll die Buchung automatisch verlängert werden, wenn der aktuelle Slot noch belegt ist?",
        },
      },
      cta: {
        submit: "Weiter",
      },
    },

    rules: {
      step: "Schritt 7 von 8",
      title: "Regeln & Auszahlung",
      description: "Halte deine Hausregeln fest und bestätige die rechtlichen Punkte.",
      fields: {
        houseRules: {
          label: "Hausregeln",
          placeholder: "z. B. leise telefonieren, keine Meetings, Konsumation erwünscht",
        },
      },
      cta: {
        submit: "Weiter",
      },
    },

    success: {
      step: "Schritt 8 von 8",
      title: "Deine Location ist startklar",
      description: "Du kannst jetzt deinen ersten Slot anlegen oder dir die Vorschau ansehen.",
      alert: "Dein Betreiberprofil wurde erfolgreich eingerichtet.",
      cta: {
        primary: "Ersten Slot erstellen",
        secondary: "Location-Vorschau ansehen",
      },
    },
  },
} as const;
