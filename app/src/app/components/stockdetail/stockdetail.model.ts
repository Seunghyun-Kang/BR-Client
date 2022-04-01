export class TradeViewSettings {
    static settings = {
    config: {
      scrollZoom: true,
      responsive: true,
      displayModeBar: true
    },
    data: [
      {
        x: [] as any,
        close: [] as any,
        decreasing: { line: { color: "#4E7FEE" } },
        high: [] as any,
        increasing: { line: { color: "#EE4B28" } },
        line: { color: "rgba(31,119,180,1)" },
        low: [] as any,
        open: [] as any,
        type: "candlestick",
        xaxis: "x",
        yaxis: "y",
        name: "종합 정보"
      },
      {
        x: [] as any,
        y: [] as any,
        line: { color: "#55DC67" },
        type: 'scatter',
        xaxis: "x",
        yaxis: "y",
        name: "종가 추세선"
      }
    ],
    layout: {
      legend:{
        x: 0,
        y: 1,
        traceorder: 'normal',
        font: {
          family: 'poorstory',
          size: 11,
          color: 'white'
        },
        bgcolor: '020922',
      },
      plot_bgcolor: "#131722",
      paper_bgcolor: "#131722",
    //   autosize: true,
        // width: '100%',
        height: '50vh',
    
      margin: {
        r: 30,
        t: 40,
        b: 40,
        l: 50
      },
    dragmode: "pan",
      xaxis: {
        autorange: false,
        title: "날짜",
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
          family: "poorstory",
          size: 14,
          color: "#cccdcd"
        },
        tickfont: {
          family: "poorstory",
          size: 12,
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
          family: "poorstory",
          size: 14,
          color: "#cccdcd"
        },
        tickfont: {
          family: "poorstory",
          size: 12,
          color: "#cccdcd"
        },
        title:"가격"
      },
      annotations: [
      ]
    }
  };
}