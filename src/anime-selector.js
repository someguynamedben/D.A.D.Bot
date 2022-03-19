import {parse} from 'csv-parse';

import fs from 'fs';

/**
 * Select a random anime from a local CSV file (db/anime-list.csv) and return it to a caller
 * 
 * Instructions for generating the anime database are in db/README.md
 * 
 * @returns {Promise<{isError: boolean, count: number, title: string, url: string}>}
 */
export async function selectRandomAnime() {
  try {
    const dbRaw = await fs.promises.readFile('../db/anime-list.csv', 'utf8');
    const dbRecords = await new Promise((resolve, reject) => {
      parse(dbRaw, (err, records) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(records.map(record => { return {title: record[0], url: record[1]}; }));
      });
    });

    const idx = Math.floor(Math.random() * dbRecords.length);
    return {
      isError: false,
      count: dbRecords.length,
      title: dbRecords[idx].title,
      url: dbRecords[idx].url,
    };
  } catch (e) {
    console.error('An unexpected anime selection error occurred: ', e);
    return {
      isError: true,
      count: 0,
      title: 'Blue Exorcist',
      url: 'https://www.crunchyroll.com/blue-exorcist',
    };
  }
};
