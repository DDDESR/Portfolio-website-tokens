import StyleDictionary from 'style-dictionary';
import { register, expandTypesMap } from '@tokens-studio/sd-transforms';

register(StyleDictionary);

const coreSources = [
  'tokens/Core.json',
  'tokens/Brand/Alpha.json',
  'tokens/System.json',
];

// Build core, alpha brand and system
const sdBase = new StyleDictionary({
  log: {
    verbosity: 'silent',
    errors: { brokenReferences: 'warn' },
  },
  source: coreSources,
  preprocessors: ['tokens-studio'],
  expand: { typesMap: expandTypesMap },
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      buildPath: 'dist/',
      files: [
        {
          destination: 'core.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('Core.json'),
        },
        {
          destination: 'brand/alpha.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('Brand/Alpha.json'),
        },
        {
          destination: 'system.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('System.json'),
        },
      ],
    },
  },
});

await sdBase.cleanAllPlatforms();
await sdBase.buildAllPlatforms();

// Build bravo brand separately
const sdBravo = new StyleDictionary({
  log: {
    verbosity: 'silent',
    errors: { brokenReferences: 'warn' },
  },
  source: [
    'tokens/Core.json',
    'tokens/Brand/Bravo.json',
    'tokens/System.json',
  ],
  preprocessors: ['tokens-studio'],
  expand: { typesMap: expandTypesMap },
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      transforms: ['name/kebab'],
      buildPath: 'dist/',
      files: [
        {
          destination: 'brand/bravo.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('Brand/Bravo.json'),
        },
      ],
    },
  },
});

await sdBravo.cleanAllPlatforms();
await sdBravo.buildAllPlatforms();

// Build each responsive file separately
const breakpoints = [
  { name: 'desktop', file: 'tokens/Responsive/Desktop.json' },
  { name: 'laptop',  file: 'tokens/Responsive/Laptop.json'  },
  { name: 'mobile',  file: 'tokens/Responsive/Mobile.json'  },
];

for (const bp of breakpoints) {
  const sd = new StyleDictionary({
    log: {
      verbosity: 'silent',
      errors: { brokenReferences: 'warn' },
    },
    source: [...coreSources, bp.file],
    preprocessors: ['tokens-studio'],
    expand: { typesMap: expandTypesMap },
    platforms: {
      css: {
        transformGroup: 'tokens-studio',
        transforms: ['name/kebab'],
        buildPath: 'dist/',
        files: [
          {
            destination: `responsive/${bp.name}.css`,
            format: 'css/variables',
            filter: (token) => token.filePath.includes(bp.file),
          },
        ],
      },
    },
  });

  await sd.cleanAllPlatforms();
  await sd.buildAllPlatforms();
}