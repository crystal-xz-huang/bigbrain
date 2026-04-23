import 'server-only';

import * as fs from 'node:fs';
import path from 'node:path';
import { unslugify } from '@/lib/utils';

/***************************************************************
                      Public Assets
***************************************************************/

const EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.svg'];
const DIRNAMES = {
  AVATAR: 'avatars',
  DOGS: 'animals/dogs',
  CATS: 'animals/cats',
  CAT_BREED_COMPARISON: 'animals/cats/breed_comparison',
};

// Get the public directory path for a given directory
const getPublicDirPath = (dir: string): string =>
  path.join(process.cwd(), 'public', dir);

// Get the public file path for a given directory and file name
const getPublicFilePath = (dir: string, file: string): string => {
  const filepath = path.join(process.cwd(), 'public', dir, file);
  if (!fs.existsSync(filepath) || !fs.statSync(filepath).isFile()) {
    throw new Error(`File not found: ${filepath}`);
  }
  return filepath;
};

/**
 * Get the list of avatar image URLs (served from @public).
 * @returns {string[]} Array of avatar file paths.
 * @throws {Error} If the directory is empty or does not exist.
 */
export function getAvatarImages(): string[] {
  const dirpath = getPublicDirPath(DIRNAMES.AVATAR);
  return fs
    .readdirSync(dirpath)
    .filter((f) => EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .sort()
    .map((f) => getPublicFilePath(DIRNAMES.AVATAR, f));
}

/**
 * Get a dictionary of dog breeds and their image URLs (served from @public).
 * @return {Record<string, string[]>} Dictionary where keys are breed names and values are arrays of image URLs.
 * @throws {Error} If the directory is empty or does not exist.
 */
export function getDogBreedImages(): Record<string, string[]> {
  const dirpath = getPublicDirPath(DIRNAMES.DOGS);
  if (!fs.existsSync(dirpath) || !fs.statSync(dirpath).isDirectory())
    throw new Error(`Directory not found: ${dirpath}`);

  const imagesByBreed: Record<string, string[]> = {};
  const entries = fs.readdirSync(dirpath, { withFileTypes: true });

  for (const ent of entries) {
    if (!ent.isFile()) continue;
    const ext = path.extname(ent.name).toLowerCase();
    if (!EXTENSIONS.includes(ext)) continue;

    // remove the "-dog" suffix from the basename
    const base = path.basename(ent.name, ext); // "akita"
    const breed = unslugify(base); // "akita" => "Akita"
    if (!breed) continue;

    const url = `${DIRNAMES.DOGS}/${ent.name}`; // e.g. "/animals/dogs/akita-dog.jpg"
    (imagesByBreed[breed] ||= []).push(url);
  }

  if (Object.keys(imagesByBreed).length === 0)
    throw new Error(`No valid dog images found in: ${dirpath}`);

  for (const k of Object.keys(imagesByBreed)) imagesByBreed[k].sort();
  return imagesByBreed;
}

/**
 * Get a dictionary of cat breeds and their image URLs (served from @public).
 * @return {Record<string, string[]>} Dictionary where keys are breed names and values are arrays of image URLs.
 * @throws {Error} If the directory is empty or does not exist.
 */
export function getCatBreedImages(): Record<string, string[]> {
  const dirpath = getPublicDirPath(DIRNAMES.CATS);
  if (!fs.existsSync(dirpath) || !fs.statSync(dirpath).isDirectory())
    throw new Error(`Directory not found: ${dirpath}`);

  const imagesByBreed: Record<string, string[]> = {};
  const entries = fs.readdirSync(dirpath, { withFileTypes: true });

  for (const ent of entries) {
    if (!ent.isFile()) continue;
    const ext = path.extname(ent.name).toLowerCase();
    if (!EXTENSIONS.includes(ext)) continue;

    // remove the "-cat" suffix from the basename
    const base = path.basename(ent.name, ext); // "bengal"
    const breed = unslugify(base); // "bengal" => "Bengal"
    if (!breed) continue;

    const url = `${DIRNAMES.CATS}/${ent.name}`; // e.g. "/animals/cats/bengal-cat.jpg"
    (imagesByBreed[breed] ||= []).push(url); // e.g. { "Bengal": ["/animals/cats/bengal-cat.jpg"] }
  }
  if (Object.keys(imagesByBreed).length === 0)
    throw new Error(`No valid cat images found in: ${dirpath}`);

  for (const k of Object.keys(imagesByBreed)) imagesByBreed[k].sort();
  return imagesByBreed;
}
/**
 * Get a dictionary of cat breed comparison images (served from @public).
 * The directory structure is expected to be:
 * @public/animals/cats/breed_comparison/{breed}/{image}
 * @returns {Record<string, string[]>} Dictionary where keys are breed names and values are arrays of image URLs.
 * @throws {Error} If the directory does not exist or is not a directory.
 */
export function getCatBreedComparisonImages(): Record<string, string[]> {
  const dirpath = getPublicDirPath(DIRNAMES.CAT_BREED_COMPARISON);
  if (!fs.existsSync(dirpath) || !fs.statSync(dirpath).isDirectory()) {
    throw new Error(`Directory not found: ${dirpath}`);
  }

  const imagesByBreed: Record<string, string[]> = {};
  const breeds = fs
    .readdirSync(dirpath, { withFileTypes: true })
    .filter((ent) => ent.isDirectory());

  for (const breedDir of breeds) {
    const breedName = unslugify(breedDir.name);
    if (!breedName) continue;

    const images = fs
      .readdirSync(path.join(dirpath, breedDir.name), {
        withFileTypes: true,
      })
      .filter(
        (f) =>
          f.isFile() && EXTENSIONS.includes(path.extname(f.name).toLowerCase())
      )
      .map((f) =>
        getPublicFilePath(
          DIRNAMES.CAT_BREED_COMPARISON,
          `${breedDir.name}/${f.name}`
        )
      )
      // .map((f) => `/animals/cats/breed_comparison/${breedDir.name}/${f.name}`)
      .sort();

    if (images.length > 0) imagesByBreed[breedName] = images;
  }

  return imagesByBreed;
}

/**
 * Get a random file from a list of files.
 * If a key is provided, it will use the key to deterministically select a file.
 * @param {string[]} list - List of file paths.
 * @param {string} [key] - Optional key to deterministically select a file.
 * @returns {string} Random file path from the list.
 * @throws {Error} If the list is empty.
 */
export function getRandomFile(list: string[], key?: string): string {
  if (list.length === 0) throw new Error('Empty list');
  if (!key) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  } else {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    const index = h % list.length;
    return list[index];
  }
}
