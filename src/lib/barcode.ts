let JsBarcode: any = null;

async function loadJsBarcode() {
  if (JsBarcode) return JsBarcode;
  
  return new Promise((resolve, reject) => {
    if ((window as any).JsBarcode) {
      JsBarcode = (window as any).JsBarcode;
      resolve(JsBarcode);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js';
    script.onload = () => {
      JsBarcode = (window as any).JsBarcode;
      resolve(JsBarcode);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export async function generateBarcodeSVG(barcode: string, width = 2, height = 60): Promise<string> {
  try {
    await loadJsBarcode();
    
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    JsBarcode(svgElement, barcode, {
      format: 'CODE128',
      width: width,
      height: height,
      displayValue: true,
      fontSize: 14,
      margin: 10,
      background: '#ffffff',
      lineColor: '#000000'
    });
    
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgElement);
  } catch (error) {
    console.error('Barcode generation failed:', error);
    return generateFallbackBarcode(barcode, width, height);
  }
}

function generateFallbackBarcode(barcode: string, width: number, height: number): string {
  const chars = barcode.split('');
  const barWidth = (width * 80) / (chars.length * 3);
  let bars = '';
  let x = 10;
  
  chars.forEach((char, i) => {
    const code = char.charCodeAt(0);
    const pattern = ((code + i) % 2 === 0) ? '101' : '110';
    pattern.split('').forEach((bit, j) => {
      if (bit === '1') {
        bars += `<rect x="${x}" y="10" width="${barWidth}" height="${height}" fill="black"/>`;
      }
      x += barWidth;
    });
    x += barWidth * 0.5;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width * 100}" height="${height + 30}" viewBox="0 0 ${width * 100} ${height + 30}">
    <rect width="100%" height="100%" fill="white"/>
    ${bars}
    <text x="${width * 100 / 2}" y="${height + 25}" text-anchor="middle" font-family="monospace" font-size="14">${barcode}</text>
  </svg>`;
}

export async function svgToPng(svgString: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Canvas context not available'));
      }
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };
    
    img.src = url;
  });
}

export function downloadPng(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

type PrinterSettings = {
  labelSize: string;
  paperSize: string;
  barcodeWidth: number;
  barcodeHeight: number;
  showProductName: boolean;
  showPrice: boolean;
  showSku: boolean;
  columns: number;
};

const defaultSettings: PrinterSettings = {
  labelSize: "medium",
  paperSize: "thermal",
  barcodeWidth: 2,
  barcodeHeight: 50,
  showProductName: true,
  showPrice: true,
  showSku: true,
  columns: 1,
};

export async function printBarcode(
  barcode: string, 
  productTitle: string, 
  variantTitle: string, 
  quantity: number,
  settings: PrinterSettings = defaultSettings
) {
  const svg = await generateBarcodeSVG(barcode, settings.barcodeWidth, settings.barcodeHeight);
  
  const labelSizes: { [key: string]: { width: string; height: string; padding: string } } = {
    small: { width: "25mm", height: "12mm", padding: "3px" },
    medium: { width: "38mm", height: "25mm", padding: "5px" },
    large: { width: "50mm", height: "25mm", padding: "6px" },
    custom: { width: "50mm", height: "30mm", padding: "8px" }
  };

  const paperConfigs: { [key: string]: { width: string; height: string; margin: string; type: string } } = {
    thermal: { width: "100mm", height: "150mm", margin: "5mm", type: "roll" },
    a4: { width: "190mm", height: "277mm", margin: "10mm", type: "sheet" },
    letter: { width: "200mm", height: "250mm", margin: "10mm", type: "sheet" },
    "50mm": { width: "46mm", height: "auto", margin: "2mm", type: "roll" },
    "70mm": { width: "66mm", height: "auto", margin: "2mm", type: "roll" }
  };

  const labelConfig = labelSizes[settings.labelSize] || labelSizes.medium;
  const paperConfig = paperConfigs[settings.paperSize] || paperConfigs.thermal;
  const isRoll = paperConfig.type === "roll";

  const printWindow = window.open('', '_blank', 'width=700,height=900');
  if (printWindow) {
    let labelsHtml = '';
    
    for (let i = 0; i < quantity; i++) {
      let infoHtml = '';
      if (settings.showProductName) infoHtml += `<div style="font-size: 10px; font-weight: bold; margin-bottom: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${productTitle}</div>`;
      if (variantTitle && variantTitle !== 'Default') infoHtml += `<div style="font-size: 8px; color: #666; margin-bottom: 1px;">${variantTitle}</div>`;
      if (settings.showSku) infoHtml += `<div style="font-size: 7px; color: #888; margin-bottom: 1px;">SKU: ${barcode}</div>`;
      if (settings.showPrice) infoHtml += `<div style="font-size: 11px; font-weight: bold; margin-top: 2px;">$${parseFloat(barcode).toFixed(2)}</div>`;
      
      labelsHtml += `
        <div style="
          width: ${labelConfig.width}; 
          height: ${labelConfig.height}; 
          padding: ${labelConfig.padding}; 
          margin: ${isRoll ? '2px auto' : '5px'}; 
          display: inline-block; 
          text-align: center; 
          border: 1px dashed #ccc; 
          box-sizing: border-box;
          vertical-align: top;
          overflow: hidden;
        ">
          ${infoHtml}
          <div style="margin: 2px 0; overflow: hidden;">${svg}</div>
        </div>
      `;
    }

    const gridStyle = settings.columns > 1 && !isRoll ? `
      display: grid;
      grid-template-columns: repeat(${settings.columns}, 1fr);
      gap: 8px;
    ` : `
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    `;

    const paperWidth = isRoll ? "auto" : paperConfig.width;
    const paperHeight = paperConfig.height;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Barcode Labels</title>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
          <style>
            * { box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: #f5f5f5;
            }
            .paper { 
              background: white; 
              width: ${paperWidth};
              ${!isRoll ? `height: ${paperHeight};` : ''}
              min-height: 100px;
              margin: 0 auto; 
              padding: ${paperConfig.margin};
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              border-radius: 4px;
            }
            .labels-container {
              ${gridStyle}
              align-items: flex-start;
            }
            @page { 
              margin: 0; 
              size: ${paperConfig.type === 'roll' ? 'auto' : 'portrait'};
            }
            @media print { 
              body { 
                padding: 0; 
                background: white; 
              }
              .paper { 
                box-shadow: none; 
                border-radius: 0;
                width: 100% !important;
                max-width: 100% !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="paper">
            <div class="labels-container">
              ${labelsHtml}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }
}

type LabelItem = {
  barcode: string;
  productTitle: string;
  variantTitle: string;
};

export function generateQRCode(data: string): string {
  return generateQRCodeSVG(data);
}

export function generateQRCodeSVG(data: string): string {
  const size = 100;
  const qr = generateQR(data, size);
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
  svg += `<rect width="100%" height="100%" fill="white"/>`;
  
  const cellSize = size / qr.length;
  for (let row = 0; row < qr.length; row++) {
    for (let col = 0; col < qr[row].length; col++) {
      if (qr[row][col]) {
        svg += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
      }
    }
  }
  
  svg += '</svg>';
  return svg;
}

function generateQR(data: string, size: number): boolean[][] {
  const version = 1;
  const eccLevel = 'L';
  const modules = 21 + (version - 1) * 4;
  const matrix: boolean[][] = Array(modules).fill(null).map(() => Array(modules).fill(false));
  
  for (let i = 0; i < modules; i++) {
    for (let j = 0; j < modules; j++) {
      if ((i < 8 && j < 8) || (i < 8 && j >= modules - 8) || (i >= modules - 8 && j < 8)) {
        matrix[i][j] = true;
      }
    }
  }
  
  const hash = simpleHash(data);
  for (let i = 0; i < modules; i++) {
    for (let j = 0; j < modules; j++) {
      if (!matrix[i][j]) {
        matrix[i][j] = ((hash + i * j) % 7) < 3;
      }
    }
  }
  
  return matrix;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export async function printBulkLabels(
  labels: LabelItem[],
  settings: PrinterSettings = defaultSettings
) {
  const labelSizes: { [key: string]: { width: string; height: string; padding: string } } = {
    small: { width: "25mm", height: "12mm", padding: "3px" },
    medium: { width: "38mm", height: "25mm", padding: "5px" },
    large: { width: "50mm", height: "25mm", padding: "6px" },
    custom: { width: "50mm", height: "30mm", padding: "8px" }
  };

  const paperConfigs: { [key: string]: { width: string; height: string; margin: string; type: string } } = {
    thermal: { width: "100mm", height: "150mm", margin: "5mm", type: "roll" },
    a4: { width: "190mm", height: "277mm", margin: "10mm", type: "sheet" },
    letter: { width: "200mm", height: "250mm", margin: "10mm", type: "sheet" },
    "50mm": { width: "46mm", height: "auto", margin: "2mm", type: "roll" },
    "70mm": { width: "66mm", height: "auto", margin: "2mm", type: "roll" }
  };

  const labelConfig = labelSizes[settings.labelSize] || labelSizes.medium;
  const paperConfig = paperConfigs[settings.paperSize] || paperConfigs.thermal;
  const isRoll = paperConfig.type === "roll";

  const svgPromises = labels.map(label => generateBarcodeSVG(label.barcode, settings.barcodeWidth, settings.barcodeHeight));
  const svgs = await Promise.all(svgPromises);

  let labelsHtml = '';
  labels.forEach((label, index) => {
    const svg = svgs[index];
    let infoHtml = '';
    if (settings.showProductName) infoHtml += `<div style="font-size: 10px; font-weight: bold; margin-bottom: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${label.productTitle}</div>`;
    if (label.variantTitle && label.variantTitle !== 'Default') infoHtml += `<div style="font-size: 8px; color: #666; margin-bottom: 1px;">${label.variantTitle}</div>`;
    if (settings.showSku) infoHtml += `<div style="font-size: 7px; color: #888; margin-bottom: 1px;">SKU: ${label.barcode}</div>`;
    if (settings.showPrice) infoHtml += `<div style="font-size: 11px; font-weight: bold; margin-top: 2px;">$${parseFloat(label.barcode).toFixed(2)}</div>`;
    
    labelsHtml += `
      <div style="
        width: ${labelConfig.width}; 
        height: ${labelConfig.height}; 
        padding: ${labelConfig.padding}; 
        margin: ${isRoll ? '2px auto' : '5px'}; 
        display: inline-block; 
        text-align: center; 
        border: 1px dashed #ccc; 
        box-sizing: border-box;
        vertical-align: top;
        overflow: hidden;
      ">
        ${infoHtml}
        <div style="margin: 2px 0; overflow: hidden;">${svg}</div>
      </div>
    `;
  });

  const gridStyle = settings.columns > 1 && !isRoll ? `
    display: grid;
    grid-template-columns: repeat(${settings.columns}, 1fr);
    gap: 8px;
  ` : `
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  `;

  const paperWidth = isRoll ? "auto" : paperConfig.width;
  const paperHeight = paperConfig.height;

  const printWindow = window.open('', '_blank', 'width=700,height=900');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Barcode Labels (${labels.length} labels)</title>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
          <style>
            * { box-sizing: border-box; }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: #f5f5f5;
            }
            .paper { 
              background: white; 
              width: ${paperWidth};
              ${!isRoll ? `height: ${paperHeight};` : ''}
              min-height: 100px;
              margin: 0 auto; 
              padding: ${paperConfig.margin};
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              border-radius: 4px;
            }
            .labels-container {
              ${gridStyle}
              align-items: flex-start;
            }
            @page { 
              margin: 0; 
              size: ${paperConfig.type === 'roll' ? 'auto' : 'portrait'};
            }
            @media print { 
              body { 
                padding: 0; 
                background: white; 
              }
              .paper { 
                box-shadow: none; 
                border-radius: 0;
                width: 100% !important;
                max-width: 100% !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="paper">
            <div class="labels-container">
              ${labelsHtml}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  }
}