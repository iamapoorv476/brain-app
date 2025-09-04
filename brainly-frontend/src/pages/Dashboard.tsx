import { useEffect, useState } from "react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { CreateContentModal } from "../components/CreateContentModel"
import { PlusIcon } from "../icons/PlusIcon"
import { ShareIcon } from "../icons/ShareIcon"
import { useContent } from "../hooks/useContents"
import { Sidebar } from "../components/Sidebar"
import axios from "axios"

// Share Modal Component
function ShareModal({ isOpen, onClose, shareUrl }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">🧠 Share Your Brain</h2>
        <p className="text-gray-600 mb-4">
          Anyone with this link can view your shared content:
        </p>
        
        <div className="flex items-center gap-2 mb-6">
          <input 
            type="text" 
            value={shareUrl} 
            readOnly 
            className="flex-1 p-3 border rounded-lg bg-gray-50 text-sm font-mono"
          />
          <button
            onClick={copyToClipboard}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        
        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const {contents, refresh} = useContent();

  useEffect(() => {
    refresh();
  }, [modalOpen])

  const handleShareBrain = async () => {
    setIsSharing(true);
    try {
      const response = await axios.post("/api/v1/shareLink", {
        share: true,
      }, {
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      });
      
      const url = `http://localhost:5173/share/${response.data.hash}`;
      setShareUrl(url);
      setShareModalOpen(true);
      
    } catch (error) {
      console.error("Error creating share link:", error);
      alert("Failed to create share link. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  return <div>
    <Sidebar />
    <div className="p-4 ml-72 min-h-screen bg-gray-100 border-2">
      <CreateContentModal 
        open={modalOpen} 
        onClose={() => {
          setModalOpen(false);
        }}
        onContentAdded={() => {
          refresh();
        }}
      />
      
      <ShareModal 
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareUrl={shareUrl}
      />
      
      <div className="flex justify-end gap-4 mb-6">
        <Button onClick={() => {
          setModalOpen(true)
        }} variant="primary" text="Add content" startIcon={<PlusIcon />}></Button>
        <Button 
          onClick={handleShareBrain}
          variant="secondary" 
          text={isSharing ? "Creating link..." : "Share Brain"} 
          startIcon={<ShareIcon />}
          disabled={isSharing}
        ></Button>
      </div>

      {/* Render the content cards */}
      <div className="flex gap-4 flex-wrap">
        {contents.map((content) => (
          <Card 
            key={content._id}
            type={content.type}
            link={content.links}
            title={content.title}
          />
        ))}
      </div>

      {/* Show message when no content */}
      {contents.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <p>No content added yet. Click "Add content" to get started!</p>
        </div>
      )}
    </div>
  </div>
}