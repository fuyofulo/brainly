import { Button } from "./components/Button"
import { Card } from "./components/Card"
import { PlusIcon } from "./icons/PlusIcon"
import { ShareIcon } from "./icons/Shareicon"

function App() {

  return (
    <div>
      <Button variant="secondary" text="Share Content" startIcon={<ShareIcon/>}></Button>
      <Button variant="primary" text="Add Content" startIcon={<PlusIcon/>}></Button>
      <Card title="X post" link="x.com" type="twitter"/>
    </div>
  )
}

export default App
