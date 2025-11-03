import { useRef, useState, useEffect } from 'react';
import { Image, Palette, Save, Upload, RotateCcw, Download } from 'lucide-react';
import { usePaint } from '../../context/PaintContext';
import citadelColors from '../../data/citadelColors.json';

// Helper: Point in polygon detection
function isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];

    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

export function MiniatureCanvas() {
  const canvasRef = useRef(null);
  const { stock } = usePaint();
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedPaint, setSelectedPaint] = useState(null);
  const [savedSchemes, setSavedSchemes] = useState([]);

  // Define regions with polygon coordinates
  const [regions, setRegions] = useState([
    {
      id: 'helmet',
      name: 'Helmet',
      color: null,
      paintName: null,
      // Coordinates for a 600x800 canvas - adjust based on your template
      coords: [[250, 80], [350, 80], [370, 150], [230, 150]]
    },
    {
      id: 'chest',
      name: 'Chest Plate',
      color: null,
      paintName: null,
      coords: [[240, 200], [360, 200], [380, 350], [220, 350]]
    },
    {
      id: 'shoulder_left',
      name: 'Left Shoulder Pad',
      color: null,
      paintName: null,
      coords: [[180, 180], [230, 180], [240, 240], [170, 240]]
    },
    {
      id: 'shoulder_right',
      name: 'Right Shoulder Pad',
      color: null,
      paintName: null,
      coords: [[370, 180], [420, 180], [430, 240], [360, 240]]
    },
    {
      id: 'arm_left',
      name: 'Left Arm',
      color: null,
      paintName: null,
      coords: [[170, 250], [220, 250], [210, 400], [160, 400]]
    },
    {
      id: 'arm_right',
      name: 'Right Arm',
      color: null,
      paintName: null,
      coords: [[380, 250], [430, 250], [440, 400], [390, 400]]
    },
    {
      id: 'leg_left',
      name: 'Left Leg',
      color: null,
      paintName: null,
      coords: [[230, 450], [280, 450], [270, 700], [220, 700]]
    },
    {
      id: 'leg_right',
      name: 'Right Leg',
      color: null,
      paintName: null,
      coords: [[320, 450], [370, 450], [380, 700], [330, 700]]
    },
    {
      id: 'backpack',
      name: 'Backpack',
      color: null,
      paintName: null,
      coords: [[260, 150], [340, 150], [350, 280], [250, 280]]
    },
    {
      id: 'weapon',
      name: 'Bolter',
      color: null,
      paintName: null,
      coords: [[400, 350], [500, 320], [510, 370], [410, 400]]
    },
    {
      id: 'base',
      name: 'Base',
      color: null,
      paintName: null,
      coords: [[150, 720], [450, 720], [470, 780], [130, 780]]
    }
  ]);

  // Load saved schemes on mount
  useEffect(() => {
    const schemes = JSON.parse(localStorage.getItem('paintSchemes') || '[]');
    setSavedSchemes(schemes);
  }, []);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background template image
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
      // Show placeholder if no template uploaded
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Upload a Primaris Marine template', canvas.width / 2, canvas.height / 2);
      ctx.font = '16px sans-serif';
      ctx.fillText('to start painting!', canvas.width / 2, canvas.height / 2 + 30);
    }

    // Draw colored regions with multiply blend mode for realistic effect
    regions.forEach(region => {
      if (region.color && backgroundImage) {
        ctx.globalCompositeOperation = 'multiply';
        ctx.globalAlpha = 0.65; // Semi-transparent for realistic paint effect
        ctx.fillStyle = region.color;

        ctx.beginPath();
        ctx.moveTo(region.coords[0][0], region.coords[0][1]);
        region.coords.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.closePath();
        ctx.fill();

        // Reset composite mode
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1.0;
      }

      // Draw selection outline
      if (selectedRegion === region.id) {
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(region.coords[0][0], region.coords[0][1]);
        region.coords.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  }, [backgroundImage, regions, selectedRegion]);

  // Handle canvas click to select region
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Scale coordinates if canvas is displayed at different size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    // Find which region was clicked
    const clickedRegion = regions.find(region =>
      isPointInPolygon([scaledX, scaledY], region.coords)
    );

    if (clickedRegion) {
      setSelectedRegion(clickedRegion.id);
    }
  };

  // Apply selected paint to selected region
  const applyPaint = () => {
    if (!selectedRegion || !selectedPaint) return;

    setRegions(regions.map(region =>
      region.id === selectedRegion
        ? { ...region, color: selectedPaint.hex, paintName: selectedPaint.name }
        : region
    ));
  };

  // Upload template image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => setBackgroundImage(img);
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Save scheme to localStorage
  const saveScheme = () => {
    const schemeName = prompt('Enter scheme name (e.g., "Blood Angels", "Ultramarines"):');
    if (!schemeName) return;

    const scheme = {
      id: Date.now(),
      name: schemeName,
      regions: regions.map(r => ({
        id: r.id,
        name: r.name,
        color: r.color,
        paintName: r.paintName
      })),
      createdAt: new Date().toISOString()
    };

    const schemes = JSON.parse(localStorage.getItem('paintSchemes') || '[]');
    schemes.push(scheme);
    localStorage.setItem('paintSchemes', JSON.stringify(schemes));
    setSavedSchemes(schemes);

    alert(`Scheme "${schemeName}" saved!`);
  };

  // Load scheme from localStorage
  const loadScheme = (scheme) => {
    setRegions(regions.map(region => {
      const saved = scheme.regions.find(r => r.id === region.id);
      return saved ? {
        ...region,
        color: saved.color,
        paintName: saved.paintName
      } : region;
    }));
  };

  // Reset all colors
  const resetColors = () => {
    if (confirm('Reset all colors? This cannot be undone.')) {
      setRegions(regions.map(r => ({
        ...r,
        color: null,
        paintName: null
      })));
    }
  };

  // Export as image
  const exportImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'primaris-color-scheme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Get paints to display - either from stock or all paints
  const paintsToDisplay = stock.length > 0 ? stock : citadelColors.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Image className="w-8 h-8 text-indigo-400" />
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Miniature Color Preview</h2>
              <p className="text-slate-400 mt-1">Visualize your paint schemes before painting</p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <label className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer shadow-md">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Template
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={saveScheme}
              className="bg-green-600 hover:bg-green-500 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-md"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Save Scheme
            </button>

            <button
              onClick={exportImage}
              className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-md"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Export
            </button>

            <button
              onClick={resetColors}
              className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4 inline mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Canvas - Takes 3 columns */}
        <div className="lg:col-span-3 bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
          <canvas
            ref={canvasRef}
            width={600}
            height={800}
            onClick={handleCanvasClick}
            className="w-full border-2 border-slate-700 rounded-lg cursor-crosshair bg-slate-900 hover:border-indigo-500 transition-colors"
            style={{ maxHeight: '800px' }}
          />
        </div>

        {/* Right Sidebar - Controls */}
        <div className="space-y-6">
          {/* Region Selector */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
            <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-400" />
              Armor Regions
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {regions.map(region => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedRegion === region.id
                      ? 'bg-indigo-600 text-white shadow-lg scale-105'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg border-2 border-slate-600 shadow-sm"
                        style={{ backgroundColor: region.color || '#374151' }}
                      />
                      <div>
                        <span className="font-medium block">{region.name}</span>
                        {region.paintName && (
                          <span className="text-xs opacity-80">{region.paintName}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Paint Selector */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-100 mb-3">Select Paint</h3>
            <p className="text-sm text-slate-400 mb-3">
              {stock.length > 0 ? 'From your stock:' : 'Sample paints (add to stock for more):'}
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {paintsToDisplay.map(paint => (
                <button
                  key={paint.id}
                  onClick={() => setSelectedPaint(paint)}
                  className={`w-full px-4 py-2 rounded-lg transition-colors text-left flex items-center gap-3 ${
                    selectedPaint?.id === paint.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  }`}
                >
                  <div className="w-6 h-6 rounded border border-slate-600" style={{ backgroundColor: paint.hex }} />
                  <span>{paint.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          {selectedRegion && selectedPaint && (
            <button
              onClick={applyPaint}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Palette className="w-5 h-5 inline mr-2" />
              Apply {selectedPaint.name} to {regions.find(r => r.id === selectedRegion)?.name}
            </button>
          )}

          {/* Saved Schemes */}
          {savedSchemes.length > 0 && (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-100 mb-3">Saved Schemes</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {savedSchemes.map(scheme => (
                  <button
                    key={scheme.id}
                    onClick={() => loadScheme(scheme)}
                    className="w-full text-left px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-slate-100">{scheme.name}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      {new Date(scheme.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-slate-100 mb-3">How to Use</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300">
          <div>
            <span className="text-indigo-400 font-semibold">1. Upload Template</span>
            <p>Upload a Primaris Marine line drawing (find templates on DeviantArt or community sites)</p>
          </div>
          <div>
            <span className="text-indigo-400 font-semibold">2. Paint Regions</span>
            <p>Click armor regions, select a paint, and apply. See colors blend realistically!</p>
          </div>
          <div>
            <span className="text-indigo-400 font-semibold">3. Save & Share</span>
            <p>Save schemes for later or export as PNG to share with friends!</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-indigo-900/20 border border-indigo-700 rounded-lg">
          <p className="text-sm text-indigo-200">
            <strong>💡 Pro Tip:</strong> Find free Primaris Marine templates on DeviantArt (search "Primaris template")
            or use the official GW heraldry sheet. The template should be a clean line drawing on white background for best results!
          </p>
        </div>
      </div>
    </div>
  );
}

export default MiniatureCanvas;
