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
	apps: {
		en: "Apps",
		pt: "Aplicações",
	},
	logout: {
		en: "Logout",
		pt: "Terminar Sessão",
	},
	search: {
		en: "Search",
		pt: "Procurar",
	},
	add: {
		en: "Add",
		pt: "Adicionar",
	},
	edit: {
		en: "Edit",
		pt: "Editar",
	},
	delete: {
		en: "Delete",
		pt: "Apagar",
	},
	close: {
		en: "Close",
		pt: "Fechar",
	},
	update: {
		en: "Update",
		pt: "Atualizar",
	},
	restore: {
		en: "Restore",
		pt: "Restaurar",
	},
	watchLater: {
		en: "Watch Later",
		pt: "Ver mais Tarde",
	},
	markAsRead: {
		en: "Mark as Read",
		pt: "Marcar como Lido",
	},
	submit: {
		en: "Submit",
		pt: "Submeter",
	},
	title: {
		en: "Title",
		pt: "Título",
	},
	noChannels: {
		en: "No Channels",
		pt: "Sem Canais",
	},
	channels: {
		en: "Channels",
		pt: "Canais",
	},
	newChannelGroup: {
		en: "New Channel Group",
		pt: "Novo Grupo de Canais",
	},
	editChannelGroup: {
		en: "Edit Channel Group",
		pt: "Editar Grupo dos Canais",
	},
	newReddit: {
		en: "New Reddit",
		pt: "Novo Reddit",
	},
	editReddit: {
		en: "Edit Reddit",
		pt: "Editar Reddit",
	},
	releasedEpisodes: {
		en: "Released Episodes",
		pt: "Episódios Lançados",
	},
	upcomingEpisodes: {
		en: "Upcoming Episodes",
		pt: "Próximos Episodios",
	},
	customScrollbar: {
		en: "Custom scrollbar",
		pt: "Scrollbar custom",
	},
	name: {
		en: "Name",
		pt: "Nome",
	},
	selectLanguage: {
		en: "Select Language",
		pt: "Selecionar Idioma",
	},
	portugueseLang: {
		en: "Portuguese",
		pt: "Português",
	},
	englishLang: {
		en: "English",
		pt: "Inglês",
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
	GET_WIDGETS: {
		en: "Widgets found",
		pt: "Widgets encontrados",
	},
	ADD_WIDGET: {
		en: "Widget created",
		pt: "Widget adicionado",
	},
	EDIT_WIDGET: {
		en: "Widget has been updated",
		pt: "Widget foi atualizado",
	},
	DELETE_WIDGET: {
		en: "Widget deleted",
		pt: "Widget apagado",
	},
};

function translate(code, ...params) {
	const user = JSON.parse(localStorage.getItem("user"));
	const lang = user && ["en", "pt"].includes(user.language) ? user.language : "en";

	if (typeof translations[code] === "function") {
		return translations[code](...params)[lang];
	}

	return translations[code][lang];
}

export { translate };
