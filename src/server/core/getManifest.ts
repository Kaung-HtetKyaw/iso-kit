import fs from 'fs';
import path from 'path';
import config from './config';

let manifest = null;

const getManifest = (appName: string): { js: string[]; css: string[] } => {
    if (process.isDev) {
        // delete cache
        manifest = null;
    }

    if (manifest === null) {
        try {
            manifest = JSON.parse(
                fs.readFileSync(path.join(__dirname, `./${config.manifestFileName}.json`), { encoding: 'utf8' })
            );
        } catch (error) {
            console.error(error);
            console.error("Couldn't load the manifest");

            return { js: [], css: [] };
        }
    }

    return manifest[appName] || { js: [], css: [] };
};

export default getManifest;
