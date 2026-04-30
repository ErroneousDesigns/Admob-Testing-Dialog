import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { AdPlayerDialog } from './AdPlayerDialog';
import { 
  Play, 
  Square, 
  Timer, 
  TrendingUp, 
  DollarSign, 
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Key,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

interface AdMobTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LogEntry {
  id: number;
  time: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AdMobSettings {
  appId: string;
  apiKey: string;
  bannerAdId: string;
  interstitialAdId: string;
  rewardedAdId: string;
  nativeAdId: string;
  appOpenAdId: string;
  audioAdId: string;
  videoAdId: string;
}

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

export function AdMobTestDialog({ open, onOpenChange }: AdMobTestDialogProps) {
  const [adType, setAdType] = useState('interstitial');
  const [timingMode, setTimingMode] = useState('interval');
  const [interval, setInterval] = useState(30);
  const [delay, setDelay] = useState(5);
  const [frequency, setFrequency] = useState(3);
  const [isAutoTest, setIsAutoTest] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState({
    impressions: 0,
    clicks: 0,
    revenue: 0,
    ctr: 0
  });
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isAdPlayerOpen, setIsAdPlayerOpen] = useState(false);
  const [adMobSettings, setAdMobSettings] = useState<AdMobSettings>({
    appId: 'ca-app-pub-3940256099942544~3347511713',
    apiKey: '',
    bannerAdId: 'ca-app-pub-3940256099942544/6300978111',
    interstitialAdId: 'ca-app-pub-3940256099942544/1033173712',
    rewardedAdId: 'ca-app-pub-3940256099942544/5224354917',
    nativeAdId: 'ca-app-pub-3940256099942544/2247696110',
    appOpenAdId: 'ca-app-pub-3940256099942544/3419835294',
    audioAdId: 'ca-app-pub-3940256099942544/8691691433',
    videoAdId: 'ca-app-pub-3940256099942544/5135589807',
  });
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    adSize: '320x50',
    fullScreen: false,
    position: 'bottom',
    audioDuration: 15,
    videoQuality: '720p',
    orientation: 'any',
    ageTargeting: 'all',
    geoTargeting: 'all',
    deviceType: 'all',
    connectionType: 'any',
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCountdown(null);
      simulateAdShow();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const addLog = (type: 'success' | 'error' | 'info', message: string) => {
    const newLog: LogEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      type,
      message
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const simulateAdShow = () => {
    addLog('info', `Loading ${adType} ad...`);
    setIsAdPlayerOpen(true);
  };

  const handleAdComplete = (success: boolean) => {
    if (success) {
      addLog('success', `${adType} ad displayed successfully`);
      setStats(prev => ({
        ...prev,
        impressions: prev.impressions + 1,
        clicks: prev.clicks + (Math.random() > 0.9 ? 1 : 0),
        revenue: prev.revenue + (Math.random() * 0.5),
      }));
    } else {
      addLog('info', `${adType} ad dismissed by user`);
    }
  };

  const startManualTest = () => {
    addLog('info', `Starting manual ${adType} test...`);
    setCountdown(delay);
  };

  const startAutoTest = () => {
    setIsTesting(true);
    setIsAutoTest(true);
    addLog('info', `Auto-testing started with ${interval}s interval`);
  };

  const stopAutoTest = () => {
    setIsTesting(false);
    setIsAutoTest(false);
    addLog('info', 'Auto-testing stopped');
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('info', 'Logs cleared');
  };

  const resetStats = () => {
    setStats({ impressions: 0, clicks: 0, revenue: 0, ctr: 0 });
    addLog('info', 'Statistics reset');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleSettingChange = (field: keyof AdMobSettings, value: string) => {
    setAdMobSettings(prev => ({ ...prev, [field]: value }));
    toast.success('Settings updated');
  };

  useEffect(() => {
    if (stats.impressions > 0) {
      setStats(prev => ({
        ...prev,
        ctr: (prev.clicks / prev.impressions) * 100
      }));
    }
  }, [stats.impressions, stats.clicks]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoTest && isTesting) {
      timer = setInterval(() => {
        simulateAdShow();
      }, interval * 1000);
    }
    return () => clearInterval(timer);
  }, [isAutoTest, isTesting, interval, adType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex-1 flex flex-col max-h-screen max-w-full overscroll-auto">
        <DialogHeader>
          <DialogTitle>AdMob Testing Console</DialogTitle>
          <DialogDescription>
            Test different ad formats and timing configurations
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="config" className="flex-1 flex flex-col overflow-auto overscroll-auto">
          <TabsList className="grid w-full grid-cols-4 object-cover">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="settings">AdMob Settings</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="flex-1 overflow-auto space-y-4 mt-4 overscroll-auto">
            <Card>
              <CardHeader>
                <CardTitle>Ad Configuration</CardTitle>
                <CardDescription>Select ad type and format</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ad-type">Ad Type</Label>
                  <Select value={adType} onValueChange={setAdType}>
                    <SelectTrigger id="ad-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="interstitial">Interstitial</SelectItem>
                      <SelectItem value="rewarded">Rewarded</SelectItem>
                      <SelectItem value="native">Native</SelectItem>
                      <SelectItem value="app-open">App Open</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timing-mode">Timing Mode</Label>
                  <Select value={timingMode} onValueChange={setTimingMode}>
                    <SelectTrigger id="timing-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interval">Fixed Interval</SelectItem>
                      <SelectItem value="frequency">Frequency Cap</SelectItem>
                      <SelectItem value="event">Event-Based</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Timing Settings</CardTitle>
                <CardDescription>Configure ad display timing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {timingMode === 'interval' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="interval">Interval (seconds)</Label>
                      <span className="text-sm font-medium">{interval}s</span>
                    </div>
                    <Slider
                      id="interval"
                      min={5}
                      max={300}
                      step={5}
                      value={[interval]}
                      onValueChange={(value) => setInterval(value[0])}
                    />
                  </div>
                )}

                {timingMode === 'frequency' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="frequency">Max ads per hour</Label>
                      <span className="text-sm font-medium">{frequency}</span>
                    </div>
                    <Slider
                      id="frequency"
                      min={1}
                      max={10}
                      step={1}
                      value={[frequency]}
                      onValueChange={(value) => setFrequency(value[0])}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="delay">Initial Delay (seconds)</Label>
                    <span className="text-sm font-medium">{delay}s</span>
                  </div>
                  <Slider
                    id="delay"
                    min={0}
                    max={60}
                    step={1}
                    value={[delay]}
                    onValueChange={(value) => setDelay(value[0])}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Testing Controls</CardTitle>
                <CardDescription>Start and control ad tests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Test Mode</Label>
                    <p className="text-sm text-gray-500">Automatically show ads at intervals</p>
                  </div>
                  <Switch
                    checked={isAutoTest}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        startAutoTest();
                      } else {
                        stopAutoTest();
                      }
                    }}
                  />
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 gap-2" 
                    onClick={startManualTest}
                    disabled={isTesting}
                  >
                    <Play className="h-4 w-4" />
                    Test Ad Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2"
                    onClick={stopAutoTest}
                    disabled={!isTesting}
                  >
                    <Square className="h-4 w-4" />
                    Stop Testing
                  </Button>
                </div>

                {countdown !== null && (
                  <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-lg">
                    <Timer className="h-5 w-5 text-blue-600 animate-pulse" />
                    <span className="text-lg font-semibold text-blue-600">
                      Ad loading in {countdown}s...
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  AdMob Settings
                </CardTitle>
                <CardDescription>Configure your AdMob App ID, API keys, and ad unit IDs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="app-id">App ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="app-id"
                      value={adMobSettings.appId}
                      onChange={(e) => handleSettingChange('appId', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(adMobSettings.appId, 'App ID')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Found in AdMob console under App settings</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type="password"
                      placeholder="Enter your API key..."
                      value={adMobSettings.apiKey}
                      onChange={(e) => handleSettingChange('apiKey', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(adMobSettings.apiKey, 'API Key')}
                      disabled={!adMobSettings.apiKey}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">For advanced integration and reporting</p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Ad Unit IDs</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="banner-ad-id">Banner Ad Unit ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="banner-ad-id"
                        value={adMobSettings.bannerAdId}
                        onChange={(e) => handleSettingChange('bannerAdId', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(adMobSettings.bannerAdId, 'Banner Ad ID')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interstitial-ad-id">Interstitial Ad Unit ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="interstitial-ad-id"
                        value={adMobSettings.interstitialAdId}
                        onChange={(e) => handleSettingChange('interstitialAdId', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(adMobSettings.interstitialAdId, 'Interstitial Ad ID')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rewarded-ad-id">Rewarded Ad Unit ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="rewarded-ad-id"
                        value={adMobSettings.rewardedAdId}
                        onChange={(e) => handleSettingChange('rewardedAdId', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(adMobSettings.rewardedAdId, 'Rewarded Ad ID')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="native-ad-id">Native Ad Unit ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="native-ad-id"
                        value={adMobSettings.nativeAdId}
                        onChange={(e) => handleSettingChange('nativeAdId', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(adMobSettings.nativeAdId, 'Native Ad ID')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="app-open-ad-id">App Open Ad Unit ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="app-open-ad-id"
                        value={adMobSettings.appOpenAdId}
                        onChange={(e) => handleSettingChange('appOpenAdId', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(adMobSettings.appOpenAdId, 'App Open Ad ID')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audio-ad-id">Audio Ad Unit ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="audio-ad-id"
                        value={adMobSettings.audioAdId}
                        onChange={(e) => handleSettingChange('audioAdId', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(adMobSettings.audioAdId, 'Audio Ad ID')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video-ad-id">Video Ad Unit ID</Label>
                    <div className="flex gap-2">
                      <Input
                        id="video-ad-id"
                        value={adMobSettings.videoAdId}
                        onChange={(e) => handleSettingChange('videoAdId', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(adMobSettings.videoAdId, 'Video Ad ID')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-900">
                    <strong>Note:</strong> These are Google's test ad unit IDs. Replace them with your production IDs from the AdMob console.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="flex-1 overflow-auto mt-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                  <Eye className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.impressions}</div>
                  <p className="text-xs text-gray-500">Total ad views</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.clicks}</div>
                  <p className="text-xs text-gray-500">User interactions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CTR</CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.ctr.toFixed(2)}%</div>
                  <p className="text-xs text-gray-500">Click-through rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
                  <p className="text-xs text-gray-500">Estimated earnings</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={resetStats}>
                Reset Statistics
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="flex-1 overflow-hidden flex flex-col mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Activity Log</h3>
              <Button variant="outline" size="sm" onClick={clearLogs}>
                Clear Logs
              </Button>
            </div>
            
            <ScrollArea className="flex-1 border rounded-lg p-4">
              <div className="space-y-2">
                {logs.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No logs yet. Start testing to see activity.</p>
                ) : (
                  logs.map((log) => (
                    <div 
                      key={log.id} 
                      className="flex items-start gap-2 text-sm p-2 rounded hover:bg-gray-50"
                    >
                      {log.type === 'success' && <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />}
                      {log.type === 'error' && <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />}
                      {log.type === 'info' && <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <Badge variant="outline" className="text-xs mb-1">
                          {log.time}
                        </Badge>
                        <p className={
                          log.type === 'success' ? 'text-green-700' :
                          log.type === 'error' ? 'text-red-700' :
                          'text-gray-700'
                        }>
                          {log.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
      
      <AdPlayerDialog 
        open={isAdPlayerOpen}
        onOpenChange={setIsAdPlayerOpen}
        adType={adType}
        advancedSettings={advancedSettings}
        onAdComplete={handleAdComplete}
      />
    </Dialog>
  );
}