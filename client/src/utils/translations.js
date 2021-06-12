import React from "react";

const translations = {
	continue: {
		en: "Continue to EntertainmentHub",
		pt: "Continuar para o EntertainmentHub",
	},
	login: {
		en: "Login",
		pt: "Login",
	},
	register: {
		en: "Register",
		pt: "Registar",
	},
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
	deleteConfirmation: {
		en: "Delete Confirmation",
		pt: "Confirmação para Apagar",
	},
	deleteConfirmationText: (...params) => ({
		en: (
			<span>
				{"Are you sure you want to delete "}
				<span style={{ color: params[1] }}>{params[0]}</span>
				{" ?"}
			</span>
		),
		pt: `Tem a certeza que quer apagar ${params[0]} ?`,
	}),
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
	noSubscriptions: {
		en: "No Subscriptions",
		pt: "Sem Subscrições",
	},
	subscriptions: {
		en: "Subscriptions",
		pt: "Subscrições",
	},
	editSubscription: {
		en: "Edit Subscription",
		pt: "Editar Subscrição",
	},
	newFeed: {
		en: "New Feed",
		pt: "Novo Feed",
	},
	editFeed: {
		en: "Edit Feed",
		pt: "Editar Feed",
	},
	newReddit: {
		en: "New Reddit",
		pt: "Novo Reddit",
	},
	editReddit: {
		en: "Edit Reddit",
		pt: "Editar Reddit",
	},
	noEpisodes: {
		en: "No Episodes",
		pt: "Não há episódios",
	},
	releasedEpisodes: {
		en: "Released",
		pt: "Lançados",
	},
	upcomingEpisodes: {
		en: "Upcoming",
		pt: "Próximos",
	},
	watchedEpisodes: {
		en: "Watched",
		pt: "Vistos",
	},
	toWatchEpisodes: {
		en: "To Watch",
		pt: "Por Ver",
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
	noWidgets: {
		en: "You have no widgets",
		pt: "Não há widgets",
	},
	all: {
		en: "All",
		pt: "Tudo",
	},
	missingApp: {
		en: "App is missing. Click here to add it",
		pt: "App foi removida. Clique aqui para voltar a adicionar",
	},
	browserNotifications: {
		en: "Enable browser notifications",
		pt: "Ativar notificações do browser",
	},
	browserSettings: {
		en: "This setting can only be changed in your browser",
		pt: "Esta definição só pode ser alterada no browser",
	},
	multipleParamExample: (...params) => ({
		en: `Hello ${params[0]}, my name is ${params[1]}`,
		pt: `Boas ${params[0]}, o meu nome é ${params[1]}`,
	}), // Use like this: translate("multipleParamExample", "Rodrigo", "André")

	/* API */

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
	GET_APPS: {
		en: "Apps found",
		pt: "Apps encontradas",
	},
	ADD_APP: {
		en: "App added",
		pt: "App adicionada",
	},
	DELETE_APP: {
		en: "App deleted",
		pt: "App apagada",
	},
	ADD_USER: {
		en: "User registered successfully",
		pt: "Utilizador registado com sucesso",
	},
	EDIT_USER: {
		en: "User has been edited",
		pt: "Utilizador foi atualizado",
	},
	LOGIN: {
		en: "Login successful",
		pt: "Login feito com sucesso",
	},
	GET_COINS: {
		en: "Coins found",
		pt: "Moedas encontradas",
	},
	GET_COIN: {
		en: "Coin found",
		pt: "Moeda encontrada",
	},
	GET_FEEDS: {
		en: "Feeds found",
		pt: "Feeds econtrados",
	},
	ADD_FEEDS: {
		en: "Feed created",
		pt: "Feed craido",
	},
	EDIT_FEEDS: {
		en: "Feed updated",
		pt: "Feed atualizado",
	},
	DELETE_FEEDS: {
		en: "Feed deleted",
		pt: "Feed apagado",
	},
	GET_NOTIFICATIONS: {
		en: "Notifications found",
		pt: "Notificações encontradas",
	},
	EDIT_NOTIFICATION: {
		en: "Notification updated",
		pt: "Notificação atualizada",
	},
	DELETE_NOTIFICATION: {
		en: "Notification deleted",
		pt: "Notificação apagada",
	},
	GET_SCHEDULED_NOTIFICATIONS: {
		en: "Scheduled notifications found",
		pt: "Scheduled notifications encontrados",
	},
	ADD_SCHEDULED_NOTIFICATION: {
		en: "Scheduled notification created",
		pt: "Scheduled notification adicionado",
	},
	EDIT_SCHEDULED_NOTIFICATION: {
		en: "Scheduled notification has been updated",
		pt: "Scheduled notification foi atualizado",
	},
	DELETE_SCHEDULED_NOTIFICATION: {
		en: "Scheduled notification deleted",
		pt: "Scheduled notification apagado",
	},
	GET_PRODUCT: {
		en: "Product found",
		pt: "Produto encontrado",
	},
	GET_SUBREDDITS: {
		en: "Subreddits found",
		pt: "Subreddits encontrados",
	},
	GET_REDDIT_POSTS: {
		en: "Reddit posts found",
		pt: "Reddit posts encontrado",
	},
	GET_REDDIT_SEARCH: {
		en: "Reddit search found",
		pt: "Procura do Reddit encontrado",
	},
	GET_SUBSCRIPTIONS: {
		en: "Subscriptions found",
		pt: "Subscrições encontradas",
	},
	ADD_SUBSCRIPTIONS: {
		en: "Subscriptions created",
		pt: "Subscrições criadas",
	},
	EDIT_SUBSCRIPTIONS: {
		en: "Subscription has been updated",
		pt: "Subscrições foram atualizadas",
	},
	DELETE_SUBSCRIPTIONS: {
		en: "Subscription deleted",
		pt: "Subscrição apagada",
	},
	GET_EPISODES: {
		en: "Episodes found",
		pt: "Episodios encontrados",
	},
	GET_SERIES: {
		en: "Series found",
		pt: "Series econtradas",
	},
	GET_STREAMS: {
		en: "Streams found",
		pt: "Streams econtradas",
	},
	GET_CHANNELS: {
		en: "Twitch followed channels found",
		pt: "Canais seguidos na Twitch encontrados",
	},
	GET_WEATHER: {
		en: "Weather found",
		pt: "Clima encontrado",
	},
	GET_CITIES: {
		en: "Cities found",
		pt: "Cidades econtradas",
	},
	GET_YOUTUBE_SUBSCRIPTIONS: {
		en: "Youtube subscriptions found",
		pt: "Subscrições do Youtube encontradas",
	},
	GET_YOUTUBE_VIDEOS: {
		en: "Youtube videos found",
		pt: "Vídeos do Youtube econtrados",
	},
	WATCH_LATER: {
		en: "Video saved to watch later",
		pt: "Vídeo guardado para ver mais tarde",
	},

	/* API Errors */
	USER_DUPLICATED: {
		en: "User already exists",
		pt: "Utilizador já existe",
	},
	USER_PASSWORD_WRONG: {
		en: "Password is incorrect",
		pt: "Password está incorrecta",
	},
	USER_NOT_REGISTERED: {
		en: "User is not registered",
		pt: "Utilizador não está registado",
	},
	NOT_FOUND: {
		en: "Not found",
		pt: "Não encontrado",
	},
	REQUIRED_FIELDS: {
		en: "Required fields missing",
		pt: "Campos obrigatórios em falta",
	},
	DUPLICATED: {
		en: "Duplicated",
		pt: "Duplicado",
	},
	YOUTUBE_TOKEN: {
		en: "Youtube access has been revoked",
		pt: "Acesso ao Youtube foi revogado",
	},
	YOUTUBE_FORBIDDEN: {
		en: "Youtube API limit reached",
		pt: "API do Youtube chegou ao seu limite",
	},
	REDDIT_TOKEN: {
		en: "Reddit access has been revoked",
		pt: "Acesso ao Reddit foi revogado",
	},
	REDDIT_FORBIDDEN: {
		en: "Reddit API is down",
		pt: "API do Reddit está em abaixo",
	},
	TWITCH_TOKEN: {
		en: "Twitch access has been revoked",
		pt: "Acesso ao Twitch foi revogado",
	},
	COINMARKETCAP_FORBIDDEN: {
		en: "Coinmarketcap API is down",
		pt: "API do Coinmarketcap está em abaixo",
	},
	COINMARKETCAP_NOT_FOUND: {
		en: "Coin not found",
		pt: "Moeda não encontrada",
	},
	PRODUCT_NOT_FOUND: {
		en: "Product not found",
		pt: "Produto não econtrado",
	},
	WATCH_LATER_ERROR: {
		en: "Some videos were not saved to watch later",
		pt: "Alguns vídeos não foram guardados para ver mais tarde",
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
