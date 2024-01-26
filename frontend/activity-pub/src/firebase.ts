import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// ... other firebase imports

const firebaseConfig = {
	apiKey: "AIzaSyDXt0k8pkyGP03QgO0SEjyaiIh3ZgQT3Bs",
	authDomain: "activitypubblog-477d0.firebaseapp.com",
	projectId: "activitypubblog-477d0",
	storageBucket: "activitypubblog-477d0.appspot.com",
	messagingSenderId: "260931807654",
	appId: "1:260931807654:web:0b01fffa30850573e6c767",
};

export const firebaseApp = initializeApp(firebaseConfig);

export const firebaseAuth = getAuth();
