import { BannerRepo } from '../repository/banner';
import { Banner } from '../model/banner';

class Manager {
    static supportedModules = ['raw_link'];
    constructor(private bannerRepo: BannerRepo) { }
    public allBanners(): Banner[] {
        return this.bannerRepo.list();
    }
    public addBanner(picLink: string, module: string, targetLink: string): Error | undefined {
        if (!targetLink) {
            return Error('must provide an valid target link');
        }
        if (!picLink) {
            return Error('must provide picture link');
        }
        if (!module) {
            return Error('most provide module');
        }
        if (!Manager.supportedModules.includes(module)) {
            return Error('unsupported module '+module);
        }
        return this.bannerRepo.addBanner({
            picAddress: picLink,
            module,
            redirectPostKey: targetLink,
        });
    }
}

export {
    Manager,
};