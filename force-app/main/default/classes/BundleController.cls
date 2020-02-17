global with sharing class BundleController {
    @AuraEnabled(cacheable=true)
    public static List<Bundle_Item__c> getBundleItems(Id bundleId) {
        return [
            SELECT
                Id,
                Merchandise__r.Name,
                Merchandise__r.Title__c,
                Merchandise__r.Price__c,
                Merchandise__r.Category__c,
                Merchandise__r.Picture_URL__c,
                Qty__c
            FROM Bundle_Item__c
            WHERE Bundle__c = :bundleId
            WITH SECURITY_ENFORCED
        ];
    }
}
