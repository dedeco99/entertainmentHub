class Auth{
	constructor(){
		this.authenticated = false;
	}

	login(callback){
		this.authenticated = true;
		setTimeout(callback, 100);
	}

	logout(callback){
		this.authenticated = false;
		setTimeout(callback, 100);
	}

	isAuthenticated(){
		return this.authenticated;
	}
}

export default new Auth();
