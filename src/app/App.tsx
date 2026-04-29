import { useState } from 'react';
import { AdMobTestDialog } from './components/AdMobTestDialog';
import { Button } from './components/ui/button';
import { Settings } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">AdMob Testing Tool</h1>
        <p className="text-gray-600 mb-8">Test and configure ad timing settings</p>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          size="lg"
          className="gap-2"
        >
          <Settings className="h-5 w-5" />
          Open AdMob Test Console
        </Button>
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