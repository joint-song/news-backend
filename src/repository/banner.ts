import { Banner } from '../model/banner';
import fs from 'fs';
import path from 'path';

interface BannerRepo {
    list: () => Banner[];
    addBanner: (b: Banner) => Error | undefined;
}

class JsonBannerRepo implements BannerRepo {
    private data: Banner[];
    private filename: string;
    constructor(private sourceDataDir: string) {
        this.filename = path.join(sourceDataDir, "banner.json");
        let rawData: string | undefined;
        if (fs.existsSync(this.filename)) {
            rawData = fs.readFileSync(this.filename).toString('utf-8');
        }
        rawData = rawData || '[]';
        this.data = JSON.parse(rawData);
    }

    public list(): Banner[] {
        return this.data;
    }

    public addBanner(b: Banner): Error | undefined {
        try {
            if (!fs.existsSync(this.sourceDataDir)) {
                fs.mkdirSync(this.sourceDataDir, { recursive: true });
            }
            fs.writeFileSync(this.filename, JSON.stringify([...this.data, b]));
        } catch (error) {
            return error;
        }
        this.data.push(b);
    }
}

export {
    BannerRepo,
    JsonBannerRepo,
}