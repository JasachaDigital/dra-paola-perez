// Genera las imágenes optimizadas de images/ a partir de los originales en src/images/.
// Fotos -> WebP (máx. 1600 px de ancho). Logos y favicon -> PNG reducido.
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = 'src/images';
const OUT = 'images';

// Ancho máximo según cómo se muestra cada imagen en la web
const MAX_WIDTH = {
    'doctora-principio-1.png': 400,
    'doctora-principio-2.png': 400,
    'doctora-principio-3.png': 400,
    'glow-hidralips.jpg': 740,
};
const PNG_KEEP = {
    'logo.png': 480,
    'logon.png': 480,
    'favicon.png': 192,
};

fs.mkdirSync(OUT, { recursive: true });
let before = 0, after = 0;

for (const file of fs.readdirSync(SRC)) {
    if (!/\.(png|jpe?g)$/i.test(file)) continue;
    const input = path.join(SRC, file);
    before += fs.statSync(input).size;

    let output;
    if (PNG_KEEP[file]) {
        output = path.join(OUT, file);
        await sharp(input)
            .resize({ width: PNG_KEEP[file], withoutEnlargement: true })
            .png({ compressionLevel: 9, palette: true, quality: 90 })
            .toFile(output);
    } else {
        output = path.join(OUT, file.replace(/\.(png|jpe?g)$/i, '.webp'));
        await sharp(input)
            .rotate()
            .resize({ width: MAX_WIDTH[file] || 1600, withoutEnlargement: true })
            .webp({ quality: 78, effort: 6 })
            .toFile(output);
    }
    const size = fs.statSync(output).size;
    after += size;
    console.log(`${file.padEnd(34)} -> ${path.basename(output).padEnd(34)} ${(size / 1024).toFixed(0)} KB`);
}

console.log(`\nTotal: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);

// Imagen para compartir en redes/WhatsApp (Open Graph), 1200x630
const doctora = await sharp(path.join(SRC, 'hero-doctora-gomitas.png'))
    .resize({ height: 630 })
    .toBuffer();
const logo = await sharp(path.join(SRC, 'logo.png'))
    .resize({ width: 520 })
    .toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#F3ECDC' } })
    .composite([
        { input: doctora, top: 0, left: 1200 - 471 },
        { input: logo, top: 175, left: 90 },
    ])
    .jpeg({ quality: 82 })
    .toFile(path.join(OUT, 'og-image.jpg'));
console.log('og-image.jpg generado');
