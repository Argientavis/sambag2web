
import { signInWithEmailAndPassword } from "firebase/auth";
import { database, auth } from "../Firebase"; 
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import axios from "axios";
import { create } from "zustand";

const API_URL = "http://localhost:5000/api";

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    role: null,



    checkingAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`, { withCredentials: true });
            console.log(response.data);
            set({
                user: response.data.user,
                isAuthenticated: true,
                role: response.data.user.role,
                isCheckingAuth: false,
            });
        } catch (error) {
            console.error("Error checking authentication:", error);
            set({ error: null, isCheckingAuth: false, isAuthenticated: false });
        }
    },

    forLogout: async () => {
        set({ error: null });
        try {
            const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
            set({isCheckingAuth:true,role:null,isAuthenticated:false})
        } catch (error) {
            set({ error: error.response ? error.response.data : "Logout failed" });
            console.error("Logout error:", error);
        }
    },

    forLogin: async (username, password) => {
        set({ error: null, isLoading: true });
        try {
            const usernameSnapshot = await get(
                query(ref(database, "Users"), orderByChild("username"), equalTo(username))
            );

            if (usernameSnapshot.exists()) {
                const userData = usernameSnapshot.val();
                const email = Object.values(userData)[0].email;

                const userCredentials = await signInWithEmailAndPassword(auth, email, password);
                const idToken = await userCredentials.user.getIdToken();

                const response = await axios.post(`${API_URL}/login`, { idToken }, { withCredentials: true });

                if (response.data.success) {
                    const role = Object.values(userData)[0].role;
                    set({
                        user: response.data.user,
                        isAuthenticated: true,
                        role,
                        error: null,
                        isLoading: false,
                    });
                    return { success: true, role, idToken };
                } else {
                    throw new Error(response.data.message || "Login failed");
                }
            } else {
                throw new Error("Username does not exist");
            }
        } catch (error) {
            console.error("Error signing in:", error.message);
            let errorMessage = "An unknown error occurred"; 
    

            if (error.code === "auth/missing-password") {
                errorMessage = "Invalid password"; 
            } else if (error.code === "auth/user-not-found") {
                errorMessage = "User not found"; 
            }
    
            set({ error: errorMessage, isLoading: false });
        }
    },
}));



