import path from 'path';
import fs from 'fs';

class JsonRepo {
    protected filename: string;
    constructor(private dataDir: string, private jsonFileName: string) {
        this.filename = path.join(dataDir, jsonFileName);
    }
    protected readJSONFile(): string | undefined {
        let rawData: string | undefined;
        if (fs.existsSync(this.filename)) {
            rawData = fs.readFileSync(this.filename).toString('utf-8');
        }
        return rawData;
    }
    protected writeFile(jsonString: string) {
        try {
            if (!fs.existsSync(this.dataDir)) {
                fs.mkdirSync(this.dataDir, { recursive: true });
            }
            fs.writeFileSync(this.filename, jsonString);
        } catch (error) {
            return error;
        }
    }
}

export {
    JsonRepo,
}