'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Play, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const endpoints = [
  { value: 'get-player-assets', label: 'Get Player Assets' },
  { value: 'verify-ownership', label: 'Verify Asset Ownership' },
  { value: 'get-asset-details', label: 'Get Asset Details' },
];

export default function TestConsolePage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('get-player-assets');
  const [requestBody, setRequestBody] = useState('{\n  "walletAddress": "0x123..."\n}');
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<Array<{ endpoint: string; timestamp: Date }>>([]);

  const handleTest = () => {
    // Mock API call
    const mockResponse = {
      success: true,
      data: {
        assets: [
          { id: '1', name: 'Dragon Slayer Sword' },
        ],
      },
    };
    setResponse(JSON.stringify(mockResponse, null, 2));
    setHistory([...history, { endpoint: selectedEndpoint, timestamp: new Date() }]);
    toast.success('API call successful!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-display font-bold mb-8">Test Console</h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Request Builder */}
            <GlassCard className="bg-white border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Request Builder</h2>
              <div className="space-y-4">
                <div>
                  <Label>API Endpoint</Label>
                  <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {endpoints.map((endpoint) => (
                        <SelectItem key={endpoint.value} value={endpoint.value}>
                          {endpoint.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Request Body (JSON)</Label>
                  <Textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="font-mono text-sm mt-2"
                    rows={10}
                  />
                </div>
                <GradientButton onClick={handleTest} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Send Request
                </GradientButton>
              </div>
            </GlassCard>

            {/* Response Viewer */}
            <GlassCard className="bg-white border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Response</h2>
                {response && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(response);
                      toast.success('Response copied!');
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm min-h-[300px]">
                <code>{response || 'Response will appear here...'}</code>
              </pre>
            </GlassCard>
          </div>

          {/* History */}
          <GlassCard className="bg-white border-gray-200 p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Request History</h2>
              <Button variant="ghost" size="sm" onClick={() => setHistory([])}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
            <div className="space-y-2">
              {history.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-mono text-sm">{item.endpoint}</span>
                  <span className="text-sm text-gray-500">{item.timestamp.toLocaleTimeString()}</span>
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-gray-500 text-center py-4">No request history</p>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}

