export class User {
    name: string;
    admin?: boolean;
    uid: string;
    avatar?: string;
    email: string;
    games?: UserGame[];
    friends?: UserFriend[];
    nickname: string;

    constructor(userData: firebase.auth.UserCredential) {
        this.email = userData.user.email;
        if (userData.user.email) {
            this.name = userData.user.displayName ? userData.user.displayName : userData.user.email.split('@')[0];
            this.nickname = userData.user.email.split('@')[0];
        }
        this.uid = userData.user.uid;
        this.admin = false;
        this.avatar = userData.user.photoURL;
        this.games = [];
        this.friends = [];
    }
}

export class UserGame {
    gamecode?: string;
    reference?: firebase.firestore.DocumentReference;
    price?: number;
    currency?: string;
    bought_date?: any;
    type?: string; //'owned' | 'wishlist'
}

export class UserFriend {
    uid?: string;
    reference?: firebase.firestore.DocumentReference;
}
  