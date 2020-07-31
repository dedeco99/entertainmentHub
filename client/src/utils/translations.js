const translations = {
	connect: {
		en: "Connect",
		pt: "Conectar",
	},
	disconnect: {
		en: "Disconnect",
		pt: "Desconectar",
	},
	appConnected: app => ({
		en: `Your ${app} account is connected`,
		pt: `A sua conta ${app} está conectada`,
	}),
	appNotConnected: app => ({
		en: `Your ${app} account is not currently connected`,
		pt: `A sua conta ${app} não está conectada`,
	}),
	settings: {
		en: "Settings",
		pt: "Definições",
	},
	customScrollbar: {
		en: "Custom scrollbar",
		pt: "Scrollbar custom",
	},
	animations: {
		en: "Animations",
		pt: "Animações",
	},
	borderColor: {
		en: "Border color on widgets",
		pt: "Border color nos widgets",
	},
	save: {
		en: "Save",
		pt: "Guardar",
	},
	notifications: {
		en: "Notifications",
		pt: "Notificações",
	},
	noNotifications: {
		en: "You have no notifications",
		pt: "Não há mais notificações",
	},
	all: {
		en: "All",
		pt: "Tudo",
	},
	multipleParamExample: (...params) => ({
		en: `Hello ${params[0]}, my name is ${params[1]}`,
		pt: `Boas ${params[0]}, o meu nome é ${params[1]}`,
	}), // Use like this: translate("multipleParamExample", "Rodrigo", "André")
};

function translate(code, ...params) {
	// TODO: Replace with language flag
	const lang = "pt";

	if (typeof translations[code] === "function") {
		return translations[code](...params)[lang];
	}

	return translations[code][lang];
}

export { translate };
