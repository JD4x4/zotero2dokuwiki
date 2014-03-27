{
	"translatorID": "0295ad17-43d1-4619-9a67-bd751c2d345b",
	"label": "DokuWiki Page Export",
	"creator": "Jim Davis",
	"target": "txt",
	"minVersion": "3.0",
	"maxVersion": "",
	"priority": 100,
	"displayOptions": {
		"exportCharset": "UTF-8"
	},
	"inRepository": false,
	"translatorType": 2,
	"browserSupport": "",
	"lastUpdated": "2013-04-16 11:10:08"
}

/* 	Thanx for your help, Sebastian!

	For creating a DokuWiki page entry with Heading (title), Item Type, Abstract, 
	DokuWiki footnote citation, zotero ID reference, and tags. 
	
	Use: Paste the export output into a DokuWiki page and save. 
	Requires use of Wrap and Tag plugins for DokuWiki.*/

// type map
var zotero2MyMap = {
	"book": "Book",
	"bookSection": "Book Section",
	"journalArticle": "Journal Article",
	"magazineArticle": "Magazine Article",
	"newspaperArticle": "Newspaper Article",
	"thesis": "Thesis",
	"letter": "Letter",
	"manuscript": "Manuscript",
	"interview": "Interview",
	"film": "movie",
	"artwork": "Artwork",
	"webpage": "Web Page",
	"conferencePaper": "Conference Paper",
	"report": "Report",
	"bill": "Bill",
	"case": "Case",
	"hearing": "Hearing",
	"patent": "Patent",
	"statute": "Statute",
	"email": "e-mail",
	"map": "Map",
	"blogPost": "Blog Post",
	"instantMessage": "Instant Message",
	"forumPost": "Forum Post",
	"audioRecording": "Audio",
	"presentation": "Presentation",
	"videoRecording": "Video",
	"tvBroadcast": "TV Broadcast",
	"radioBroadcast": "Radio Broadcast",
	"podcast": "Podcast",
	"computerProgram": "Software",
	"document": "Document",
	"encyclopediaArticle": "Encylopedia Article",
	"dictionaryEntry": "Dictionary Entry"
};

// legal types are weird
var LEGAL_TYPES = ["bill","case","gazette","hearing","patent","regulation","statute","treaty"];
var Mem = function (item) {
    var lst = [];
    var isLegal = isLegal = (LEGAL_TYPES.indexOf(item.itemType)>-1);
    this.set = function (str, punc, slug) { if (!punc) {punc=""}; if (str) {lst.push((str + punc))} else if (!isLegal) {lst.push(slug)}};
    this.setlaw = function (str, punc) { if (!punc) {punc=""}; if (str && isLegal) {lst.push(str + punc)}};
    this.get = function () { return lst.join(" ") };
}


function doExport() {
    var item;
    while (item = Zotero.nextItem()) {
        var mem = new Mem(item);
        var memdate = new Mem(item);
		var type = zotero2MyMap[item.itemType];
        var library_id = item.libraryID ? item.libraryID : 0;
        var date = Zotero.Utilities.strToDate(item.date);
        // Format the accessDate (remove time)
		var accessYMD = item.accessDate.replace(/\s*\d+:\d+:\d+/, "");
        var dateS = (date.year) ? date.year : item.date;
        memdate.set(dateS,"","no date");

        // Check for author, use anon. if needed, and use 2 Authors max
        if (item.creators.length >0){
            mem.set(item.creators[0].lastName);
            if (item.creators.length > 2) mem.set(", et al.");
            else if (item.creators.length == 2) mem.set("& " + item.creators[1].lastName);
        }
        else {
            mem.set(false, "","anon.");
        }


        // Begin the Output
        Zotero.write("====" + item.title + "====\r");
        Zotero.write("<wrap lo>**" + type + "**</wrap> ");
        Zotero.write("  ((" + mem.get() + " (" + memdate.get() + "), " + item.title + ", ");

        // Check for a url, if none then do a Google Scholar link on the DOI
        if (item.url) {
            Zotero.write("[[" + item.url + "]]");
            Zotero.write(" accessed: " + accessYMD);
        }
        else {
            Zotero.write("[[http://scholar.google.com/scholar?q=" + item.DOI + "]]");
        }
        Zotero.write("))\r\r");

        // Write the Abstract
        Zotero.write(item.abstractNote + "\r");
        Zotero.write("\r----\r");

        // List the zoteroID 
        Zotero.write(" z-ref: " + item.key + "\r\r");

        // Write tags
        if(item.tags && item.tags.length) {
            var tagString = "";
			for(var i in item.tags) {
			   var tag = item.tags[i];
               tagString += tag.tag + "\r";
            }
		    Zotero.write("{{tag>" + tagString + "}}");
		}        
    }
}
