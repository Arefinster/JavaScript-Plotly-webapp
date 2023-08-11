// 1. Read in the json sample data from the given url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let jsonData;
dataPromise = d3.json(url);
dataPromise.then(data => {
    console.log("JSON data: ", data);  // Logs the JSON data to the console
    // Here we are going to execute our sequence of routines
    jsonData = data;
    let Names = data.names;
    let dropdown = d3.select("#selDataset"); // Select the dropdown element using D3
    // Append the default option
    dropdown.append("option").text("Select an ID").attr("value", "").property("selected", true);

    // Populate the dropdown using D3's data join
    dropdown.selectAll("option:not(:first-child)").data(Names).enter().append("option").text(d => d).attr("value", d => d);    
}).catch(error => {
    console.error("Error fetching or parsing the data:", error);
});

// 2. Dataset selector and retrieval
function optionChanged(selectedID){
    // Just checking if the data is globally available
    if (jsonData) {
        console.log("data length: ", jsonData.samples.length);
    }
    //-------
    // First acquire the sample data from the selected ID
    let sampleObject = {}; // Declare an empty object to hold the filtered content
    let metadataObject;
    for(let i = 0; i < jsonData.samples.length; i++){
        // Filtering out the specific data
        if((jsonData.samples)[i].id == selectedID){
            // Obtain a sample from the list
            sampleObject.sample_values = (jsonData.samples)[i].sample_values;
            sampleObject.otu_ids = (jsonData.samples)[i].otu_ids;
            sampleObject.otu_labels = (jsonData.samples)[i].otu_labels;
            // Obtain the metadata
            metadataObject = (jsonData.metadata)[i];
            // console.log("selected sample: ", sampleObject);
            break;            
        }
    }
    console.log("sampleObject: ", sampleObject);
    console.log("metadataObject: ", metadataObject);

    // Update the "Demographic Info panel"
    let panel = d3.select("#sample-metadata");
    panel.html(""); // Clear any existing metadata
    // Loop through each data entry in the object and append to panel
    Object.entries(metadataObject).forEach(([key, value]) => {
        panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
    
    // Invoke the bar chart function and deploy it to the right spot
    plotBarChart(sampleObject, selectedID);
    // Invoke the bubble chart function and deploy it to the right spot
    plotBubbleChart(sampleObject, selectedID)
}

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function plotBarChart(sampleObject, selectedID){            
    let sortedIndices = sampleObject.sample_values.map((value, index) => index) // sort in descending order
                                                  .sort((a, b) => sampleObject.sample_values[b] - sampleObject.sample_values[a]);
    let top10Samples = sortedIndices.slice(0, 10); // Obtain the top 10 OTUs

    // Trace for the Sample Data
    let trace = {
        x: top10Samples.map(i => sampleObject.sample_values[i]).reverse(),
        y: top10Samples.map(i => `OTU ${sampleObject.otu_ids[i]}`).reverse(),
        text: top10Samples.map(i => sampleObject.otu_labels[i]).reverse(),
        type: "bar",
        orientation: "h"
    };
    // Layout
    let layout = {
        title: `Top 10 OTUs for id: ${selectedID}`,
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
      };
      Plotly.newPlot("bar", [trace], layout);    
}

// Create a bubble chart that displays each sample.
function plotBubbleChart(sampleObject, selectedID) {
    let trace = {
        x: sampleObject.otu_ids,
        y: sampleObject.sample_values,
        text: sampleObject.otu_labels,
        mode: 'markers',
        marker: {
            size: sampleObject.sample_values, // To set size based on the value in the 'sample_values' array
            color: sampleObject.otu_ids, // To set color based on OTU ID
            colorscale: 'Portland',  // Colorscale
            sizemode: 'diameter'  // Sizemode as diameter
        }
    };

    let layout = {
        title: `Bubble Chart for id: ${selectedID}`,
        showlegend: false,
        height: 600,
        width: 1200,
        xaxis: { title: "OTU IDs" },
    };

    Plotly.newPlot("bubble", [trace], layout);
}

function plotGuageChart(sampleObject, selectedID){

}