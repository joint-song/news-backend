import { BannerRepo } from '../repository/banner';
import { Banner } from '../model/banner';

class Manager {
    static supportedModules = ['raw_link'];
    constructor(private bannerRepo: BannerRepo) { }
    public allBanners(): Banner[] {
        return this.bannerRepo.list();
    }
    public addBanner(picLink: string, module: string, targetLink: string): number {
        if (!targetLink) {
            throw Error('must provide an valid target link');
        }
        if (!picLink) {
            throw Error('must provide picture link');
        }
        if (!module) {
            throw Error('most provide module');
        }
        if (!Manager.supportedModules.includes(module)) {
            throw Error('unsupported module '+module);
        }
        return this.bannerRepo.addBanner({
            picAddress: picLink,
            module,
            redirectPostKey: targetLink,
        });
    }
    public deleteBanner(id: number) {
        this.bannerRepo.deleteBanner(id);
    }
}

export {
    Manager,
};