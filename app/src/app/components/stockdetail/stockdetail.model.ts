export class TradeViewSettings {
    static settings = {
    config: {
      scrollZoom: true,
    //   responsive: true,
      displayModeBar: false
    },
    data: [
      {
        x: [] as any,
        close: [] as any,
        decreasing: { line: { color: "#26a69a" } },
        high: [] as any,
        increasing: { line: { color: "#ef5350" } },
        line: { color: "rgba(31,119,180,1)" },
        low: [] as any,
        open: [] as any,
        type: "candlestick",
        xaxis: "x",
        yaxis: "y",
        name: ""
      }
    ],
    layout: {
      plot_bgcolor: "#131722",
      paper_bgcolor: "#131722",
    //   autosize: true,
    //    width: 100,
    //    height: 200,
    
      // margin: {
      //   r: 10,
      //   t: 0,
      //   b: 40,
      //   l: 60
      // },
    dragmode: "pan",
      xaxis: {
        autorange: false,
        title: "Date",
        rangeselector: {
          xanchor: "left",
          font: { size: 8 },
        },
        range: [] as any,
        rangeslider: {
          visible: false,
          range: [] as any 
        },
        type: "date",
        tickcolor: "#787878",
        linecolor: "#787878",
        gridcolor: "#363c4e",
        titlefont: {
          // family: "Arial, sans-serif",
          size: 18,
          color: "#cccdcd"
        },
        tickfont: {
          // family: "Old Standard TT, serif",
          size: 14,
          color: "#cccdcd"
        }
          },
      yaxis: {
          floor: 0,
        autorange: false,
        range: [] as any,
        type: "linear",
        tickcolor: "#787878",
        linecolor: "#787878",
        gridcolor: "#363c4e",
        titlefont: {
          // family: "Arial, sans-serif",
          size: 18,
          color: "#cccdcd"
        },
        tickfont: {
          // family: "Old Standard TT, serif",
          size: 14,
          color: "#cccdcd"
        },
        title:"Price"
      },
      annotations: [
      ]
    }
  };
}