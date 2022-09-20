// Dropdown menu function for selection 
d3.selectAll("#selDataset").on("change", selection)

// Dropdown menu values   
d3.json("../data/samples.json").then(function(dataOtu){

    var names_list = dataOtu.names;
 
    buildPlot(names_list[0]);
    
    // Loop for new options in the dropdown menu using d3
    var dropDownMenu = d3.select("#selDataset");
    dropDownMenu.selectAll("option").data(names_list).enter().append("option").text(function(d) {
        return d;
         })
           .attr("value", function(d) {
        return d;
        });
});

// Dropdown menue selection and buildplot function based on selection
function selection(){
    
    var dropDownMenu = d3.select("#selDataset")
   
    var input = dropDownMenu.node().value;
    
    buildPlot(input)
};

function buildPlot(input) {
    d3.json("../data/samples.json").then(function(dataOtu){
        // Names List
        var names_list = dataOtu.names;
        
        // Index value based on name selected 
        var sample_id = names_list.findIndex(i => i == input);
        
        // Graphs data 
        var otu_IDs = dataOtu.samples[sample_id].otu_ids; 
        var samp_Values = dataOtu.samples[sample_id].sample_values;
        var otu_Labels = dataOtu.samples[sample_id].otu_labels; 

       
        otuIDs = otu_IDs.slice(0,10);
        otuIDs = otuIDs.map(s => `OTU ${s}`).reverse();
        sampValues = samp_Values.slice(0,10).reverse();
        otuLabels = otu_Labels.slice(0,10).reverse();

        // Bar Chart
        var trace = {
            x: sampValues,
            y: otuIDs,
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };
        var layout = {
        };
        var data = [trace];
        Plotly.newPlot("bar", data, layout);

        // Bubble Chart
        var trace1 = {
            x: otu_IDs,
            y: samp_Values,
            text: otu_Labels,
            mode: 'markers',
            marker: {
              size: samp_Values,
              color: otu_IDs,
              colorscale: [[0, '#4b4ba9'], [.2, '#54d2b0'],[.2, '#7fe36b'],[.5, '#c0ea6e'],[.5, '#99752b'],[1, '#d7c7b9']]
            }
        };
        var data = [trace1];  
        var layout = {
            xaxis: {title: 'OTU ID'},
            showlegend: false,
        };
        Plotly.newPlot('bubble', data, layout);

        // Clearing  all data for new menue selection for Metadata
        d3.select("#sample-metadata").selectAll("p").remove();
       
        var meta_text = dataOtu.metadata[sample_id];

      
        var m_keys = Object.entries(meta_text);

        
        var meta_data = d3.select("#sample-metadata");

        // Loop for demographics info 
        m_keys.forEach(function(m_data){
        meta_data.append("p").text(`${m_data[0]}: ${m_data[1]}`)
        });

        // Wash frequency for guage
        var wash_freq = meta_text.wfreq
             
        guage(wash_freq)
    }); 
};