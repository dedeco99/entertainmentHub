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
	deleteConfirmation: {
		en: "Delete Confirmation",
		pt: "Confirmação para Apagar",
	},
	deleteConfirmationText: {
		en: "Are you sure you want to delete",
		pt: "Têm a certeza que quer apagar", 
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
	EXISTS_APP: {
		en: "App already exists",
		pt: "App já existe",
	},
	ADD_USER: {
		en: "User registered successfully",
		pt: "Utilizador registado com sucesso",
	},
	EDIT_USER: {
		en: "User has been edited",
		pt: "Utilizador foi atualizado",
	},
	REGISTERED_USER: {
		en: "User already exists",
		pt: "Utilizador já existe"
	},
	NOT_REGISTERED_USER: {
		en: "User is not registered",
		pt: "Utilizador não está registado",
	},
	LOGIN: {
		en: "Login successful",
		pt: "Login feito com sucesso",
	},
	PASSWORD: {
		en: "Password is incorrect",
		pt: "Password está incorrecta",
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
	COINMARKETPLACE_FORBIDDEN: {
		en: "Coinmarketcap API is down",
		pt: "API do Coinmarketcap está em abaixo",
	},
	COINMARKETPLACE_NOT_FOUND: {
		en: "Coin not found",
		pt: "Moeda não encontrada",
	},
	PRODUCT_NOT_FOUND: {
		en: "Product not found",
		pt: "Produto não econtrado",
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
