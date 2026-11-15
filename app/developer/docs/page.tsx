'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { GlassCard } from '@/components/aceternity/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Rocket, BookOpen, FileCode, Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';

const BASE_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api')
  : 'http://localhost:3000/api';

// Code examples
const codeExamples = {
  python: {
    client: `# scrunchy_client.py
import requests
from typing import Optional, Dict, List

class ScrunchyClient:
    def __init__(self, api_key: str, base_url: str = "${BASE_URL}"):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "X-API-Key": api_key,
            "Content-Type": "application/json"
        }
    
    def get_player_assets(self, wallet_address: str) -> Dict:
        """Get all assets owned by a player"""
        response = requests.get(
            f"{self.base_url}/sdk/players/{wallet_address}/assets",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def check_access(self, mint_address: str, wallet_address: str) -> bool:
        """Check if player has access to an asset"""
        response = requests.post(
            f"{self.base_url}/sdk/check-access",
            headers=self.headers,
            json={
                "mintAddress": mint_address,
                "walletAddress": wallet_address
            }
        )
        response.raise_for_status()
        data = response.json()
        return data.get("hasAccess", False)
    
    def get_asset(self, asset_id: str) -> Dict:
        """Get asset details"""
        response = requests.get(
            f"{self.base_url}/sdk/assets/{asset_id}",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def batch_get_assets(self, asset_ids: List[str]) -> Dict:
        """Get multiple assets at once"""
        response = requests.post(
            f"{self.base_url}/sdk/assets/batch",
            headers=self.headers,
            json={"assetIds": asset_ids}
        )
        response.raise_for_status()
        return response.json()

# Usage example
if __name__ == "__main__":
    client = ScrunchyClient(api_key="your-api-key-here")
    
    # Get player assets
    assets = client.get_player_assets("PlayerWalletAddress...")
    print(f"Player has {len(assets.get('assets', []))} assets")
    
    # Check access
    has_access = client.check_access(
        mint_address="AssetMintAddress...",
        wallet_address="PlayerWalletAddress..."
    )
    print(f"Has access: {has_access}")`,
    
    pygame: `# pygame_integration.py
import pygame
import requests
from scrunchy_client import ScrunchyClient

class ScrunchyAssetManager:
    def __init__(self, api_key: str):
        self.client = ScrunchyClient(api_key)
        self.player_wallet = None
        self.player_assets = []
    
    def authenticate_player(self, wallet_address: str):
        """Set player wallet and load assets"""
        self.player_wallet = wallet_address
        self.load_player_assets()
    
    def load_player_assets(self):
        """Load all assets for the current player"""
        try:
            response = self.client.get_player_assets(self.player_wallet)
            self.player_assets = response.get("assets", [])
            print(f"Loaded {len(self.player_assets)} assets")
        except Exception as e:
            print(f"Error loading assets: {e}")
    
    def can_use_asset(self, mint_address: str) -> bool:
        """Check if player can use a specific asset"""
        try:
            return self.client.check_access(mint_address, self.player_wallet)
        except Exception as e:
            print(f"Error checking access: {e}")
            return False
    
    def get_asset_by_type(self, asset_type: str):
        """Get all assets of a specific type"""
        return [
            asset for asset in self.player_assets
            if asset.get("assetType") == asset_type
        ]
    
    def get_weapons(self):
        """Get all weapons"""
        return self.get_asset_by_type("WEAPON")
    
    def get_armor(self):
        """Get all armor"""
        return self.get_asset_by_type("ARMOR")

# Example Pygame game integration
class Game:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((800, 600))
        self.asset_manager = ScrunchyAssetManager("your-api-key")
        
        # Authenticate player (in real game, get from wallet connection)
        self.asset_manager.authenticate_player("PlayerWalletAddress...")
    
    def equip_weapon(self, weapon_mint: str):
        """Equip a weapon if player has access"""
        if self.asset_manager.can_use_asset(weapon_mint):
            weapon = next(
                (w for w in self.asset_manager.get_weapons() 
                 if w["mintAddress"] == weapon_mint),
                None
            )
            if weapon:
                print(f"Equipped: {weapon['name']}")
                return True
        print("Cannot equip: No access to this weapon")
        return False
    
    def run(self):
        running = True
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                # Add game logic here
            self.screen.fill((0, 0, 0))
            pygame.display.flip()
        
        pygame.quit()

if __name__ == "__main__":
    game = Game()
    game.run()`,
  },

  unity: {
    client: `// ScrunchyClient.cs
using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using Newtonsoft.Json;

[Serializable]
public class Asset {
    public string id;
    public string mintAddress;
    public string name;
    public string assetType;
    public string rarity;
    public string imageUrl;
    public Dictionary<string, object> attributes;
    public bool hasAccess;
}

[Serializable]
public class AssetsResponse {
    public List<Asset> assets;
}

public class ScrunchyClient : MonoBehaviour {
    private string apiKey;
    private string baseUrl = "${BASE_URL}";
    
    public void Initialize(string apiKey) {
        this.apiKey = apiKey;
    }
    
    public IEnumerator GetPlayerAssets(string walletAddress, System.Action<AssetsResponse> callback) {
        string url = $"{baseUrl}/sdk/players/{walletAddress}/assets";
        using (UnityWebRequest request = UnityWebRequest.Get(url)) {
            request.SetRequestHeader("X-API-Key", apiKey);
            request.SetRequestHeader("Content-Type", "application/json");
            
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success) {
                AssetsResponse response = JsonConvert.DeserializeObject<AssetsResponse>(request.downloadHandler.text);
                callback?.Invoke(response);
            } else {
                Debug.LogError($"Error: {request.error}");
                callback?.Invoke(null);
            }
        }
    }
    
    public IEnumerator CheckAccess(string mintAddress, string walletAddress, System.Action<bool> callback) {
        string url = $"{baseUrl}/sdk/check-access";
        
        var payload = new {
            mintAddress = mintAddress,
            walletAddress = walletAddress
        };
        
        string json = JsonConvert.SerializeObject(payload);
        byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(json);
        
        using (UnityWebRequest request = new UnityWebRequest(url, "POST")) {
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("X-API-Key", apiKey);
            request.SetRequestHeader("Content-Type", "application/json");
            
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success) {
                var response = JsonConvert.DeserializeObject<Dictionary<string, object>>(
                    request.downloadHandler.text
                );
                bool hasAccess = Convert.ToBoolean(response["hasAccess"]);
                callback?.Invoke(hasAccess);
            } else {
                Debug.LogError($"Error: {request.error}");
                callback?.Invoke(false);
            }
        }
    }
    
    public IEnumerator GetAsset(string assetId, System.Action<Asset> callback) {
        string url = $"{baseUrl}/sdk/assets/{assetId}";
        using (UnityWebRequest request = UnityWebRequest.Get(url)) {
            request.SetRequestHeader("X-API-Key", apiKey);
            request.SetRequestHeader("Content-Type", "application/json");
            
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success) {
                Asset asset = JsonConvert.DeserializeObject<Asset>(request.downloadHandler.text);
                callback?.Invoke(asset);
            } else {
                Debug.LogError($"Error: {request.error}");
                callback?.Invoke(null);
            }
        }
    }
}`,
    
    gameManager: `// GameManager.cs - Unity Integration Example
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GameManager : MonoBehaviour {
    [Header("Scrunchy Configuration")]
    [SerializeField] private string apiKey = "your-api-key-here";
    [SerializeField] private string playerWalletAddress;
    
    private ScrunchyClient scrunchyClient;
    private List<Asset> playerAssets = new List<Asset>();
    private Asset currentWeapon;
    
    void Start() {
        // Initialize Scrunchy client
        scrunchyClient = gameObject.AddComponent<ScrunchyClient>();
        scrunchyClient.Initialize(apiKey);
        
        // Load player assets
        StartCoroutine(LoadPlayerAssets());
    }
    
    IEnumerator LoadPlayerAssets() {
        AssetsResponse response = null;
        yield return scrunchyClient.GetPlayerAssets(playerWalletAddress, (result) => {
            response = result;
        });
        
        if (response != null && response.assets != null) {
            playerAssets = response.assets;
            Debug.Log($"Loaded {playerAssets.Count} assets");
            
            // Equip first weapon if available
            var weapons = playerAssets.FindAll(a => a.assetType == "WEAPON");
            if (weapons.Count > 0) {
                EquipWeapon(weapons[0]);
            }
        }
    }
    
    public void EquipWeapon(Asset weapon) {
        StartCoroutine(VerifyAndEquipWeapon(weapon));
    }
    
    IEnumerator VerifyAndEquipWeapon(Asset weapon) {
        bool hasAccess = false;
        yield return scrunchyClient.CheckAccess(weapon.mintAddress, playerWalletAddress, (access) => {
            hasAccess = access;
        });
        
        if (hasAccess) {
            currentWeapon = weapon;
            Debug.Log($"Equipped weapon: {weapon.name}");
            // Update game UI, apply weapon stats, etc.
        } else {
            Debug.LogWarning("Player does not have access to this weapon");
        }
    }
    
    public List<Asset> GetPlayerWeapons() {
        return playerAssets.FindAll(a => a.assetType == "WEAPON");
    }
    
    public List<Asset> GetPlayerArmor() {
        return playerAssets.FindAll(a => a.assetType == "ARMOR");
    }
}`,
  },

  javascript: {
    client: `// scrunchy-client.js
class ScrunchyClient {
  constructor(apiKey, baseUrl = "${BASE_URL}") {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.headers = {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json'
    };
  }

  async getPlayerAssets(walletAddress) {
    const response = await fetch(
      \`\${this.baseUrl}/sdk/players/\${walletAddress}/assets\`,
      {
        method: 'GET',
        headers: this.headers
      }
    );
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    return await response.json();
  }

  async checkAccess(mintAddress, walletAddress) {
    const response = await fetch(
      \`\${this.baseUrl}/sdk/check-access\`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          mintAddress,
          walletAddress
        })
      }
    );
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data.hasAccess;
  }

  async getAsset(assetId) {
    const response = await fetch(
      \`\${this.baseUrl}/sdk/assets/\${assetId}\`,
      {
        method: 'GET',
        headers: this.headers
      }
    );
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    return await response.json();
  }

  async batchGetAssets(assetIds) {
    const response = await fetch(
      \`\${this.baseUrl}/sdk/assets/batch\`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ assetIds })
      }
    );
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    return await response.json();
  }
}

// Usage example (Node.js or Browser)
const client = new ScrunchyClient('your-api-key-here');

async function main() {
  try {
    // Get player assets
    const assets = await client.getPlayerAssets('PlayerWalletAddress...');
    console.log(\`Player has \${assets.assets.length} assets\`);

    // Check access
    const hasAccess = await client.checkAccess(
      'AssetMintAddress...',
      'PlayerWalletAddress...'
    );
    console.log(\`Has access: \${hasAccess}\`);

    // Get asset details
    const asset = await client.getAsset('asset-id');
    console.log(\`Asset: \${asset.name}\`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrunchyClient;
}`,
    
    nodejs: `// nodejs-integration.js
const ScrunchyClient = require('./scrunchy-client');
const express = require('express');

const app = express();
const client = new ScrunchyClient(process.env.SCRUNCHY_API_KEY);

app.get('/api/player/:wallet/assets', async (req, res) => {
  try {
    const { wallet } = req.params;
    const assets = await client.getPlayerAssets(wallet);
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/verify-access', async (req, res) => {
  try {
    const { mintAddress, walletAddress } = req.body;
    const hasAccess = await client.checkAccess(mintAddress, walletAddress);
    res.json({ hasAccess });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});`,
    
    browser: `// browser-integration.js
// HTML: <script src="scrunchy-client.js"></script>

// Initialize client (get API key from your server)
const client = new ScrunchyClient('your-api-key-here');

// Example: Load player inventory
async function loadPlayerInventory(walletAddress) {
  try {
    const response = await client.getPlayerAssets(walletAddress);
    const assets = response.assets;
    
    // Display assets in UI
    const inventoryContainer = document.getElementById('inventory');
    assets.forEach(asset => {
      const assetElement = document.createElement('div');
      assetElement.className = 'asset-card';
      assetElement.innerHTML = \`
        <img src="\${asset.imageUrl}" alt="\${asset.name}">
        <h3>\${asset.name}</h3>
        <p>Type: \${asset.assetType}</p>
        <p>Rarity: \${asset.rarity}</p>
      \`;
      inventoryContainer.appendChild(assetElement);
    });
  } catch (error) {
    console.error('Error loading inventory:', error);
  }
}

// Example: Check if player can use item
async function canUseItem(mintAddress, walletAddress) {
  try {
    const hasAccess = await client.checkAccess(mintAddress, walletAddress);
    if (hasAccess) {
      // Allow player to use item
      enableItemUsage(mintAddress);
    } else {
      // Show "rent required" message
      showRentRequiredMessage();
    }
  } catch (error) {
    console.error('Error checking access:', error);
  }
}

// Connect to Solana wallet to get player address
// (Using Phantom wallet as example)
async function connectWallet() {
  if (window.solana && window.solana.isPhantom) {
    const response = await window.solana.connect();
    const walletAddress = response.publicKey.toString();
    
    // Load inventory for connected wallet
    await loadPlayerInventory(walletAddress);
  } else {
    alert('Please install Phantom wallet');
  }
}`,
  }
};

const apiEndpoints = [
  {
    method: 'POST',
    path: '/sdk/check-access',
    description: 'Check if a player has access to an asset',
    auth: 'API Key',
    request: {
      mintAddress: 'string',
      walletAddress: 'string'
    },
    response: {
      hasAccess: 'boolean',
      expiresAt: 'string (ISO8601)',
      rentalId: 'string (if rented)'
    }
  },
  {
    method: 'GET',
    path: '/sdk/players/:wallet/assets',
    description: 'Get all assets owned/rented by a player',
    auth: 'API Key',
    params: {
      wallet: 'Player wallet address'
    },
    response: {
      assets: 'Array<Asset>',
      total: 'number'
    }
  },
  {
    method: 'GET',
    path: '/sdk/assets/:id',
    description: 'Get asset details (transformed for game use)',
    auth: 'API Key',
    params: {
      id: 'Asset ID'
    },
    response: 'Asset object'
  },
  {
    method: 'POST',
    path: '/sdk/assets/batch',
    description: 'Get multiple assets at once',
    auth: 'API Key',
    request: {
      assetIds: 'Array<string>'
    },
    response: {
      assets: 'Array<Asset>'
    }
  }
];

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={copyCode}
        className="absolute top-2 right-2 z-10 p-2 bg-gray-700 hover:bg-gray-600 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ borderRadius: '8px', padding: '1.5rem' }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState('getting-started');
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'unity' | 'javascript'>('javascript');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              API Documentation
            </h1>
            <p className="text-xl text-gray-600">
              Complete guide to integrating Scrunchy into your games and applications
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="getting-started">
                <Rocket className="h-4 w-4 mr-2" />
                Getting Started
              </TabsTrigger>
              <TabsTrigger value="api-reference">
                <BookOpen className="h-4 w-4 mr-2" />
                API Reference
              </TabsTrigger>
              <TabsTrigger value="code-examples">
                <FileCode className="h-4 w-4 mr-2" />
                Code Examples
              </TabsTrigger>
              <TabsTrigger value="tutorials">
                <Code className="h-4 w-4 mr-2" />
                Tutorials
              </TabsTrigger>
            </TabsList>

            <TabsContent value="getting-started">
              <div className="space-y-6">
                <GlassCard className="bg-white border-gray-200 p-8">
                  <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">1. Register Your Game</h3>
                      <p>First, register your game in the developer portal to get your API key.</p>
                      <ol className="list-decimal list-inside mt-2 space-y-1 ml-4">
                        <li>Go to <code className="bg-gray-100 px-2 py-1 rounded">/developer/register</code></li>
                        <li>Fill in your game details</li>
                        <li>Copy your API key from the dashboard</li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2">2. Install Dependencies</h3>
                      <div className="grid md:grid-cols-3 gap-4 mt-4">
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Python</h4>
                          <CodeBlock language="bash">
                            pip install requests
                          </CodeBlock>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Node.js</h4>
                          <CodeBlock language="bash">
                            npm install node-fetch
                          </CodeBlock>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Unity</h4>
                          <CodeBlock language="bash">
                            # Install via Package Manager:
                            # - UnityWebRequest (built-in)
                            # - Newtonsoft.Json (via Package Manager)
                          </CodeBlock>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2">3. Initialize Client</h3>
                      <CodeBlock language="javascript">
                        {codeExamples.javascript.client.split('class ScrunchyClient')[0] + 'class ScrunchyClient {\n  constructor(apiKey, baseUrl = "' + BASE_URL + '") {\n    this.apiKey = apiKey;\n    this.baseUrl = baseUrl;\n  }\n  // ... rest of the code\n}'}
                      </CodeBlock>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-2">4. Make Your First API Call</h3>
                      <CodeBlock language="javascript">
                        {`const client = new ScrunchyClient('your-api-key');
const assets = await client.getPlayerAssets('player-wallet-address');
console.log(assets);`}
                      </CodeBlock>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="bg-blue-50 border-blue-200 p-6">
                  <h3 className="font-semibold text-lg mb-2">🔑 Authentication</h3>
                  <p className="text-gray-700 mb-4">
                    All SDK endpoints require an API key in the <code className="bg-blue-100 px-2 py-1 rounded">X-API-Key</code> header.
                  </p>
                  <CodeBlock language="bash">
                    {`curl -X GET "${BASE_URL}/sdk/players/ADDRESS/assets" \\
  -H "X-API-Key: your-api-key-here"`}
                  </CodeBlock>
                </GlassCard>
              </div>
            </TabsContent>

            <TabsContent value="api-reference">
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <GlassCard key={index} className="bg-white border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-lg font-mono">{endpoint.path}</code>
                        </div>
                        <p className="text-gray-700">{endpoint.description}</p>
                      </div>
                      <Badge variant="outline">{endpoint.auth}</Badge>
                    </div>

                    {endpoint.params && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Path Parameters:</h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {Object.entries(endpoint.params).map(([key, value]) => (
                            <li key={key}>
                              <code className="bg-gray-100 px-2 py-1 rounded">{key}</code>: {value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {endpoint.request && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Request Body:</h4>
                        <CodeBlock language="json">
                          {JSON.stringify(endpoint.request, null, 2)}
                        </CodeBlock>
                      </div>
                    )}

                    {endpoint.response && (
                      <div>
                        <h4 className="font-semibold mb-2">Response:</h4>
                        <CodeBlock language="json">
                          {typeof endpoint.response === 'string' 
                            ? endpoint.response 
                            : JSON.stringify(endpoint.response, null, 2)}
                        </CodeBlock>
                      </div>
                    )}
                  </GlassCard>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="code-examples">
              <div className="space-y-6">
                {/* Language Selector */}
                <div className="flex gap-2">
                  <Button
                    variant={selectedLanguage === 'javascript' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('javascript')}
                  >
                    JavaScript/TypeScript
                  </Button>
                  <Button
                    variant={selectedLanguage === 'python' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('python')}
                  >
                    Python
                  </Button>
                  <Button
                    variant={selectedLanguage === 'unity' ? 'default' : 'outline'}
                    onClick={() => setSelectedLanguage('unity')}
                  >
                    Unity (C#)
                  </Button>
                </div>

                {/* JavaScript Examples */}
                {selectedLanguage === 'javascript' && (
                  <div className="space-y-6">
                    <GlassCard className="bg-white border-gray-200 p-6">
                      <h3 className="text-xl font-bold mb-4">Base Client (Node.js / Browser)</h3>
                      <CodeBlock language="javascript">
                        {codeExamples.javascript.client}
                      </CodeBlock>
                    </GlassCard>

                    <GlassCard className="bg-white border-gray-200 p-6">
                      <h3 className="text-xl font-bold mb-4">Node.js Express Server</h3>
                      <CodeBlock language="javascript">
                        {codeExamples.javascript.nodejs}
                      </CodeBlock>
                    </GlassCard>

                    <GlassCard className="bg-white border-gray-200 p-6">
                      <h3 className="text-xl font-bold mb-4">Browser Integration</h3>
                      <CodeBlock language="javascript">
                        {codeExamples.javascript.browser}
                      </CodeBlock>
                    </GlassCard>
                  </div>
                )}

                {/* Python Examples */}
                {selectedLanguage === 'python' && (
                  <div className="space-y-6">
                    <GlassCard className="bg-white border-gray-200 p-6">
                      <h3 className="text-xl font-bold mb-4">Python Client</h3>
                      <CodeBlock language="python">
                        {codeExamples.python.client}
                      </CodeBlock>
                    </GlassCard>

                    <GlassCard className="bg-white border-gray-200 p-6">
                      <h3 className="text-xl font-bold mb-4">Pygame Integration</h3>
                      <CodeBlock language="python">
                        {codeExamples.python.pygame}
                      </CodeBlock>
                    </GlassCard>
                  </div>
                )}

                {/* Unity Examples */}
                {selectedLanguage === 'unity' && (
                  <div className="space-y-6">
                    <GlassCard className="bg-white border-gray-200 p-6">
                      <h3 className="text-xl font-bold mb-4">Scrunchy Client (C#)</h3>
                      <CodeBlock language="csharp">
                        {codeExamples.unity.client}
                      </CodeBlock>
                    </GlassCard>

                    <GlassCard className="bg-white border-gray-200 p-6">
                      <h3 className="text-xl font-bold mb-4">Game Manager Integration</h3>
                      <CodeBlock language="csharp">
                        {codeExamples.unity.gameManager}
                      </CodeBlock>
                    </GlassCard>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tutorials">
              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard hover className="bg-white border-gray-200 p-6">
                  <Rocket className="h-8 w-8 text-purple-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Quick Start Guide</h3>
                  <p className="text-gray-600 mb-4">
                    Get up and running with Scrunchy in 5 minutes. Learn the basics of authentication and making your first API calls.
                  </p>
                  <Button variant="outline">Coming Soon</Button>
                </GlassCard>

                <GlassCard hover className="bg-white border-gray-200 p-6">
                  <FileCode className="h-8 w-8 text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Unity Integration Tutorial</h3>
                  <p className="text-gray-600 mb-4">
                    Step-by-step guide to integrating Scrunchy assets into your Unity game, including inventory management and access control.
                  </p>
                  <Button variant="outline">Coming Soon</Button>
                </GlassCard>

                <GlassCard hover className="bg-white border-gray-200 p-6">
                  <Code className="h-8 w-8 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Pygame Integration Tutorial</h3>
                  <p className="text-gray-600 mb-4">
                    Learn how to integrate Scrunchy assets into your Python game using Pygame, with examples for inventory and equipment systems.
                  </p>
                  <Button variant="outline">Coming Soon</Button>
                </GlassCard>

                <GlassCard hover className="bg-white border-gray-200 p-6">
                  <BookOpen className="h-8 w-8 text-pink-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Features</h3>
                  <p className="text-gray-600 mb-4">
                    Deep dive into batch operations, caching strategies, error handling, and performance optimization.
                  </p>
                  <Button variant="outline">Coming Soon</Button>
                </GlassCard>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
