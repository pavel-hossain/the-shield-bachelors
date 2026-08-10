import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Converts oklch(...) color functions to rgb/rgba or hex strings so html2canvas
 * doesn't throw "Attempting to parse an unsupported color function 'oklch'"
 */
export function convertOklchToRgb(colorStr: string): string {
  if (!colorStr || !colorStr.includes('oklch')) return colorStr;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillStyle = colorStr;
      const computed = ctx.fillStyle;
      if (computed && !computed.includes('oklch')) {
        return computed;
      }
    }
  } catch (e) {
    // ignore
  }

  // Fallback regex converter for oklch(L C H [/ A])
  return colorStr.replace(/oklch\(([^)]+)\)/gi, (_, args) => {
    try {
      const parts = args.trim().split(/[\s/]+/);
      let l = parseFloat(parts[0]);
      if (parts[0].endsWith('%')) l = l / 100;
      let c = parseFloat(parts[1]) || 0;
      let h = parseFloat(parts[2]) || 0;
      let a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
      if (parts[3] && parts[3].endsWith('%')) a = parseFloat(parts[3]) / 100;

      const hRad = (h * Math.PI) / 180;
      const a_lab = c * Math.cos(hRad);
      const b_lab = c * Math.sin(hRad);

      const l_ = Math.pow(l + 0.3963377774 * a_lab + 0.2158037573 * b_lab, 3);
      const m_ = Math.pow(l - 0.1055613458 * a_lab - 0.0638541728 * b_lab, 3);
      const s_ = Math.pow(l - 0.0894841775 * a_lab - 1.291485548 * b_lab, 3);

      let r = +4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_;
      let g = -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_;
      let b = -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_;

      const toSrgb = (val: number) => {
        val = Math.max(0, Math.min(1, val));
        return val <= 0.0031308
          ? Math.round(val * 12.92 * 255)
          : Math.round((1.055 * Math.pow(val, 1 / 2.4) - 0.055) * 255);
      };

      const red = toSrgb(r);
      const green = toSrgb(g);
      const blue = toSrgb(b);

      if (a < 1) {
        return `rgba(${red}, ${green}, ${blue}, ${a})`;
      }
      return `rgb(${red}, ${green}, ${blue})`;
    } catch (err) {
      return 'rgb(100, 116, 139)';
    }
  });
}

/**
 * Cleans up cloned DOM styles before html2canvas processes CSS rules
 */
export function sanitizeDocForHtml2Canvas(clonedDoc: Document) {
  // 1. Process all <style> elements
  const styles = clonedDoc.querySelectorAll('style');
  styles.forEach((style) => {
    if (
      style.textContent &&
      (style.textContent.includes('oklch') ||
        style.textContent.includes('color-mix') ||
        style.textContent.includes('light-dark'))
    ) {
      style.textContent = style.textContent
        .replace(/oklch\([^)]+\)/gi, (m) => convertOklchToRgb(m))
        .replace(/color-mix\([^)]+\)/gi, 'rgba(100, 116, 139, 0.5)')
        .replace(/light-dark\([^)]+\)/gi, '#000000');
    }
  });

  // 2. Process inline styles on all elements
  const allElements = clonedDoc.querySelectorAll('*');
  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (htmlEl.style && htmlEl.style.cssText) {
      if (
        htmlEl.style.cssText.includes('oklch') ||
        htmlEl.style.cssText.includes('color-mix') ||
        htmlEl.style.cssText.includes('light-dark')
      ) {
        htmlEl.style.cssText = htmlEl.style.cssText
          .replace(/oklch\([^)]+\)/gi, (m) => convertOklchToRgb(m))
          .replace(/color-mix\([^)]+\)/gi, 'rgba(100, 116, 139, 0.5)')
          .replace(/light-dark\([^)]+\)/gi, '#000000');
      }
    }
  });
}

/**
 * Downloads high quality A4 PDF from an HTML element safely handling vertical text alignment
 */
export async function generatePdfFromElement(
  element: HTMLElement,
  filename: string,
  orientation: 'p' | 'l' = 'p'
) {
  const canvas = await html2canvas(element, {
    scale: 2, // High DPI resolution
    useCORS: true,
    logging: false,
    letterRendering: true, // Prevents text/character shifting
    allowTaint: true,
    scrollY: -window.scrollY, // FIXES vertical text displacement caused by page scrolling!
    scrollX: 0,
    windowWidth: 1200, // Fixed canvas capture viewport width
    backgroundColor: '#ffffff',
    onclone: (clonedDoc) => {
      sanitizeDocForHtml2Canvas(clonedDoc);
      // Ensure element styling doesn't shift
      const targetElement = clonedDoc.body;
      if (targetElement) {
        targetElement.style.transform = 'none';
      }
    },
  } as any);

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF(orientation, 'mm', 'a4');
  const imgWidth = pdf.internal.pageSize.getWidth();
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(filename);
}

/**
 * Alias helper accepting either element ID string or HTMLElement
 */
export async function generatePdf(elementOrId: string | HTMLElement, fileName: string) {
  let targetElement: HTMLElement | null = null;
  if (typeof elementOrId === 'string') {
    targetElement = document.getElementById(elementOrId);
  } else {
    targetElement = elementOrId;
  }

  if (!targetElement) {
    console.error(`generatePdf: target element not found for ${elementOrId}`);
    return;
  }

  return generatePdfFromElement(targetElement, fileName);
}

