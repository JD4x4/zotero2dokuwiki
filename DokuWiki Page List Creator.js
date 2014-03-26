{
	"translatorID": "04e8305f-314e-42c6-934a-e6415bc48645",
	"label": "DokuWiki Page List Creator",
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

/* 	Built upon Scannable Cite.js
    by Scott Campbell, Avram Lyon, Nathan Schneider, Sebastian Karcher, Frank Bennett.
    Thanx for your help, Sebastian!

	For creating a DokuWiki page listing zotero item titles, with a unique DokuWiki 
	page name based on the zotero item ID. 
	
	Use: Paste the export output into a DokuWiki page and save. 
	Clicking on a title will then link to a page name that can be created,
	thereby indexing it to your zotero item. */

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
        Zotero.write("[[" + item.key + "|" + item.title + "]],");
        var library_id = item.libraryID ? item.libraryID : 0;
        if (item.creators.length >0){
            mem.set(item.creators[0].lastName);
            if (item.creators.length > 2) mem.set(", et al.");
            else if (item.creators.length == 2) mem.set("& " + item.creators[1].lastName);
        }
        else {
            mem.set(false, "","anon.");
        }
        if (Zotero.getHiddenPref("ODFScan.includeTitle") || item.creators.length === 0) {
            mem.set(item.title,",","(no title)");
        }
        var date = Zotero.Utilities.strToDate(item.date);
        var dateS = (date.year) ? date.year : item.date;
        memdate.set(dateS,"","no date");
		var type = zotero2MyMap[item.itemType];
        Zotero.write(" " + type + ", " + mem.get() + " (" + memdate.get() + ") \\\\ \r");
    }
}
