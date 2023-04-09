public with sharing class AccountInvocable {

    @InvocableMethod(Label = 'Close opportunities'
    description = 'This method going to update the stagename of all opportunities under the given acccount to closed lost' category='Account')
    public static void CloseOpportunities(List<Id> AccountIds){
        //query to get all the opps under the given accounts
        List<Opportunity> opps =[SELECT id, StageName FROM Opportunity WHERE AccountId IN:accountIds AND stageName NOT IN ('Closed Won', 'Closed Lost')];
        for(Opportunity opp : opps){
            opp.StageName = 'Closed Lost';
        }
        If(!opps.isEmpty()){
            try{
                update opps;
            } catch(Exception ex){

            }
            
        }
    }
}
