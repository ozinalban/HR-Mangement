import { LightningElement, track} from 'lwc';
import searchByKeyword from '@salesforce/apex/OnUcPositionDetailsService.searchByKeyword';
import upcomingPosition from '@salesforce/apex/OnUcPositionDetailsService.upcomingPosition';

const COLUMNS = [
    {
        label: "Position",
        fieldName: "detailsPage",
        type: "url",
        wrapText: true,
        typeAttributes: {
            label: {
                fieldName: "Name__c"
            },
            target: "_self"
        }
    },
    {
        label: "Name",
        fieldName: "Name__c",
        wrapText: true,
        cellAttributes: {
            iconName: "standard:event",
            iconPosition: "left"
        }
    },
    {
        label: "HR Manager",
        fieldName: "HRManager",
        wrapText: true,
        cellAttributes: {
            iconName: "standard:user",
            iconPosition: "left"
        }
    },
    {
        label: "Locations",
        fieldName: "Location",
        wrapText: true,
        cellAttributes: {
            iconName: "utility:location",
            iconPosition: "left"
        }
    }
];

export default class PositionListOnUc extends LightningElement {

    columnsList = COLUMNS;
    error;

    startDateTime;

    @track result;
    @track recordsToDisplay;

    connectedCallback() {
        this.upcomingEventsFromApex();
    }

    upcomingEventsFromApex() {
        upcomingPosition()
        .then((data) => {
            console.log("data:" + JSON.stringify(data));

            data.forEach((record) => {
                record.detailsPage = "https://" + window.location.host + "/" + record.Id;
                record.HRManager = record.HR_Manager__r.Name;

                if (record.Locations__c) {
                    record.Location = record.Locations__r.Name;
                } else {
                    record.Location = "This is Virtual Interview";
                }
            });

            this.result = data;
            this.recordsToDisplay = data;
            this.error = undefined;
        })
        .catch((err) => {
            console.log('ERR:' + JSON.stringify(err));
            this.error = JSON.stringify(err);
            this.result = undefined;
        });
    }

    handleSearch(event) {
        let keyword = event.detail.value;

        searchByKeyword({
            name : keyword
        })
        .then((data) => {
            console.log("Apexten dönen data:" + JSON.stringify(data));

            data.forEach((record) => {
                record.detailsPage = "https://" + window.location.host + "/" + record.Id;
                record.HRManager = record.HR_Manager__r.Name;
                record.Location = record.Locations__c ? record.Locations__r.Name : "This is Virtual Interview";
            });

            this.result = data;
            this.recordsToDisplay = data;
            this.error = undefined;
        })
        .catch((err) => {
            console.log('ERR:' + JSON.stringify(err));
            this.error = JSON.stringify(err);
            this.result = undefined;
        });
    }

    handleStartDate(event) {
        let valuedatetime = event.target.value;
        console.log("selectedDate:" + valuedatetime);
        
        let filteredEvents = this.result.filter((record, index, arrayobject) => {
            return record.Start_Date_Time__c >= valuedatetime;
        });

        this.recordsToDisplay = filteredEvents;
    }

    handleLocationSearch(event) {
        let keyword = event.detail.value;

        let filteredEvents = this.result.filter((record, index, arrayobject) => {
            return record.Locations__c.toLowerCase().includes(keyword.toLowerCase());
        });

        if(keyword && keyword.length >= 2) {
            this.recordsToDisplay = filteredEvents;
        } else {
            this.recordsToDisplay = this.result;
        }
    }

}
                
                
                
                
                 
    
