import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useNavigate } from "react-router-dom";
//@ts-ignore
import api from "../utils/api";

export function Signup() {
    /* @ts-ignore */
    const usernameRef = useRef<HTMLInputElement>();
    /* @ts-ignore */
    const passwordRef = useRef<HTMLInputElement>();
    const navigate = useNavigate();

    const signup = async () => {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        
        console.log("Signup attempt:", { username, password });
        
        try {
            await api.post("/api/v1/users/register", {
                username,
                password
            });
            navigate("/signin");
            alert("You have signed up!");
        } catch (error) {
            console.error("Signup error:", error);
            alert("Signup failed. Please try again.");
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
            <div className="bg-white rounded-xl border min-w-48 p-8">
                <Input reference={usernameRef} placeholder="Username"/>
                <Input reference={passwordRef} placeholder="Password"/>
                <div className="flex justify-center pt-4">
                    <Button 
                        onClick={signup} 
                        loading={false} 
                        variant="primary" 
                        text="Signup" 
                        fullWidth={true}
                    />
                </div>
            </div>
        </div>
    );
}