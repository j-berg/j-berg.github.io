/*
    Blog processing
*/

// Read in html files in blog folder ending with .html 
var entries = {
    blog3: {
        page: "blog/2021-06-14_Getting-an-F99-K00-Fellowship.html",
        title: "Getting an F99/K00 Fellowship",
        date: "14 Jun 2021",
        tags: ["F99", "K00", "fellowship"],
        summary: "My tips and tricks for the F99/K00 fellowship (whatever they're worth).",
        entry: ""
    },
    blog2: {
        page: "blog/2020-02-14_interactive-article-exploration-previously-undetected-super-spreading.html",
        title: "Interactive Article Exploration: \"Previously undetected super-spreading of <i>Mycobacterium tuberculosis</i> revealed by deep sequencing\"",
        date: "14 Feb 2020",
        tags: ["network", "super-spreader", "outbreak"],
        summary: "A re-visualization of infection spread in a tuberculosis community outbreak.",
        entry: ""
    },
    blog1: {
        page: "blog/2020-01-19_introducing-xpressyourself-an-automated-pipeline-for-ribosome-profiling.html",
        title: "Introducing: XPRESSyourself -- an automated pipeline for ribosome profiling analysis",
        date: "19 Jan 2020",
        tags: ["ribosome-profiling", "sequencing", "pipeline"],
        summary: "A discussion of the software package XPRESSyourself, which introduces new tools for ribosome profiling and acts as a reference pipeline for ribosome profiling data analysis.",
        entry: ""
    },
    blog0: {
        page: "blog/2019-04-09_understanding-scaling-in-heatmaps.html",
        title: "Understanding scaling in heatmaps",
        date: "09 Apr 2019",
        tags: ["heatmaps", "scaling"],
        summary: "A brief summary of the utility of plotting heatmaps using z-scored gene expression values in pattern identification.",
        entry: ""
    }
};

// populate blog-space div 
function populate_entry(entries) {
    var populate = "";
    for (let e in entries) {
        let this_entry = "";
    
        this_entry = this_entry + 
            "<h6>" + entries[e].date + "</h6>"
        for (let t in entries[e].tags) {
            this_entry = this_entry + 
                "<a href='tags.html?" + entries[e].tags[t] + "'><div class='topic-tag'>" + entries[e].tags[t] + "</div></a>";
        }
        entries[e].entry = this_entry;
    
        this_entry = this_entry +
            "<a href='" + entries[e].page + "'><h4>" + entries[e].title + "</h4></a>" +
            "<blockquote class='custom-blockquote'>" + entries[e].summary + "</blockquote>" +
            "<br><br>";
        
        populate = populate + this_entry;
    }
    document.getElementById("blog-space").innerHTML = populate;
}

// populate tag-space div
function add_tags(entries, this_tag) {
    var this_title = "Tag: " + this_tag;
    document.title = this_title;
    document.getElementById("tag-title").innerHTML = this_title;

    var populate = "";
    for (let e in entries) {
        
        if (entries[e].tags.includes(this_tag)) {
            let this_entry = "";
    
            this_entry = this_entry + 
                "<h6>" + entries[e].date + "</h6>"
            for (let t in entries[e].tags) {
                this_entry = this_entry + 
                    "<a href='tags.html?" + entries[e].tags[t] + "'><div class='topic-tag'>" + entries[e].tags[t] + "</div></a>";
            }
            entries[e].entry = this_entry;
        
            this_entry = this_entry +
                "<a href='" + entries[e].page + "'><h4>" + entries[e].title + "</h4></a>" +
                "<blockquote class='custom-blockquote'>" + entries[e].summary + "</blockquote>" +
                "<br><br>";
            
            populate = populate + this_entry;
        }
    }
    document.getElementById("tag-space").innerHTML = populate;
}

window.onload = function () {
    var path = window.location.pathname;
    var page = path.split("/").pop();

    if (page === "blog.html") {
        populate_entry(entries);
    } else {
        var this_tag = location.search.substring(1);
        add_tags(entries, this_tag);
    }
};

