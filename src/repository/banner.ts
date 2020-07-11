import { Banner } from '../model/banner';
import { AddBannerParams } from '../dto/banner';
import { JsonRepo } from './json_repo';

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

class JsonBannerRepo extends JsonRepo implements BannerRepo {
    private data: JsonData;
    constructor(private sourceDataDir: string) {
        super(sourceDataDir, "banners.data.json");
        const rawData = super.readJSONFile() || '{"meta": {"nextId": 1}, "banners": []}';
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
        super.writeFile(JSON.stringify(this.data));
        return newId;
    }

    public deleteBanner(id: number) {
        const b = this.data.banners.find(v => v.id === id);
        if (!b) {
            return;
        }
        this.data.banners = this.data.banners.filter(v => v.id !== id);
        super.writeFile(JSON.stringify(this.data));
    }

    private newId(): number {
        const k = this.data.meta.nextId;
        this.data.meta.nextId++;
        return k;
    }
}

export {
    BannerRepo,
    JsonBannerRepo,
}