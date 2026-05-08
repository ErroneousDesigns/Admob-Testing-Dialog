import { useState } from "react";
import { AdMobTestDialog } from "./components/AdMobTestDialog";
import { Button } from "./components/ui/button";
import { Settings, CircleArrowRight } from "lucide-react";
import { Toaster } from "./components/ui/sonner";

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-red-500 to-green-500 bg-clip-text text-transparent mb-4">
          AdMob Testing Tool
          <p className="text-xl font-bold bg-gradient-to-l from-blue-500 via-red-500 to-green-500 bg-clip-text text-transparent mb-8">
            Test and configure ad timing settings
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            size="lg"
            className="gap-2"
          >
            <CircleArrowRight className="h-5 w-5 text-yellow-100 animate-ping" />
            Open AdMob Test Console
          </Button>
        </h1>
      </div>

      <AdMobTestDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />

      <Toaster />
    </div>
  );
}

export default App;