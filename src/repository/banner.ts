import { Banner } from '../model/banner';
import { AddBannerParams } from '../dto/banner';
import fs from 'fs';
import path from 'path';

interface BannerRepo {
    list: () => Banner[];
    addBanner: (b: AddBannerParams) => number;
    deleteBanner: (id: number) => void;
}

type JsonData = {
    meta: {
        nextId: number,
    },
    banners: Banner[],
}

class JsonBannerRepo implements BannerRepo {
    private data: JsonData;
    private filename: string;

    constructor(private sourceDataDir: string) {
        this.filename = path.join(sourceDataDir, "newsdata.json");
        let rawData: string | undefined;
        if (fs.existsSync(this.filename)) {
            rawData = fs.readFileSync(this.filename).toString('utf-8');
        }

        rawData = rawData || '{"meta": {"nextId": 1}, "banners": []}';
        this.data = JSON.parse(rawData);
    }

    public list(): Banner[] {
        return this.data.banners;
    }

    public addBanner(b: AddBannerParams): number {
        const newId = this.newId();
        this.data.banners.push({
            id: newId,
            picAddress: b.picAddress,
            module: b.module,
            redirectPostKey: b.redirectPostKey,
        });
        this.writeData();
        return newId;
    }

    public deleteBanner(id: number) {
        const b = this.data.banners.find(v => v.id === id);
        if (!b) {
            return;
        }
        this.data.banners = this.data.banners.filter(v => v.id !== id);
        this.writeData();
    }

    private newId(): number {
        const k = this.data.meta.nextId;
        this.data.meta.nextId++;
        return k;
    }

    private writeData() {
        try {
            if (!fs.existsSync(this.sourceDataDir)) {
                fs.mkdirSync(this.sourceDataDir, { recursive: true });
            }
            fs.writeFileSync(this.filename, JSON.stringify(this.data));
        } catch (error) {
            return error;
        }
    }
}

export {
    BannerRepo,
    JsonBannerRepo,
}