// 1. Use D3 library to read in samples.json file

function init() {
    d3.json("samples.json").then((data) => {

        // now adding data to dropdown menu

        var DropdownMenu = d3.select("#selDataset");
        var mNames = data.names;
        mNames.forEach((name) => {
              var mNames = DropdownMenu.append("option")
                           .attr("value", name)
                           .text(name);
        })

        //2.  Now create a Horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
        // Use sample_values as the values for the bar chart.

        var values = data.samples[0].sample_values;

        // Use otu_ids as a labels for this chart

        var labels = data.samples[0].otu_ids;

        // Use otu_labels as the hovertext for the chart

        var hovertext = data.samples[0].otu_labels;

        var top_10Values = values.slice(0,10).reverse();
        var top_10Labels = labels.slice(0,10).reverse();
        var top_10Hovertext = hovertext.slice(0,10).reverse();
        var barChartDiv = d3.select("#bar");

        var trace1 = {
            y: top_10Labels.map(Object => "OTU " + Object),
            x: top_10Values,
            text: top_10Hovertext,
            type: "bar",
            orientation: "h"

        };


        var layout = {
            margin: {
                t: 20,
                b: 20
            }
        };

        var barchartData = [trace1]

        Plotly.newPlot("bar", barchartData, layout);

        // 3. create a bubble chart that doisplays each sample.

        var trace2 = {
            x: labels,
            y: values,
            text: hovertext,
            mode: "markers",

            
            marker: {

                // Use sample_values for the marker size
                size: values,

                // Use otu_ids for the marker colors
                color: labels,
            }
        }

        var BubbleData = [trace2];
        
        var layoutBubble = {
            xaxis: {title: "OTU ID"},
        }

        Plotly.newPlot("bubble", BubbleData, layoutBubble);

        var sampleMetadata = d3.select("#sample-metadata");
        var FirstName = data.metadata[0];

        // display key-value pair

        Object.entries(FirstName).forEach(([key, value]) => {
            sampleMetadata.append("p").text(`${key}: ${value}`);

        })
    });
}

// Update plots and metadata 
// 6. Update all of the plots any time that a new sample is selected.

function optionChanged(selectValue) {
    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        var newSample = samples.filter(sample => sample.id === selectValue);
        
        // Use sample_values for the y values
        var values = newSample[0].sample_values;

        // Use otu_ids for the x values
        var labels = newSample[0].otu_ids;

       // Use otu_labels for the text values 
        var hovertext = newSample[0].otu_labels;
        var top_10Values = values.slice(0,10).reverse();
        var top_10Labels = labels.slice(0,10).reverse();
        var top_10Hovertext = hovertext.slice(0,10).reverse();

        var barChartDiv = d3.select("#bar");

        // now using restyle for update barchart

        Plotly.restyle("bar", "y", [top_10Labels.map(Object => "OTU " + Object)]);
        Plotly.restyle("bar", "x", [top_10Values]);
        Plotly.restyle("bar", "text", [top_10Hovertext]);

        // Update values for Bubblechart

        Plotly.restyle("bubble", "x", [labels]);
        Plotly.restyle("bubble", "y", [values]);
        Plotly.restyle("bubble", "size", [values]);
        Plotly.restyle("bubble", "text", [hovertext]);
        Plotly.restyle("bubble", "color", [labels]);


       // 4. Display the sample metadata, i.e, an individual's demographic information.
        var sampleMetadata = d3.select("#sample-metadata");
        sampleMetadata.html("");
 
        var Demographics = data.metadata;
        var newMetaData = Demographics.filter(sample => sample.id === parseInt(selectValue));


       // 5. Display each key-value pair from the metadata JSON object somewhere on the page.
        Object.entries(newMetaData[0]).forEach(([key, value]) => {
            sampleMetadata.append("p").text(`${key}: ${value}`);
        })
    });
}
 
init();
