import sharp from 'sharp';

export async function generateBlurPlaceholder(src: string, width = 20) {
  const placeholder = sharp(src).resize({
    width,
    fit: 'cover',
  });

  const buffer = await placeholder.toBuffer();

  return `data:image/png;base64, ${buffer.toString('base64')}`;
}
