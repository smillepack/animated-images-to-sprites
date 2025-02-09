import Sharp from "sharp";

console.log("\n\nstart");

const getSpriteSheet = async ({ input, output, columns, rows }) => {
  console.log('getSpriteSheet ', input);

  const { data, info: { pages, pageHeight, width: pageWidth } } = await new Sharp(input, {
    animated: true,
  }).toBuffer({
    resolveWithObject: true,
  });

  console.log(pages, pageWidth, pageHeight);

  const ePageWidth = 730;
  const ePageHeight = 1260;
  console.log('exctract', ePageWidth, ePageHeight);
  const extract = {
    width: ePageWidth,
    height: ePageHeight,
    top: Math.ceil((pageHeight - ePageHeight) / 2),
    left: Math.ceil((pageWidth - ePageWidth) / 2)
  };

  if (true) {
    var rPageWidth = 300;
    var rPageHeight = 518;
  } else {
    var rPageWidth = ePageWidth;
    var rPageHeight = ePageHeight;
  }

  const resize = { width: rPageWidth, height: rPageHeight, fit: 'cover' }
  console.log('resize', rPageWidth, rPageHeight);

  const frames = [];

  if (true) {
    // skip
    for (let i = 0; i < 30; i++) {
      frames.push(new Sharp(data, { page: 0 }).extract(extract).resize(resize));
    }
  } else {
    // regular one
    for (let i = 0; i < pages; i++) {
      frames.push(new Sharp(data, { page: i }).extract(extract).resize(resize));
    }
    if (pages === 29) {
      frames.push(new Sharp(data, { page: 28 }).extract(extract).resize(resize));
    }
  }

  const sprites = await Promise.all(
    frames.map(async (frame, index) => {
      return {
        input: await frame.toBuffer(),
        top: rPageHeight * Math.trunc(index / columns),
        left: rPageWidth * (index % columns)
      };
    }),
  );

  const spriteImage = await new Sharp({
    create: {
      width: rPageWidth * columns,
      height: rPageHeight * rows,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(sprites)
    .png({ compressionLevel: 9, quality: 70 });

  spriteImage
      .toFile(output)
      .then(() => console.info(output, "is created"))
      .catch(() => console.error(output, "is not created"));
};

const columns = 6;
const rows = 5;
const input = './habitats/grassland/animal-idle.8bit.webp';
const output = `./habitats/grassland/animal-skip.png`;

getSpriteSheet({ input, output, columns, rows });
