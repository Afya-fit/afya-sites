export declare function fetchPublicSiteData(businessId: string): Promise<any>;
export declare function saveSiteDraft(businessId: string, payload: any): Promise<{
    ok: boolean;
    data?: any;
}>;
export declare function publishSite(businessId: string, payload: any): Promise<{
    ok: boolean;
    data?: any;
}>;
export declare function getPublishStatus(taskId: string): Promise<{
    ok: boolean;
    data?: any;
}>;
