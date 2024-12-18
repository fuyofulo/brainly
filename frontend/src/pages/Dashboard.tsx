import { useEffect, useState } from "react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { CreateContentModal } from "../components/CreateContentModal"
import { PlusIcon } from "../icons/PlusIcon"
import { ShareIcon } from "../icons/ShareIcon"
import { useContent } from "../hooks/UseContent"
import { BACKEND_URL } from "../config"
import axios from "axios"
import { Header } from "../components/Header"

export function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const {contents, refresh} = useContent();

  useEffect(() => {
    refresh();
  }, [modalOpen])

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleCreateContent = () => {
    // Navigate to content creation page or open modal
    console.log("Creating content...");
  };

  const handleShareBrain = () => {
    // Share brain functionality
    console.log("Sharing brain...");
  };

  const handleLogin = () => {
    // Redirect to login page or open login modal
    console.log("Logging in...");
    setIsLoggedIn(true); // Simulating login for demo
  };

  return <div>
    <Header
        isLoggedIn={isLoggedIn}
        onCreateContent={handleCreateContent}
        onShareBrain={handleShareBrain}
        onLogin={handleLogin}
      />
    <div className="p-6">
      <CreateContentModal open={modalOpen} onClose={() => {
        setModalOpen(false);
      }} />
      <div className="flex justify-end gap-4">
        <Button onClick={() => {
          setModalOpen(true)
        }} variant="primary" text="Add content" startIcon={<PlusIcon />}></Button>
        <Button onClick={async () => {
            const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                share: true
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
            alert(shareUrl);
        }} variant="secondary" text="Share brain" startIcon={<ShareIcon />}></Button>
      </div>

      <div className="p-6 flex gap-4 flex-wrap">
        {contents.map(({type, link, title}) => <Card 
            type={type}
            link={link}
            title={title}
        />)}
      </div>
    </div>
  </div>
}