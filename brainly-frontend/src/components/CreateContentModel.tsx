import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import axios from "axios";

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter"
}

interface CreateContentModalProps {
    open: boolean;
    onClose: () => void;
    onContentAdded?: () => void; // Add this prop to trigger refresh
}

export function CreateContentModal({ open, onClose, onContentAdded }: CreateContentModalProps) {
    const titleRef = useRef<HTMLInputElement>();
    const linkRef = useRef<HTMLInputElement>();
    const [type, setType] = useState(ContentType.Youtube);
    const [isLoading, setIsLoading] = useState(false);

    async function addContent() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;

        if (!title || !link) {
            alert("Please fill in both title and link");
            return;
        }

        setIsLoading(true);
        
        try {
            const response = await axios.post("/api/v1/contents/create", {
                link,
                title,
                type
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });

            console.log("Content added successfully:", response.data);
            
            // Clear the form
            if (titleRef.current) titleRef.current.value = "";
            if (linkRef.current) linkRef.current.value = "";
            
            // Trigger refresh in parent component
            if (onContentAdded) {
                onContentAdded();
            }
            
            onClose();
        } catch (error) {
            console.log("Content adding failed", error);
            alert("Content failed, try again later");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            {open && (
                <div>
                    <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 opacity-60 flex justify-center"></div>
                    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center">
                        <div className="flex flex-col justify-center">
                            <span className="bg-white opacity-100 p-4 rounded fixed">
                                <div className="flex justify-end">
                                    <div onClick={onClose} className="cursor-pointer">
                                        <CrossIcon />
                                    </div>
                                </div>
                                <div>
                                    <Input reference={titleRef} placeholder={"Title"} />
                                    <Input reference={linkRef} placeholder={"Link"} />
                                </div>
                                <div>
                                    <h1>Type</h1>
                                    <div className="flex gap-1 justify-center pb-2">
                                        <Button
                                            text="Youtube"
                                            variant={type === ContentType.Youtube ? "primary" : "secondary"}
                                            onClick={() => setType(ContentType.Youtube)}
                                        />
                                        <Button
                                            text="Twitter"
                                            variant={type === ContentType.Twitter ? "primary" : "secondary"}
                                            onClick={() => setType(ContentType.Twitter)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <Button 
                                        onClick={addContent} 
                                        variant="primary" 
                                        text={isLoading ? "Adding..." : "Submit"}
                                        disabled={isLoading}
                                    />
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}