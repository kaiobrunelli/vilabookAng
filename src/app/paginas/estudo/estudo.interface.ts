export interface TibiaCreaturesResponse {
    creatures: {
        creatures: TibiaCreature[];
    }
}

export interface TibiaCreature {
    name: string;
    race: string;
    image_url: string;
    featured: boolean;
}

export interface TibiaBoss {
    featured: boolean;
    image_url: string;
    name: string;
}

export interface TibiaBoostableBosses {
    boostable_boss_list: TibiaBoss[];
    boosted: TibiaBoss;
}

export interface TibiaApi {
    commit: string;
    release: string;
    version: number;
}

export interface TibiaStatus {
    error: number;
    http_code: number;
    message: string;
}

export interface TibiaInformation {
    api: TibiaApi;
    status: TibiaStatus;
    tibia_urls: string[];
    timestamp: string;
}

export interface TibiaBoostableBossesResponse {
    boostable_bosses: TibiaBoostableBosses;
    information: TibiaInformation; // 👈 estava faltando aqui
}
