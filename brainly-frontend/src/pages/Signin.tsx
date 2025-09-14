import { useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useNavigate } from "react-router-dom";
//@ts-ignore
import api from "../utils/api";

export function Signin(){
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    
    const signin = async() => {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        console.log("Signin attempt:", { username, password });

        try{
            const response = await api.post("/api/v1/users/login", {
                username,
                password
            });
            
            
            localStorage.setItem("token", (response.data as any).data.accessToken);
           
            navigate("/dashboard");
            
        } catch (error) {
            console.error("Signin error:", error);
            alert("Signin failed. Please try again.");
        }
    }
    
    return (
        <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
            <div className="bg-white rounded-xl border min-w-48 p-8">
                <Input reference={usernameRef} placeholder="Username"/>
                <Input reference={passwordRef} placeholder="Password"/>
                <div className="flex justify-center pt-4">
                    <Button 
                        onClick={signin} 
                        loading={false} 
                        variant="primary" 
                        text="Signin" 
                        fullWidth={true}
                    />
                </div>
            </div>
        </div>
    );
}