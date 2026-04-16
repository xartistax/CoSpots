export const authConfig = {
  login: {
    title: "Anmelden",
    description: "Melde dich mit deinem Konto an",
    fields: {
      email: {
        label: "E-Mail",
        id: "email",
      },
      password: {
        label: "Passwort",
        id: "password",
      },
    },
    cta: {
      submit: "Anmelden",
      forgotPassword: "Passwort vergessen?",
      signUp: "Konto erstellen",
      noAccount: "Noch kein Konto?",
    },
  },

  signUp: {
    title: "Konto erstellen",
    description: "Erstelle dein Konto, um mit dem Onboarding zu starten.",
    fields: {
      firstName: {
        label: "Vorname",
        id: "firstName",
        placeholder: "Alex",
      },
      email: {
        label: "E-Mail",
        id: "email",
        placeholder: "alex@example.com",
      },
      password: {
        label: "Passwort",
        id: "password",
        placeholder: "••••••••",
      },
    },

    cta: {
      submit: "Weiter",
      login: " Anmelden",
      haveAccount: "Bereits ein Konto?",
    },
  },
};
