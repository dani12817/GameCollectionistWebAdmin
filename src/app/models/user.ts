export class User {
    name: string;
    admin: boolean;
    uid: string;
    avatar: string;
    email: string;
    games: {gamecode: string, reference: firebase.firestore.DocumentReference, price?: number, currency?: string}[];
}
  