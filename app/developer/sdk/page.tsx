'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { GradientButton } from '@/components/aceternity/gradient-button';
import { Download, Code, FileText, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const platforms = [
  {
    id: 'python',
    name: 'Python',
    version: '1.2.0',
    description: 'For Pygame and Python-based games',
    icon: '🐍',
    codeExample: `from scrunchy import ScrunchyClient

client = ScrunchyClient(api_key="your_api_key")
assets = await client.get_player_assets(wallet_address)`,
  },
  {
    id: 'csharp',
    name: 'C#',
    version: '1.2.0',
    description: 'For Unity and MonoGame',
    icon: '🎮',
    codeExample: `using Scrunchy;

var client = new ScrunchyClient(apiKey: "your_api_key");
var assets = await client.GetPlayerAssetsAsync(walletAddress);`,
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    version: '1.2.0',
    description: 'For Web games and Node.js',
    icon: '⚡',
    codeExample: `import { ScrunchyClient } from '@scrunchy/sdk';

const client = new ScrunchyClient({ apiKey: 'your_api_key' });
const assets = await client.getPlayerAssets(walletAddress);`,
  },
  {
    id: 'rust',
    name: 'Rust',
    version: '1.0.0',
    description: 'For native games',
    icon: '🦀',
    codeExample: `use scrunchy::ScrunchyClient;

let client = ScrunchyClient::new("your_api_key");
let assets = client.get_player_assets(wallet_address).await?;`,
  },
];

export default function SDKDownloadsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState('python');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard!');
  };

  const platform = platforms.find(p => p.id === selectedPlatform) || platforms[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-display font-bold mb-2">SDK Downloads</h1>
          <p className="text-gray-600 mb-8">Download and integrate Scrunchy SDK for your platform</p>

          {/* Platform Selector */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {platforms.map((p) => (
              <GlassCard
                key={p.id}
                hover
                onClick={() => setSelectedPlatform(p.id)}
                className={`cursor-pointer bg-white border-gray-200 ${
                  selectedPlatform === p.id ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{p.icon}</div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">v{p.version}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Platform Details */}
          <div className="grid md:grid-cols-2 gap-8">
            <GlassCard className="bg-white border-gray-200 p-6">
              <h2 className="text-2xl font-semibold mb-4">{platform.name} SDK</h2>
              <p className="text-gray-600 mb-6">{platform.description}</p>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Version</p>
                  <p className="font-semibold">{platform.version}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Installation</p>
                  <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                    {selectedPlatform === 'python' && 'pip install scrunchy-sdk'}
                    {selectedPlatform === 'csharp' && 'dotnet add package Scrunchy.SDK'}
                    {selectedPlatform === 'typescript' && 'npm install @scrunchy/sdk'}
                    {selectedPlatform === 'rust' && 'cargo add scrunchy-sdk'}
                  </div>
                </div>
                <GradientButton className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download SDK
                </GradientButton>
              </div>
            </GlassCard>

            <GlassCard className="bg-white border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Quick Start</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCode(platform.codeExample)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{platform.codeExample}</code>
              </pre>
            </GlassCard>
          </div>

          {/* Documentation Links */}
          <GlassCard className="bg-white border-gray-200 p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Documentation</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start" asChild>
                <a href="/developer/docs">
                  <FileText className="h-4 w-4 mr-2" />
                  Getting Started
                </a>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <a href="/developer/docs">
                  <Code className="h-4 w-4 mr-2" />
                  API Reference
                </a>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <a href="/developer/docs">
                  <FileText className="h-4 w-4 mr-2" />
                  Examples
                </a>
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}

