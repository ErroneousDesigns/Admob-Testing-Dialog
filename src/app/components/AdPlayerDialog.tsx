import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { X, Volume2, VolumeX, Play, Pause, Maximize } from 'lucide-react';

interface AdvancedSettings {
  adSize: string;
  fullScreen: boolean;
  position: string;
  audioDuration: number;
  videoQuality: string;
  orientation: string;
  ageTargeting: string;
  geoTargeting: string;
  deviceType: string;
  connectionType: string;
}

interface AdPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adType: string;
  advancedSettings: AdvancedSettings;
  onAdComplete: (success: boolean) => void;
}

export function AdPlayerDialog({ open, onOpenChange, adType, advancedSettings, onAdComplete }: AdPlayerDialogProps) {
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [adProgress, setAdProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [canClose, setCanClose] = useState(false);
  
  const getAdDuration = () => {
    if (adType === 'rewarded') return 30;
    if (adType === 'audio') return advancedSettings.audioDuration;
    if (adType === 'video') return 15;
    if (adType === 'interstitial') return 5;
    return 10;
  };
  
  const adDuration = getAdDuration();

  const getBannerDimensions = () => {
    const size = advancedSettings.adSize;
    switch (size) {
      case '320x50': return { width: '320px', height: '50px' };
      case '320x100': return { width: '320px', height: '100px' };
      case '300x250': return { width: '300px', height: '250px' };
      case '728x90': return { width: '728px', height: '90px' };
      case '160x600': return { width: '160px', height: '600px' };
      case '468x60': return { width: '468px', height: '60px' };
      case '970x90': return { width: '970px', height: '90px' };
      default: return { width: '320px', height: '50px' };
    }
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      setLoadProgress(0);
      setAdProgress(0);
      setIsPaused(false);
      setCanClose(adType === 'banner' || adType === 'native');
      
      // Simulate ad loading
      const loadInterval = setInterval(() => {
        setLoadProgress(prev => {
          if (prev >= 100) {
            clearInterval(loadInterval);
            setLoading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      return () => clearInterval(loadInterval);
    }
  }, [open, adType]);

  useEffect(() => {
    if (!loading && open && !isPaused) {
      // Ad playback progress
      const progressInterval = setInterval(() => {
        setAdProgress(prev => {
          const newProgress = prev + (100 / adDuration);
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            setCanClose(true);
            setTimeout(() => {
              onAdComplete(true);
              onOpenChange(false);
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 1000);

      return () => clearInterval(progressInterval);
    }
  }, [loading, open, adDuration, onAdComplete, onOpenChange, isPaused]);

  const handleClose = () => {
    if (canClose) {
      onOpenChange(false);
      onAdComplete(false);
    }
  };

  const renderAdContent = () => {
    const dimensions = getBannerDimensions();
    
    switch (adType) {
      case 'banner':
        return (
          <div 
            className={`relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto ${advancedSettings.position === 'inline' ? '' : 'sticky ' + (advancedSettings.position === 'top' ? 'top-0' : 'bottom-0')}`}
            style={{ width: dimensions.width, height: dimensions.height }}
          >
            <div className="text-center text-white">
              <p className="font-bold">Banner Ad</p>
              <p className="text-xs">{advancedSettings.adSize}</p>
            </div>
          </div>
        );
      
      case 'native':
        return (
          <div className="bg-white rounded-lg p-4 border max-w-md mx-auto">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Sponsored Content</p>
                    <p className="text-sm text-gray-600">Example advertiser</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Ad</Badge>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  This is a sample native ad that blends with your content.
                </p>
                <Button size="sm" className="mt-2">Learn More</Button>
              </div>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="relative w-full h-[400px] bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-lg flex flex-col items-center justify-center text-white p-8">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-center space-y-4">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-6xl">🎵</span>
              </div>
              <h2 className="text-3xl font-bold">Audio Advertisement</h2>
              <p className="text-lg">Listen to this sponsored message</p>
              <div className="flex gap-2 items-center justify-center mt-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                </Button>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Audio ad - {advancedSettings.audioDuration}s</span>
                <span className="text-sm">{Math.ceil((adDuration * (100 - adProgress)) / 100)}s remaining</span>
              </div>
              <Progress value={adProgress} className="h-2" />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="relative w-full h-[500px] bg-black rounded-lg flex flex-col items-center justify-center">
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              <Badge variant="secondary" className="bg-black/50 text-white">
                Video Ad • {advancedSettings.videoQuality}
              </Badge>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                {advancedSettings.fullScreen && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="relative w-full h-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 flex items-center justify-center">
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20 w-20 h-20"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="h-12 w-12" /> : <Pause className="h-12 w-12" />}
              </Button>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between mb-2 text-white">
                <span className="text-sm">Video advertisement playing</span>
                <span className="text-sm">{Math.floor(adProgress)}%</span>
              </div>
              <Progress value={adProgress} className="h-2" />
            </div>
          </div>
        );
      
      case 'interstitial':
      case 'app-open':
        const isFullScreen = advancedSettings.fullScreen;
        return (
          <div className={`relative w-full ${isFullScreen ? 'h-screen' : 'h-[500px]'} bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex flex-col items-center justify-center text-white p-8`}>
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {adType === 'app-open' ? 'App Open Ad' : 'Interstitial Ad'}
                {isFullScreen && ' • Full Screen'}
              </Badge>
            </div>
            <div className="text-center space-y-4">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-6xl font-bold">AD</span>
              </div>
              <h2 className="text-3xl font-bold">Sample Advertisement</h2>
              <p className="text-lg">This is a {isFullScreen ? 'full-screen' : 'standard'} ad experience</p>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Visit Advertiser
              </Button>
            </div>
            {!canClose && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Ad will close in {Math.ceil((adDuration * (100 - adProgress)) / 100)}s</span>
                  <span className="text-sm">{Math.floor(adProgress)}%</span>
                </div>
                <Progress value={adProgress} className="h-2" />
              </div>
            )}
          </div>
        );
      
      case 'rewarded':
        return (
          <div className="relative w-full h-[500px] bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-lg flex flex-col items-center justify-center text-white p-8">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-center space-y-4">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <span className="text-6xl">🎁</span>
              </div>
              <h2 className="text-3xl font-bold">Rewarded Ad</h2>
              <p className="text-lg">Watch this ad to earn your reward!</p>
              <div className="bg-white/20 rounded-lg p-4 mt-4">
                <p className="text-sm">Your reward: +100 coins</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Watch for {Math.ceil((adDuration * (100 - adProgress)) / 100)}s to claim reward</span>
                <span className="text-sm font-semibold">{Math.floor(adProgress)}%</span>
              </div>
              <Progress value={adProgress} className="h-2" />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={canClose ? onOpenChange : undefined}>
      <DialogContent 
        className={`${advancedSettings.fullScreen && (adType === 'interstitial' || adType === 'app-open' || adType === 'video') ? 'max-w-full h-screen p-0' : 'max-w-2xl p-0'} gap-0 [&>button]:hidden`}
      >
        <DialogTitle className="sr-only">
          Ad Preview - {adType} {loading ? 'Loading' : 'Playing'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {loading ? 'Advertisement is loading' : `Displaying a ${adType} advertisement`}
        </DialogDescription>
        {loading ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 mb-4">Loading ad...</p>
            <Progress value={loadProgress} className="w-full max-w-xs" />
          </div>
        ) : (
          <div className="relative">
            {canClose && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <div className="p-4">
              {renderAdContent()}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
